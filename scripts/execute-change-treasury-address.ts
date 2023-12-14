import * as dotenv from 'dotenv'
import { MnemonicKey, LCDClient, MsgExecuteContract } from '@terra-money/feather.js';
import * as fs from 'fs';
import * as _ from 'lodash';

dotenv.config()

try {
    (async () => {
        // Configuration for the LCD client
        const lcdConfig = {
            'phoenix-1': {
                lcd: 'http://localhost:1317',
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
        const contractAdress = fs.readFileSync('./scripts/.nft_minter_contract_address.log').toString();
        const wallet = lcd.wallet(mk);
        const accAddress = wallet.key.accAddress("terra");
        console.log(`change_dao_treasury_address execution wallet address: ${accAddress}`)

        try {
            const msgChangeTreasuryAddress = new MsgExecuteContract(
                accAddress,
                contractAdress,
                { change_dao_treasury_address: "terra1g0mfrpswewteaf9ky4rlj09wh5njp6u9xxk94uszplw4qz2f9mzq3k27fm" },
            );
            const tx = await wallet.createAndSignTx({
                msgs: [
                    msgChangeTreasuryAddress,
                ],
                chainID: "phoenix-1",
            });
            const result = await lcd.tx.broadcastSync(tx, "phoenix-1");

            console.log(`Alliance NFT Collection change owner and treasury address:
            - Tx Hash: ${result.txhash}`);
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