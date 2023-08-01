use crate::contract::execute::execute;
use crate::contract::instantiate::instantiate;
use crate::contract::query::query;
use crate::state::{Trait, TEMP_BALANCE};
use crate::types::execute::{ExecuteMsg, MintMsg};
use crate::types::instantiate::InstantiateMsg;
use crate::types::query::QueryMsg;
use crate::types::Extension;
use cosmwasm_std::testing::{mock_env, mock_info, MOCK_CONTRACT_ADDR};
use cosmwasm_std::{from_binary, Addr, Deps, DepsMut, Response, Uint128};
use cw721::NftInfoResponse;

pub fn setup_contract(deps: DepsMut) -> Response {
    let info = mock_info("admin", &[]);
    let env = mock_env();

    let init_msg = InstantiateMsg {
        minter: "minter".to_string(),
        name: "Collection Name".to_string(),
        symbol: "CNA".to_string(),
        owner: Addr::unchecked("owner"),
    };
    instantiate(deps, env, info, init_msg).unwrap()
}

pub fn mint(deps: DepsMut, token_id: &str) -> Response {
    let info = mock_info("minter", &[]);
    let env = mock_env();
    let msg = ExecuteMsg::Mint(MintMsg {
        owner: "owner".to_string(),
        token_id: token_id.to_string(),
        token_uri: None,
        extension: Extension {
            image: Some("image".to_string()),
            image_data: None,
            external_url: None,
            description: None,
            name: None,
            attributes: Some(vec![Trait {
                display_type: None,
                trait_type: "trait_type".to_string(),
                value: "value".to_string(),
            }]),
            background_color: None,
            animation_url: None,
            youtube_url: None,
        },
    });
    execute(deps, env, info, msg).unwrap()
}

pub fn break_nft(deps: DepsMut, token_id: &str) -> Response {
    let info = mock_info("owner", &[]);
    let env = mock_env();
    let msg = ExecuteMsg::BreakNft(token_id.to_string());
    execute(deps, env, info, msg).unwrap()
}

pub fn query_nft(deps: Deps, token_id: &str) -> NftInfoResponse<Extension> {
    let msg = QueryMsg::NftInfo {
        token_id: token_id.to_string(),
    };
    from_binary(&query(deps, mock_env(), msg).unwrap()).unwrap()
}

pub fn claim_alliance_emissions(deps: DepsMut, rewards: Uint128) {
    let contract_balance = deps
        .querier
        .query_balance(MOCK_CONTRACT_ADDR, "uluna")
        .unwrap();
    if rewards > contract_balance.amount {
        panic!("Contract balance is not enough to claim rewards");
    }

    TEMP_BALANCE
        .save(deps.storage, &(contract_balance.amount - rewards))
        .unwrap();

    let info = mock_info(MOCK_CONTRACT_ADDR, &[]);
    let env = mock_env();
    let msg = ExecuteMsg::UpdateRewardsCallback {};
    execute(deps, env, info, msg).unwrap();
}
