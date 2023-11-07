import * as dotenv from 'dotenv'
import { MnemonicKey, LCDClient, MsgExecuteContract } from '@terra-money/feather.js';
import * as fs from 'fs';
import csvParser from 'csv-parser';
import * as _ from 'lodash';

dotenv.config()

interface User {
    id?: number;

    ip: string;
    terraAddress: string;
    accumulatedRewards: number;
    multipliedAcculumatedRewards?: number;
    score: number;
    ordosAddress: string;
    corrinoAddress: string;
    atreidesAddress: string;
    harkonnenAddress: string;
}

const readUsersData = (): Promise<User[]> => {
    return new Promise((resolve, reject) => {
        const users: User[] = [];

        fs.createReadStream('./scripts/.users.csv')
            .pipe(csvParser())
            .on('data', (data: any) => {
                const {
                    ip,
                    terraAddress,
                    accumulatedRewards,
                    score,
                    ordosAddress,
                    corrinoAddress,
                    atreidesAddress,
                    harkonnenAddress,
                } = data;

                const user: User = {
                    ip: ip as string,
                    terraAddress: terraAddress as string,
                    accumulatedRewards: parseInt(accumulatedRewards),
                    score: parseInt(score),
                    ordosAddress: ordosAddress as string,
                    corrinoAddress: corrinoAddress as string,
                    atreidesAddress: atreidesAddress as string,
                    harkonnenAddress: harkonnenAddress as string,
                };

                users.push(user);
            })
            .on('end', () => {
                resolve(users);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

const objectToCsv = (users: User[]): string => {
    // Get the headers (keys of the objects)
    const headers = Object.keys(users[0]);

    // Convert array of objects to array of arrays
    const rows = users.map((obj: any) => headers.map((header: any) => obj[header]));

    // Format the CSV
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');

    return csvContent;
};

const filterData = (users: User[]): any[] => {
    // 1. Group by ip
    const groupedByIP = _.groupBy(users, 'ip');

    // 2. Accumulate the score and accumulatedRewards for each group 
    const accumulatedUsers = _.map(groupedByIP, usersWithSameIP => {
        // Sort by score and accumulatedRewards in descending order
        const sortedUsers = _.orderBy(usersWithSameIP, ['accumulatedRewards', 'score'], ['desc', 'desc']);
        const topUser = _.head(sortedUsers) as User;

        // Accumulate the values for the top user
        return {
            ip: topUser.ip,
            terraAddress: topUser.terraAddress,
            accumulatedRewards: _.sumBy(sortedUsers, 'accumulatedRewards'),
            score: _.sumBy(sortedUsers, 'score'),
        };
    });
    let sortedUsers = _.orderBy(accumulatedUsers, ['accumulatedRewards', 'score'], ['desc', 'desc']);
    // 3. Sort the accumulated users by accumulatedRewards and score in descending order
    return sortedUsers.map((user, index) => {
        return {
            id: index + 1,
            multipliedAcculumatedRewards: user.accumulatedRewards * user.score,
            ...user,
        };
    });
}

const submitOnChain = async (users: Array<User>) => {
    // Create the LCD Client to interact with the blockchain
    const lcd = LCDClient.fromDefaultConfig("testnet");

    // Get all information from the deployer wallet
    const mk = new MnemonicKey({ mnemonic: process.env.MNEMONIC });
    const wallet = lcd.wallet(mk);
    const accAddress = wallet.key.accAddress("terra");
    const contractAdress = fs.readFileSync('./scripts/.nft_minter_contract_address.log').toString();

    let msg: any = {};
    let chunkLength = 500;
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        msg[user.terraAddress] = {
            "token_id": user.id?.toString(),
            "extension": {
                "name": `AllianceNFT DAO Membership #${user.id?.toString()}`,
                "description": "Received for participating on Game Of Alliance",
                "image": "https://ipfs.io/ipfs/{hash}",     // TODO: find in csv
                "attributes": [{
                    "display_type": "",
                    "trait_type": "planet",
                    "value": "fire"                         // TODO: find in csv
                }, {
                    "display_type": "",
                    "trait_type": "inhabitant",
                    "value": "water"                        // TODO: find in csv
                }, {
                    "display_type": "",
                    "trait_type": "object",
                    "value": "sword"                        // TODO: find in csv
                }, {
                    "display_type": "",
                    "trait_type": "rarity",
                    "value": "11"                           // TODO: find in csv
                }],
                "image_data": "",
                "external_url": "",
                "background_color": "",
                "animation_url": "",
                "youtube_url": "",
            }
        };

        try {
            if (i % chunkLength === 0) {
                const tx = await wallet.createAndSignTx({
                    msgs: [new MsgExecuteContract(
                        accAddress,
                        contractAdress,
                        {
                            "append_nft_metadata": msg
                        }
                    )],
                    memo: `Alliance DAO NFT Collection Chunk #${i}`,
                    chainID: "pisco-1"
                });
                let result = await lcd.tx.broadcastSync(tx, "pisco-1");
                await new Promise(resolve => setTimeout(resolve, 6000));
                console.log("Transaction executed on chain with hash", result.txhash);

                msg = {};
            }
        }
        catch (e) {
            console.log(e)
        }
    }
}

const init = async () => {
    const res = await readUsersData();
    const parsedUserDataChunks = filterData(res);
    console.log(JSON.stringify(parsedUserDataChunks))
    console.log(parsedUserDataChunks.length)
    fs.writeFileSync('./scripts/.users_parsed.csv', objectToCsv(parsedUserDataChunks));
    // const parsedUserDataChunks = new Array<User>()
    // for (let i = 0; i < 1000; i++) {
    //     parsedUserDataChunks.push({
    //         id: i,
    //         terraAddress: new MnemonicKey().accAddress("terra"),
    //     })
    // }
    // await submitOnChain(parsedUserDataChunks);
}
init();