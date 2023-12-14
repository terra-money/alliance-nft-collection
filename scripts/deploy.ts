import * as dotenv from 'dotenv'
import { MnemonicKey, MsgStoreCode, LCDClient } from '@terra-money/feather.js';
import * as fs from 'fs';

dotenv.config()

try {
    (async () => {
        // LCD Configuration
        const lcdConfig = {
            'phoenix-1': {
                lcd: 'https://terra-api.polkachu.com',
                chainID: 'phoenix-1',
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
        console.log(`Wallet address: ${accAddress}`)

        // Create the message and broadcast the transaction on chain
        let tx = await wallet.createAndSignTx({
            msgs: [
                new MsgStoreCode(accAddress, fs.readFileSync('./artifacts/alliance_nft_minter.wasm').toString('base64')),
                new MsgStoreCode(accAddress, fs.readFileSync('./artifacts/alliance_nft_collection.wasm').toString('base64'))
            ],
            memo: "Alliance NFT Contracts",
            chainID: "phoenix-1",
        });
        let result = await lcd.tx.broadcastSync(tx, "phoenix-1");
        console.log(`Transaction executed with hash ${result.txhash}`);
        await new Promise(resolve => setTimeout(resolve, 6000));

        let txInfo = await lcd.tx.txInfo(result.txhash, "phoenix-1") as any;
        const nftMinterCodeId = txInfo.logs[0].events[1].attributes[1].value;
        const nftCollectionCodeId = txInfo.logs[1].events[1].attributes[1].value;

        console.log(`- nftMinterCodeId: ${nftMinterCodeId}`);
        console.log(`- nftCollectionCodeId: ${nftCollectionCodeId}`);

        fs.writeFileSync('./scripts/.nft_collection_code_id.log', nftCollectionCodeId);
        fs.writeFileSync('./scripts/.nft_minter_code_id.log', nftMinterCodeId);
    })();
}
catch (e) {
    console.log(e)
}