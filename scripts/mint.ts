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
    score: number;
    ordosAddress: string;
    corrinoAddress: string;
    atreidesAddress: string;
    harkonnenAddress: string;
}

const readUsersData = (): Promise<User[]> => {
    return new Promise((resolve, reject) => {
        const users: User[] = [];

        fs.createReadStream('.users.csv')
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
    const contractAdress = "terra12frndl0wexrzevkz6gh450xhddxvenhlnt035fankv445jrjdnjszhqhzh";

    let chunkIndex = 0;
    for await (const user of users) {
        let msgs = new Array<MsgExecuteContract>();
        const msgExecuteContract = new MsgExecuteContract(
            accAddress,
            contractAdress,
            {
                "mint": {
                    "token_id": user.id?.toString(),
                    "owner": user.terraAddress,
                    "token_uri": "",
                    "extension": {
                        "name": `AllianceNFT DAO Membership #${user.id?.toString()}`,
                        "description": "Received for participating on Game Of Alliance",
                        "image": "https://ipfs.io/ipfs/{hash}",     // TODO: find in csv
                        "attributes": [{
                            "display_type": null,
                            "trait_type": "planet",
                            "value": "fire"                         // TODO: find in csv
                        }, {
                            "display_type": null,
                            "trait_type": "inhabitant",
                            "value": "water"                         // TODO: find in csv
                        }, {
                            "display_type": null,
                            "trait_type": "object",
                            "value": "sword"                         // TODO: find in csv
                        }, {
                            "display_type": null,
                            "trait_type": "rarity",
                            "value": 11                              // TODO: find in csv
                        }],
                        "image_data": "",
                        "external_url": "",
                        "background_color": "",
                        "animation_url": "",
                        "youtube_url": "",
                    }
                }
            }
        );

        msgs.push(msgExecuteContract)

        const tx = await wallet.createAndSignTx({
            msgs,
            memo: `Alliance DAO NFT Collection Chunk #${chunkIndex}`,
            chainID: "pisco-1"
        })
            .catch((e) => console.log(e));
        console.log(chunkIndex)
        // const result = await lcd.tx.broadcastBlock(tx, "pisco-1");
        //console.log(`Alliance DAO NFT Collection Chunk #${chunkIndex} submitted on chain txHash ${result.txhash}`);
        chunkIndex++;
    }
}

const init = async () => {
    const res = await readUsersData();
    const parsedUserDataChunks = filterData(res);
    await submitOnChain(parsedUserDataChunks);
}
init();