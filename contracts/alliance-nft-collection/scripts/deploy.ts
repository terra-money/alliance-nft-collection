import * as dotenv from 'dotenv'
import { MnemonicKey, MsgStoreCode, LCDClient } from '@terra-money/feather.js';
import * as fs from 'fs';

dotenv.config()

const init = async () => {
    // Create the LCD Client to interact with the blockchain
    const lcd = new LCDClient({
        "pisco-1": {
            lcd: "https://pisco-lcd.terra.dev",
            chainID: "pisco-1",
            gasPrices: "0.15uluna",
            gasAdjustment: "1.2",
            prefix: "terra",
        }
    });

    // Get all information from the deployer wallet
    const mk = new MnemonicKey({ mnemonic: process.env.MNEMONIC });
    const wallet = lcd.wallet(mk);
    const accAddress = wallet.key.accAddress("terra");
    console.log(`Deployer wallet address: ${accAddress}`)

    // Create the message and broadcast the transaction on chain
    const msgStoreCode = new MsgStoreCode(
        accAddress,
        fs.readFileSync('./artifacts/alliance_nft_collection.wasm').toString('base64')
    );
    
    try {
        let tx = await wallet.createAndSignTx({
            msgs: [msgStoreCode],
            memo: "Alliance DAO NFT Collection",
            chainID: "pisco-1"
        });
        let result = await lcd.tx.broadcastBlock(tx, "pisco-1");
        let contractCodeId = result.logs[0].events[1].attributes[1].value;
        console.log(`Smart contract deployed with 
        - Code ID: ${contractCodeId}
        - Tx Hash: ${result.txhash}`);
        fs.writeFileSync('./scripts/.contract_code_id.log', contractCodeId);
    }
    catch (e) {
        console.log(e)
        return;
    }
}

try {
    init();
}
catch (e) {
    console.log(e)
}