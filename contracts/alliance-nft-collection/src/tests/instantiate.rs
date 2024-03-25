use crate::contract::instantiate::{instantiate, CONTRACT_NAME, CONTRACT_VERSION};
use crate::contract::reply::reply;
use crate::tests::helpers::{MOCK_DAO_TREASURY_ADDRESS, MOCK_LST};

use alliance_nft_packages::instantiate::InstantiateCollectionMsg;
use cosmwasm_std::testing::{
    mock_dependencies, mock_env, mock_info, MockApi, MockQuerier, MockStorage,
};
use cosmwasm_std::{
    Addr, Binary, CosmosMsg, Decimal, Empty, Env, MessageInfo, OwnedDeps, Reply, Response, SubMsg,
    SubMsgResponse, SubMsgResult,
};
use cw2::get_contract_version;
use terra_proto_rs::cosmos::bank::v1beta1::{DenomUnit, Metadata};
use terra_proto_rs::cosmos::base::v1beta1::Coin;
use terra_proto_rs::osmosis::tokenfactory::v1beta1::{MsgMint, MsgSetDenomMetadata};
use terra_proto_rs::{
    osmosis::tokenfactory::v1beta1::MsgCreateDenom,
    traits::{Message, MessageExt},
};

#[test]
fn test_instantiate_and_reply() {
    let _ = intantiate_with_reply();
}

pub fn intantiate_with_reply() -> (
    OwnedDeps<MockStorage, MockApi, MockQuerier, Empty>,
    Env,
    MessageInfo,
) {
    // GIVEN the initial state of the environment.
    let mut deps = mock_dependencies();
    let env = mock_env();
    let info = mock_info("creator", &[]);

    // WHEN instantiating the contract ...
    let msg = InstantiateCollectionMsg {
        minter: "minter".to_string(),
        name: "Collection Name".to_string(),
        symbol: "CNA".to_string(),
        owner: Addr::unchecked("owner"),

        dao_treasury_share: Decimal::percent(10),
        lst_asset_info: cw_asset::AssetInfoBase::Cw20(MOCK_LST.to_string()),
        lst_hub_address: "hub".to_string(),
        dao_treasury_address: MOCK_DAO_TREASURY_ADDRESS.to_string(),
    };
    let res = instantiate(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();

    // EXPECT the contract versions are setted correctly ...
    let contract_version = get_contract_version(&deps.storage).unwrap();
    assert_eq!(contract_version.version, CONTRACT_VERSION);
    assert_eq!(contract_version.contract, CONTRACT_NAME);

    // ... reply message is send as expected.
    assert_eq!(res.messages.len(), 1);
    assert_eq!(
        res.messages[0],
        SubMsg::reply_on_success(
            CosmosMsg::Stargate {
                type_url: "/osmosis.tokenfactory.v1beta1.MsgCreateDenom".to_string(),
                value: Binary::from(
                    MsgCreateDenom {
                        sender: Addr::unchecked("cosmos2contract").to_string(),
                        subdenom: "AllianceNFT".to_string(),
                    }
                    .encode_to_vec(),
                ),
            },
            1
        )
    );

    // GIVEN the previous env and the reply from instantiate message.
    let reply_msg = Reply {
        id: 1,
        result: SubMsgResult::Ok(SubMsgResponse {
            events: vec![],
            data: Some(Binary::from(
                String::from("factory/cosmos2contract/AllianceNFT")
                    .to_bytes()
                    .unwrap(),
            )),
        }),
    };

    // WHEN processing the reply.
    let res_reply = reply(deps.as_mut(), env.clone(), reply_msg).unwrap();

    // EXPECT
    assert_eq!(
        res_reply,
        Response::default()
            .add_submessage(SubMsg::new(CosmosMsg::Stargate {
                type_url: "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata".to_string(),
                value: Binary::from(MsgSetDenomMetadata {
                    sender: "cosmos2contract".to_string(),
                    metadata: Some(Metadata {
                        description:
                            "Staking token for AllianceNFT used by the NFT collection to generate rewards"
                                .to_string(),
                        denom_units: vec![DenomUnit {
                            denom: "factory/cosmos2contract/AllianceNFT".to_string(),
                            exponent: 0,
                            aliases: vec![],
                        }],
                        base: "factory/cosmos2contract/AllianceNFT".to_string(),
                        display: "factory/cosmos2contract/AllianceNFT".to_string(),
                        name: "Alliance Token".to_string(),
                        symbol: "AllianceNFT".to_string(),
                        uri: "".to_string(),
                        uri_hash: "".to_string(),
                    }),
                }.encode_to_vec()),
            }))
            .add_submessage(SubMsg::new(CosmosMsg::Stargate {
                type_url: "/osmosis.tokenfactory.v1beta1.MsgMint".to_string(),
                value: Binary::from(MsgMint {
                    mint_to_address : "cosmos2contract".to_string(),
                    sender: "cosmos2contract".to_string(),
                    amount: Some(Coin {
                        denom: "factory/cosmos2contract/AllianceNFT".to_string(),
                        amount: "1000000000000".to_string(),
                    }),
                }.encode_to_vec()),
            }))
    );

    (deps, env, info)
}
