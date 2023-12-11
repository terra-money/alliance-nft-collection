import * as dotenv from 'dotenv'
import { MnemonicKey, LCDClient, Coins, MsgCreateAlliance, MsgSubmitProposal, MsgDeleteAlliance } from '@terra-money/feather.js';
import * as _ from 'lodash';

dotenv.config()

try {
    (async () => {

        // Create the LCD Client to interact with the blockchain
        const lcd = new LCDClient({
            'pisco-1': {
                lcd: 'http://192.168.2.101:1317/',
                chainID: 'pisco-1',
                gasAdjustment: 1.75,
                gasPrices: { uluna: 0.015 },
                prefix: 'terra'
            }
        })

        // Get all information from the deployer wallet
        const mk = new MnemonicKey({ mnemonic: process.env.MNEMONIC });
        const wallet = lcd.wallet(mk);
        const accAddress = wallet.key.accAddress("terra");
        console.log(`NFT Collection created with the account: ${accAddress}`)

        try {
            const msgProposal = new MsgSubmitProposal(
                [new MsgCreateAlliance(
                    "terra10d07y265gmmuvt4z0w9aw880jnsr700juxf95n",
                    "factory/terra10h0p6fth38mlwnu2upa220q0yhq3l2mdsa0t0w66kq6hfq5zphyqhhr5yv/AllianceNFT",
                    "10000000000000",
                    "0",
                    "10000000000000",
                    undefined,
                    {
                        "min": "10000000000000",
                        "max": "10000000000000"
                    }
                )],
                Coins.fromString("555000000uluna"),
                accAddress,
                "metadata",
                "title",
                "summary"
            );
            const tx = await wallet.createAndSignTx({
                msgs: [msgProposal],
                chainID: "pisco-1",
            });
            const result = await lcd.tx.broadcastSync(tx, "pisco-1");

            console.log(`Create Alliance Proposal:
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