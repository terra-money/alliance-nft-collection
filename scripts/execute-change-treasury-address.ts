import * as dotenv from 'dotenv'
import { MnemonicKey, LCDClient, MsgExecuteContract } from '@terra-money/feather.js';
import * as fs from 'fs';
import * as _ from 'lodash';

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
        const contractAdress = fs.readFileSync('./scripts/.nft_minter_contract_address.log').toString();
        const wallet = lcd.wallet(mk);
        const accAddress = wallet.key.accAddress("terra");
        console.log(`change_dao_treasury_address execution wallet address: ${accAddress}`)

        try {
            const msgChangeTreasuryAddress = new MsgExecuteContract(
                accAddress,
                contractAdress,
                { change_dao_treasury_address: "terra19zwen0kp6r2a72xxsw20kz2ekyfkuv2kvsyhf3crdkq86nrrehfs8hlnh6" },
            );
            const tx = await wallet.createAndSignTx({
                msgs: [
                    msgChangeTreasuryAddress,
                ],
                chainID: "pisco-1",
            });
            const result = await lcd.tx.broadcastSync(tx, "pisco-1");

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