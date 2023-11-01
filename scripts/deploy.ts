import * as dotenv from 'dotenv'
import { MnemonicKey, MsgStoreCode, LCDClient } from '@terra-money/feather.js';
import * as fs from 'fs';

dotenv.config()

try {
    (async () => {
        // Create the LCD Client to interact with the blockchain
        const lcd = LCDClient.fromDefaultConfig("testnet")
    
        // Get all information from the deployer wallet
        const mk = new MnemonicKey({ mnemonic: process.env.MNEMONIC });
        const wallet = lcd.wallet(mk);
        const accAddress = wallet.key.accAddress("terra");
        console.log(`Wallet address: ${accAddress}`)
    
        // Create the message and broadcast the transaction on chain
        let tx = await wallet.createAndSignTx({
            msgs: [new MsgStoreCode(
                accAddress,
                fs.readFileSync('./artifacts/alliance_nft_collection.wasm').toString('base64')
            ),
            new MsgStoreCode(
                accAddress,
                fs.readFileSync('./artifacts/alliance_nft_minter.wasm').toString('base64')
            )],
            memo: "Alliance NFT Collection Contracts",
            chainID: "pisco-1",
        });
        let result = await lcd.tx.broadcastSync(tx, "pisco-1");
        console.log(`Transaction executed on chain with hash ${result.txhash}`);

        await new Promise(resolve => setTimeout(resolve, 12000));
        
        let txInfo = await lcd.tx.txInfo(result.txhash, "pisco-1") as any;
        const nftCollectionCodeId = txInfo.logs[0].events[1].attributes[1].value;
        const nftMinterCodeId = txInfo.logs[1].events[1].attributes[1].value;
        console.log(`- nftCollectionCodeId: ${nftCollectionCodeId}\n- nftMinterCodeId: ${nftMinterCodeId}`);

        
        fs.writeFileSync('./scripts/.nft_collection_code_id.log', nftCollectionCodeId);
        fs.writeFileSync('./scripts/.nft_minter_code_id.log', nftMinterCodeId);
    })();
}
catch (e) {
    console.log(e)
}