import * as dotenv from 'dotenv'
import { MnemonicKey, MsgInstantiateContract, LCDClient, Coin, Coins } from '@terra-money/feather.js';
import * as fs from 'fs';
import moment from "moment";

dotenv.config()

try {
    (async () => {
        // Configuration for the LCD client
        const lcdConfig = {
            'pisco-1': {
                lcd: 'http://192.168.2.101:1317',
                chainID: 'pisco-1',
                gasAdjustment: 1.75,
                gasPrices: { uluna: 0.015 },
                prefix: 'terra'
            }
        };
        // Initialize LCD Client
        const lcd = new LCDClient(lcdConfig);

        // Get all information from the deployer wallet
        const mk = new MnemonicKey({ mnemonic: process.env.MNEMONIC });
        const wallet = lcd.wallet(mk);
        const accAddress = wallet.key.accAddress("terra");
        console.log(`Instantiation wallet address: ${accAddress}`)

        const nftCollectionCodeId = fs.readFileSync('./scripts/.nft_collection_code_id.log');
        const nftMinterCodeId = fs.readFileSync('./scripts/.nft_minter_code_id.log');

        try {
            const msgInstantiateContract = new MsgInstantiateContract(
                accAddress,
                accAddress,
                Number(nftMinterCodeId),
                {
                    nft_collection_code_id: Number(nftCollectionCodeId),
                    mint_start_time: moment.utc().add(1, "minutes").unix().toString() + "000000000",
                    mint_end_time: moment.utc().add(16, "minutes").unix().toString() + "000000000",
                },
                Coins.fromString("10000000uluna"),
                "Alliance NFT Minter",
            );
            const tx = await wallet.createAndSignTx({
                msgs: [msgInstantiateContract],
                chainID: "pisco-1",
            });
            const result = await lcd.tx.broadcastSync(tx, "pisco-1");

            await new Promise(resolve => setTimeout(resolve, 12000));

            let txInfo = await lcd.tx.txInfo(result.txhash, "pisco-1") as any;
            const prevLastEvent = txInfo.logs[0].events.length -1;
            const nftCollectionAddress = txInfo.logs[0].events[prevLastEvent].attributes[0].value;

            console.log(`Alliance NFT Collection smart contract instantiated with 
            - Code ID: ${nftCollectionCodeId}
            - Tx Hash: ${result.txhash}
            - Contract Address: ${nftCollectionAddress}`);

            fs.writeFileSync('./scripts/.nft_minter_contract_address.log', nftCollectionAddress);
        }
        catch (e) {
            console.log(e)
            return;
        }
    })();
}
catch (e) {
    console.log(e)
}