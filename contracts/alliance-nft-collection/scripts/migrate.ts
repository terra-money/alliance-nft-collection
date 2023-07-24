import * as dotenv from 'dotenv'
import { MnemonicKey, LCDClient, MsgMigrateContract } from '@terra-money/feather.js';
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
    const mk = new MnemonicKey({ mnemonic: process.env.MNEMONIC});
    const wallet = lcd.wallet(mk);
    const accAddress = wallet.key.accAddress("terra");
    console.log(`Migrate contract with wallet: ${accAddress}`)

    try {
        const contractCodeId = fs.readFileSync('./scripts/.contract_code_id.log').toString('utf-8');
        const contractAdress = fs.readFileSync('./scripts/.contract_address.log').toString('utf-8');
        const msgMigrateCode = new MsgMigrateContract(
            accAddress,
            contractAdress,
            Number(contractCodeId),
            {
                "version" : "0.1.0"
            }
        );

        const tx = await wallet.createAndSignTx({
            msgs: [msgMigrateCode],
            memo: "Migrate Alliance NFT Contract",
            chainID: "pisco-1"
        });
        const result = await lcd.tx.broadcastBlock(tx, "pisco-1");
        console.log(`Migrate Alliance NFT Contract submitted on chain
        - Tx Hash: ${result.txhash}`);
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
}2