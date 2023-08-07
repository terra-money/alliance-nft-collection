import * as dotenv from 'dotenv'
import { MnemonicKey, LCDClient, MsgMigrateContract, MsgExecuteContract } from '@terra-money/feather.js';
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

const filterData = (users: User[]): User[][] => {
    return _.chain(users)
        .sortBy("accumulatedRewards", "score")
        .reverse()
        .uniqBy("ip")
        .map((user, index) => {
            user.id = index + 1;

            return user;
        })
        .chunk(200)
        .value();
}

const submitOnChain = async (parsedChunks: User[][]) => {
    // Create the LCD Client to interact with the blockchain
    const lcd = LCDClient.fromDefaultConfig("testnet");

    // Get all information from the deployer wallet
    const mk = new MnemonicKey({ mnemonic: process.env.MNEMONIC });
    const wallet = lcd.wallet(mk);
    const accAddress = wallet.key.accAddress("terra");
    const contractAdress = fs.readFileSync('./scripts/.contract_address.log').toString('utf-8');

    let chunkIndex = 0;
    for await (const usersChunk of parsedChunks) {
        let msgs = new Array<MsgExecuteContract>();

        for (const user of usersChunk) {
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
                            "image": "https://ipfs.io/ipfs/{hash}",     // TODO: Add image
                            "attributes": [{
                                "display_type": "",
                                "trait_type": "x",
                                "value": "1"    // TODO: find coord
                            }, {
                                "display_type": "",
                                "trait_type": "y",
                                "value": "1"    // TODO: find coord
                            }, {
                                "display_type": "",
                                "trait_type": "width",
                                "value": "120"  // TODO: get sizes
                            }, {
                                "display_type": "",
                                "trait_type": "height",
                                "value": "120"  // TODO: get sizes
                            }, {
                                "display_type": "",
                                "trait_type": "rarity",
                                "value": ""     // TODO: calculate rarity
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
        }

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