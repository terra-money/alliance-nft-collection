use crate::contract::instantiate::{instantiate, CONTRACT_NAME, CONTRACT_VERSION};
use crate::contract::query::query;
use crate::contract::reply::reply;

use alliance_nft_packages::instantiate::{InstantiateCollectionMsg, InstantiateMinterMsg};
use alliance_nft_packages::query::QueryMinterMsg;
use alliance_nft_packages::state::MinterConfig;
use cosmwasm_std::testing::{
    mock_dependencies, mock_env, mock_info, MockApi, MockQuerier, MockStorage,
};
use cosmwasm_std::{
    to_binary, Addr, Empty, Env, Event, MessageInfo, OwnedDeps, Reply, Response, SubMsg,
    SubMsgResponse, SubMsgResult, Timestamp, WasmMsg,
};
use cw2::get_contract_version;

#[test]
fn test_instantiate() {
    let (deps, env, _) = intantiate_with_reply();

    let res = query(deps.as_ref(), env, QueryMinterMsg::Config {}).unwrap();

    assert_eq!(
        res.to_string(),
        to_binary(&MinterConfig {
            dao_treasury_address: Some(Addr::unchecked("dao_treasury_address")),
            nft_collection_address: Some(Addr::unchecked("nft_collection_address")),
            owner: Addr::unchecked("creator"),
            mint_start_time: Timestamp::from_seconds(1),
            mint_end_time: Timestamp::from_seconds(3),
        }).unwrap().to_string()
    );
}

#[test]
fn test_instantiate_wrong_time_range() {
    // GIVEN the initial state of the environment.
    let mut deps = mock_dependencies();
    let mut env = mock_env();
    env.block.time = Timestamp::from_seconds(2);
    let info = mock_info("creator", &[]);

    // WHEN instantiating the contract ...
    let msg = InstantiateMinterMsg {
        dao_treasury_address: Some(Addr::unchecked("dao_treasury_address")),
        nft_collection_code_id: 1,
        mint_start_time: Timestamp::from_seconds(3),
        mint_end_time: Timestamp::from_seconds(1),
    };
    let res = instantiate(deps.as_mut(), env.clone(), info.clone(), msg);

    // assert the message error
    assert_eq!(
        res.unwrap_err().to_string(), 
        String::from("Invalid mint time range, mint_start_time is greater than mint_end_time")
    );
}

pub fn intantiate_with_reply() -> (
    OwnedDeps<MockStorage, MockApi, MockQuerier, Empty>,
    Env,
    MessageInfo,
) {
    // GIVEN the initial state of the environment.
    let mut deps = mock_dependencies();
    let mut env = mock_env();
    env.block.time = Timestamp::from_seconds(2);
    let info = mock_info("creator", &[]);

    // WHEN instantiating the contract ...
    let msg = InstantiateMinterMsg {
        dao_treasury_address: Some(Addr::unchecked("dao_treasury_address")),
        nft_collection_code_id: 1,
        mint_start_time: Timestamp::from_seconds(1),
        mint_end_time: Timestamp::from_seconds(3),
    };
    let res = instantiate(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();

    // EXPECT the contract versions are setted correctly ...
    let contract_version = get_contract_version(&deps.storage).unwrap();
    assert_eq!(contract_version.version, CONTRACT_VERSION);
    assert_eq!(contract_version.contract, CONTRACT_NAME);

    // ... reply message is send as expected.
    let sub_msg_assertion = SubMsg::reply_on_success(
        WasmMsg::Instantiate {
            admin: Some(env.contract.address.to_string()),
            code_id: 1,
            msg: to_binary(&InstantiateCollectionMsg {
                name: "AllianceNFT".to_string(),
                symbol: "ALLIANCE".to_string(),
                minter: env.contract.address.to_string(),
                owner: Addr::unchecked("cosmos2contract"),
            })
            .unwrap(),
            funds: vec![],
            label: "Alliance NFT Collection".to_string(),
        },
        1,
    );
    assert_eq!(
        res,
        Response::default()
            .add_attributes([
                ("alliance_nft_minter_owner", "creator"),
                ("mint_start_time", "1.000000000"),
                ("mint_end_time", "3.000000000")
            ])
            .add_submessage(sub_msg_assertion)
    );

    // GIVEN the previous env and the reply from instantiate message.
    let reply_msg = Reply {
        id: 1,
        result: SubMsgResult::Ok(SubMsgResponse {
            events: vec![Event::new("instantiate").add_attribute(
                "_contract_address".to_string(),
                "nft_collection_address".to_string(),
            )],
            data: None,
        }),
    };

    // WHEN processing the reply.
    let res_reply = reply(deps.as_mut(), env.clone(), reply_msg).unwrap();

    // EXPECT
    assert_eq!(res_reply, Response::default());

    (deps, env, info)
}
