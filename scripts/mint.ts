import * as dotenv from 'dotenv'
import { MnemonicKey, LCDClient, MsgExecuteContract } from '@terra-money/feather.js';
import * as fs from 'fs';
import csvParser from 'csv-parser';
import * as _ from 'lodash';

dotenv.config()

interface User {
    id?: number;

    ip?: string;
    terraAddress: string;
    accumulatedRewards?: number;
    score?: number;
    ordosAddress?: string;
    corrinoAddress?: string;
    atreidesAddress?: string;
    harkonnenAddress?: string;
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

const filterData = (users: User[]): User[] => {
    return _.chain(users)
        .sortBy("accumulatedRewards", "score")
        .reverse()
        .uniqBy("ip")
        .uniqBy("terraAddress")
        .map((user, index) => {
            user.id = index + 1;

            return user;
        })
        .value();
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
    // const res = await readUsersData();
    // const parsedUserDataChunks = filterData(res);
    const parsedUserDataChunks = new Array<User>()
    for (let i = 0; i < 1000; i++) {
        parsedUserDataChunks.push({
            id: i,
            terraAddress: new MnemonicKey().accAddress("terra"),
        })
    }
    await submitOnChain(parsedUserDataChunks);
}
init();