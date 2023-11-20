import * as dotenv from 'dotenv'
import { MnemonicKey, LCDClient, MsgExecuteContract } from '@terra-money/feather.js';
import * as fs from 'fs';
import * as _ from 'lodash';

dotenv.config()

try {
    (async () => {
        // Create the LCD Client to interact with the blockchain
        const lcd = LCDClient.fromDefaultConfig("testnet");

        // Get all information from the deployer wallet
        const mk = new MnemonicKey({ mnemonic: process.env.MNEMONIC });
        const contractAdress = fs.readFileSync('./scripts/.nft_minter_contract_address.log').toString();
        const wallet = lcd.wallet(mk);
        const accAddress = wallet.key.accAddress("terra");
        console.log(`Instantiation wallet address: ${accAddress}`)


        try {
            const msgChangeTreasuryAddress = new MsgExecuteContract(
                accAddress,
                contractAdress,
                {
                    change_dao_treasury_address: "terra1tvzk05sqpa6ysuq8vw98ajut767nak0wfr7k5hrwqn65eagpcexsvq4spe",
                },
            );
            // const msgChangeOwner = new MsgExecuteContract(
            //     accAddress,
            //     contractAdress,
            //     {
            //         change_owner: "terra1p382kqaxns9aevy8ag4hfz662jk7q6uz4he3ka",
            //     },
            // );
            const tx = await wallet.createAndSignTx({
                msgs: [
                    msgChangeTreasuryAddress,
                    //msgChangeOwner
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