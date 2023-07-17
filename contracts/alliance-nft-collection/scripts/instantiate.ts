import * as dotenv from 'dotenv'
import { MnemonicKey, MsgStoreCode, MsgInstantiateContract, LCDClient, Coins } from '@terra-money/feather.js';
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
    console.log(`Instantiation wallet address: ${accAddress}`)

    try {
        const contractCodeId = fs.readFileSync('./scripts/.contract_code_id.log');
        const msgInstantiateContract = new MsgInstantiateContract(
            accAddress,
            accAddress,
            Number(contractCodeId),
            {
                "name": "AllianceDAO",
                "symbol": "aDAO",
                "minter": wallet.key.accAddress("terra"),
            },
            Coins.fromString("10000000uluna"),
            "Alliance DAO NFT Collection"
        );

        const tx = await wallet.createAndSignTx({
            msgs: [msgInstantiateContract],
            memo: "Create an Alliance NFT Collection Contract",
            chainID: "pisco-1",
        });
        const result = await lcd.tx.broadcastBlock(tx, "pisco-1");
        const contractAddress = result.logs[0].events[0].attributes[0].value;
        console.log(`Alliance NFT Collection smart contract instantiated with 
        - Code ID: ${contractCodeId}
        - Tx Hash: ${result.txhash}
        - Contract Address: ${contractAddress}`);

        fs.writeFileSync('./scripts/.contract_address.log', contractAddress);
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