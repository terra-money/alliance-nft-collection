import * as dotenv from 'dotenv'
import { MnemonicKey, LCDClient, MsgExecuteContract } from '@terra-money/feather.js';
import * as fs from 'fs';
import * as _ from 'lodash';

dotenv.config()

interface Attribute {
    trait_type: string;
    value: string;
}

interface NFT {
    name: string;
    description: string;
    image: string;
    dna: string;
    edition: number;
    date: number;
    id: number;
    terraAddress: string;
    attributes: Attribute[];
}

const toMintNftData = (nft: NFT) => {
    return {
        token_id: nft.id.toString(),
        extension: {
            image: nft.image,
            image_data: "",
            external_url: "",
            description: nft.description,
            name: nft.name,
            background_color: "",
            animation_url: "",
            youtube_url: "",
            attributes: nft.attributes.map(atr => {
                return {
                    display_type: "",
                    trait_type: atr.trait_type,
                    value: atr.value
                }
            })
        }
    }
}


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
    const contractAdress = fs.readFileSync('./scripts/.nft_minter_contract_address.log').toString();
    const metadata: NFT[] = JSON.parse(fs.readFileSync('./scripts/metadata.json').toString());

    let msgs: any = {};
    for (let i = 0; i < metadata.length; i++) {
        const accAddrToMint = new MnemonicKey({ mnemonic: process.env.MNEMONIC, index: i }).accAddress("terra");
        msgs[accAddrToMint] = toMintNftData(metadata[i]);
    }
    console.log(JSON.stringify(msgs))
    try {
        const tx = await wallet.createAndSignTx({
            msgs: [new MsgExecuteContract(
                accAddress,
                contractAdress,
                { append_nft_metadata: msgs },
            )],
            memo: `AllianceNFT metadata`,
            chainID: "pisco-1"
        });
        let result = await lcd.tx.broadcastSync(tx, "pisco-1");
        console.log("Transaction executed on chain with hash", result.txhash);
    }
    catch (e) {
        console.log(e)
    }
})()