use crate::contract::instantiate::{instantiate, CONTRACT_NAME, CONTRACT_VERSION};
use crate::contract::reply::reply;
use crate::types::instantiate::InstantiateMsg;

use cosmwasm_std::testing::{
    mock_dependencies, mock_env, mock_info, MockApi, MockQuerier, MockStorage,
};
use cosmwasm_std::{
    Addr, Binary, CosmosMsg, Empty, Env, MessageInfo, OwnedDeps, Reply, Response, SubMsg,
    SubMsgResponse, SubMsgResult,
};
use cw2::get_contract_version;
use terra_proto_rs::cosmos::bank::v1beta1::{DenomUnit, Metadata};
use terra_proto_rs::cosmos::base::v1beta1::Coin;
use terra_proto_rs::cosmwasm::tokenfactory::v1beta1::{MsgMint, MsgSetDenomMetadata};
use terra_proto_rs::{
    cosmwasm::tokenfactory::v1beta1::MsgCreateDenom,
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
    let msg = InstantiateMsg {
        minter: "minter".to_string(),
        name: "Collection Name".to_string(),
        symbol: "CNA".to_string(),
        owner: Addr::unchecked("owner"),
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
                type_url: "/cosmwasm.tokenfactory.v1beta1.MsgCreateDenom".to_string(),
                value: Binary::from(
                    MsgCreateDenom {
                        sender: Addr::unchecked("cosmos2contract").to_string(),
                        subdenom: "AllianceDAO".to_string(),
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
                String::from("factory/cosmos2contract/AllianceDAO")
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
                type_url: "/cosmwasm.tokenfactory.v1beta1.MsgSetDenomMetadata".to_string(),
                value: Binary::from(MsgSetDenomMetadata {
                    sender: "cosmos2contract".to_string(),
                    metadata: Some(Metadata {
                        description:
                            "Staking token for AllianceDAO used by the NFT collection to generate rewards"
                                .to_string(),
                        denom_units: vec![DenomUnit {
                            denom: "factory/cosmos2contract/AllianceDAO".to_string(),
                            exponent: 0,
                            aliases: vec![],
                        }],
                        base: "factory/cosmos2contract/AllianceDAO".to_string(),
                        display: "factory/cosmos2contract/AllianceDAO".to_string(),
                        name: "Alliance Token".to_string(),
                        symbol: "AllianceDAO".to_string(),
                        uri: "".to_string(),
                        uri_hash: "".to_string(),
                    }),
                }.encode_to_vec()),
            }))
            .add_submessage(SubMsg::new(CosmosMsg::Stargate {
                type_url: "/cosmwasm.tokenfactory.v1beta1.MsgMint".to_string(),
                value: Binary::from(MsgMint {
                    sender: "cosmos2contract".to_string(),
                    amount: Some(Coin {
                        denom: "factory/cosmos2contract/AllianceDAO".to_string(),
                        amount: "1000000000000".to_string(),
                    }),
                }.encode_to_vec()),
            }))
    );

    (deps, env, info)
}
