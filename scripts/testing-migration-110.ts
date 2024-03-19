import * as dotenv from "dotenv";
import {
  MnemonicKey,
  MsgStoreCode,
  LCDClient,
  MsgMigrateCode,
  MsgMigrateContract,
  MsgExecuteContract,
} from "@terra-money/feather.js";
import * as fs from "fs";
import * as promptly from "promptly";

dotenv.config();

// ts-node scripts/testing-migration-110

try {
  (async () => {
    // LCD Configuration
    const lcdConfig = {
      "phoenix-1": {
        lcd: "https://cradle-manager.ec1-prod.newmetric.xyz/cradle/proxy/6a619c39-c3e8-4e57-9df1-b20560dc4e50",
        chainID: "phoenix-1",
        gasAdjustment: 1.5,
        gasPrices: { uluna: 0.015 },
        prefix: "terra",
      },
    };

    // Initialize LCD Client
    const lcd = new LCDClient(lcdConfig);

    // Get all information from the deployer wallet
    const mk = new MnemonicKey({ mnemonic: process.env.MNEMONIC });
    const wallet = lcd.wallet(mk);
    const accAddress = wallet.key.accAddress("terra");
    console.log(`Wallet address: ${accAddress}`);

    let stakers = [
      "terra1yct7ls8kw3x2ucm66rxg7mgtyvw7kr5v4t4xsx",
      "terra1ud0pnytt8nsmrupl9md40xpqp4w5ea3w4se5ht",
      "terra13qjxhnw98lm36rxc9yjakkmulhpv7zctdc5zlz",
      "terra1hr8zsfpch47qygc96c8e6rzkd2t7mafqx77ulw",
    ];

    // dao gov terra1pzhcmjz57s46kp2fldut5xe83vxjhmulj9w8rrf3dlm0gehxqp7sq3n5dr
    // dao treasury terra1g0mfrpswewteaf9ky4rlj09wh5njp6u9xxk94uszplw4qz2f9mzq3k27fm
    // alliance minter terra1m3ye6dl6s25el4xd8adg9lnquz88az9lur2ujztj9pfmzdyfz3xsm699r3
    let alliance_collection_addr =
      "terra1phr9fngjv7a8an4dhmhd0u0f98wazxfnzccqtyheq4zqrrp4fpuqw3apw9";

    let dao_gov_addr =
      "terra1pzhcmjz57s46kp2fldut5xe83vxjhmulj9w8rrf3dlm0gehxqp7sq3n5dr";

    let action = await promptly.prompt(
      "create proposal (c), execute proposal (x), break NFT (b), claim rewards (r)"
    );

    if (action === "c") {
      // Create the message and broadcast the transaction on chain
      let tx = await wallet.createTx({
        msgs: [
          new MsgExecuteContract(stakers[0], dao_gov_addr, {
            create_proposal: {
              title: "Test",
              description: "test",
              proposal_actions: [
                {
                  execute_treasury_msgs: {
                    action_type: "execute",
                    msgs: [
                      JSON.stringify({
                        wasm: {
                          migrate: {
                            contract_addr:
                              "terra1m3ye6dl6s25el4xd8adg9lnquz88az9lur2ujztj9pfmzdyfz3xsm699r3",
                            new_code_id: 2717,
                            msg: Buffer.from(
                              JSON.stringify({
                                version: "1.1.0",
                                nft_collection_code_id: 2718,
                                version110_data: {
                                  dao_treasury_address:
                                    "terra1g0mfrpswewteaf9ky4rlj09wh5njp6u9xxk94uszplw4qz2f9mzq3k27fm",
                                  dao_treasury_share: "0.1",
                                  lst_hub:
                                    "terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk",
                                  lst_asset_info: {
                                    cw20: "terra1ecgazyd0waaj3g7l9cmy5gulhxkps2gmxu9ghducvuypjq68mq2s5lvsct",
                                  },
                                },
                              })
                            ).toString("base64"),
                          },
                        },
                      }),
                    ],
                    remote_treasury_target: null,
                  },
                },
              ],
              deposit_owner: stakers[0],
            },
          }),

          ...stakers.map(
            (a) =>
              new MsgExecuteContract(a, dao_gov_addr, {
                cast_vote: {
                  proposal_id: 47,
                  outcome: "yes",
                },
              })
          ),
        ],
        memo: "Alliance NFT Migration to 1.1.0",
        chainID: "phoenix-1",
      });

      console.log("TX", JSON.stringify(tx));

      let result = await lcd.tx.broadcastSync(tx, "phoenix-1");
      console.log(`Transaction executed with hash ${result.txhash}`);
    }

    if (action === "x") {
      let txExecute = await wallet.createTx({
        msgs: [
          new MsgExecuteContract(stakers[0], dao_gov_addr, {
            execute_proposal: {
              proposal_id: 47,
            },
          }),
        ],
        memo: "Alliance NFT Migration to 1.1.0",
        chainID: "phoenix-1",
      });

      console.log("TX EXECUTE", JSON.stringify(txExecute));

      let resultExecute = await lcd.tx.broadcastSync(txExecute, "phoenix-1");
      console.log(
        `TX EXECUTE Transaction executed with hash ${resultExecute.txhash}`
      );

      let txInfo = await lcd.tx.txInfo(resultExecute.txhash, "phoenix-1");

      console.log("raw", txInfo.raw_log);
      console.log("logs", txInfo.logs);
    }

    if (action === "b") {
      // "1116",
      // "1416",
      // "185",
      // "2561",
      // "3049",
      // "3050",
      // "3070",
      // "3491",
      // "371",
      // "4035"

      let txExecute = await wallet.createTx({
        msgs: [
          new MsgExecuteContract(stakers[0], alliance_collection_addr, {
            break_nft: "1416",
          }),
        ],
        memo: "Alliance NFT Break NFT",
        chainID: "phoenix-1",
      });

      console.log("TX BREAK", JSON.stringify(txExecute));

      let resultExecute = await lcd.tx.broadcastSync(txExecute, "phoenix-1");
      console.log(
        `TX BREAK Transaction executed with hash ${resultExecute.txhash}`
      );

      let txInfo = await lcd.tx.txInfo(resultExecute.txhash, "phoenix-1");

      console.log("raw", txInfo.raw_log);
      console.log("logs", txInfo.logs);
    }
    if (action === "r") {
      let txExecute = await wallet.createTx({
        msgs: [
          new MsgExecuteContract(stakers[0], alliance_collection_addr, {
            alliance_claim_rewards: {},
          }),
        ],
        memo: "Alliance NFT REWARDS",
        chainID: "phoenix-1",
      });

      console.log("TX REWARDS", JSON.stringify(txExecute));

      let resultExecute = await lcd.tx.broadcastSync(txExecute, "phoenix-1");
      console.log(
        `TX REWARDS Transaction executed with hash ${resultExecute.txhash}`
      );

      let txInfo = await lcd.tx.txInfo(resultExecute.txhash, "phoenix-1");

      console.log("raw", txInfo.raw_log);
      console.log("logs", txInfo.logs);
    }
  })().catch((e) => console.log(e));
} catch (e) {
  console.log(e);
}
