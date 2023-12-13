import * as dotenv from 'dotenv'
import { MnemonicKey, MsgInstantiateContract, LCDClient, Coins } from '@terra-money/feather.js';
import * as fs from 'fs';
import moment from "moment";

dotenv.config()

try {
    (async () => {
        // Configuration for the LCD client
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
        console.log(`Instantiation wallet address: ${accAddress}`)

        const nftCollectionCodeId = fs.readFileSync('./scripts/.nft_collection_code_id.log');
        const nftMinterCodeId = fs.readFileSync('./scripts/.nft_minter_code_id.log');

        const startTime = moment.utc().add(1, "day").add(7, "hours");
        const tx = await wallet.createAndSignTx({
            msgs: [new MsgInstantiateContract(
                accAddress,
                accAddress,
                Number(nftMinterCodeId),
                {
                    nft_collection_code_id: Number(nftCollectionCodeId),
                    mint_start_time: startTime.unix().toString() + "000000000",
                    mint_end_time: startTime.add(1, "month").unix().toString() + "000000000",
                },
                Coins.fromString("10000000uluna"),
                "Alliance NFT Minter",
            )],
            chainID: "phoenix-1",
        });
        const result = await lcd.tx.broadcastSync(tx, "phoenix-1");

        await new Promise(resolve => setTimeout(resolve, 6000));

        let txInfo = await lcd.tx.txInfo(result.txhash, "phoenix-1") as any;
        const prevLastEvent = txInfo.logs[0].events.length - 1;
        const nftCollectionAddress = txInfo.logs[0].events[prevLastEvent].attributes[0].value;

        console.log(`Alliance NFT Collection smart contract instantiated with`);
        console.log(`- Code ID: ${nftCollectionCodeId}`)
        console.log(`- TxHash: ${result.txhash}`)
        console.log(`- Contract Address: ${nftCollectionAddress}`)

        fs.writeFileSync('./scripts/.nft_minter_contract_address.log', nftCollectionAddress);
    })();
}
catch (e) {
    console.log(e)
}