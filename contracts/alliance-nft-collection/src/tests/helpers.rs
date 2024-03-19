use super::custom_querier::CustomQuerier;
use crate::contract::execute::execute;
use crate::contract::instantiate::instantiate;
use crate::contract::query::query;
#[allow(unused_imports)]
use alliance_nft_packages::eris::{AssetInfoExt, Hub, QueryMsg};
use alliance_nft_packages::execute::{ExecuteCollectionMsg, MintMsg, UpdateRewardsCallbackMsg};
use alliance_nft_packages::instantiate::InstantiateCollectionMsg;
use alliance_nft_packages::query::QueryCollectionMsg;
use alliance_nft_packages::state::{Config, Trait, ALLOWED_DENOM};
use alliance_nft_packages::Extension;
use cosmwasm_std::testing::{mock_env, mock_info, MockApi, MockStorage, MOCK_CONTRACT_ADDR};
use cosmwasm_std::{
    attr, coins, from_json, to_json_binary, Addr, CosmosMsg, Decimal, Deps, DepsMut, OwnedDeps,
    Response, Uint128,
};
use cw721::NftInfoResponse;
use cw_asset::AssetInfo;
use serde::de::DeserializeOwned;

type MockContext = OwnedDeps<MockStorage, MockApi, CustomQuerier>;

pub const MOCK_LST: &str = "hub_lst";
pub const MOCK_DAO_TREASURY_ADDRESS: &str = "dao_treasury_address";

pub fn setup_contract(deps: &mut MockContext) -> Response {
    deps.querier
        .set_cw20_balance(MOCK_LST, MOCK_CONTRACT_ADDR, 0);

    let info = mock_info("admin", &[]);
    let env = mock_env();

    let init_msg = InstantiateCollectionMsg {
        minter: "minter".to_string(),
        name: "Collection Name".to_string(),
        symbol: "CNA".to_string(),
        owner: Addr::unchecked("owner"),

        dao_treasury_share: Decimal::percent(10),
        lst_asset_info: cw_asset::AssetInfoBase::Cw20(MOCK_LST.to_string()),
        lst_hub_address: "hub".to_string(),
        dao_treasury_address: MOCK_DAO_TREASURY_ADDRESS.to_string(),
    };
    instantiate(deps.as_mut(), env, info, init_msg).unwrap()
}

pub fn mint(deps: DepsMut, token_id: &str) -> Response {
    let info = mock_info("minter", &[]);
    let env = mock_env();
    let msg = ExecuteCollectionMsg::Mint(MintMsg {
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
    let msg = ExecuteCollectionMsg::BreakNft(token_id.to_string());
    execute(deps, env, info, msg).unwrap()
}

pub fn query_nft(deps: Deps, token_id: &str) -> NftInfoResponse<Extension> {
    let msg = QueryCollectionMsg::NftInfo {
        token_id: token_id.to_string(),
    };
    from_json(query(deps, mock_env(), msg).unwrap()).unwrap()
}

pub fn query_config(deps: Deps) -> Config {
    let msg = QueryCollectionMsg::Config {};
    from_json(query(deps, mock_env(), msg).unwrap()).unwrap()
}

pub fn claim_alliance_emissions(deps: &mut MockContext, rewards: Uint128) {
    deps.querier
        .bank_querier
        .update_balance(MOCK_CONTRACT_ADDR, coins(rewards.u128(), ALLOWED_DENOM));

    // CLAIM REWARDS
    let info = mock_info(MOCK_CONTRACT_ADDR, &[]);
    let env = mock_env();
    let msg = ExecuteCollectionMsg::AllianceClaimRewards {};
    let result = execute(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();

    assert_eq!(result.messages.len(), 1);
    assert_eq!(
        result.messages[0].msg,
        CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
            contract_addr: MOCK_CONTRACT_ADDR.to_string(),
            msg: to_json_binary(&ExecuteCollectionMsg::StakeRewardsCallback {}).unwrap(),
            funds: vec![]
        })
    );

    // STAKE REWARDS (in LST) CALLBACK
    let msg = ExecuteCollectionMsg::StakeRewardsCallback {};
    let result = execute(deps.as_mut(), env.clone(), info.clone(), msg).unwrap();

    let previouse_balance = deps.querier.get_cw20_balance(MOCK_LST, MOCK_CONTRACT_ADDR);

    let result_msg = ExecuteCollectionMsg::UpdateRewardsCallback(UpdateRewardsCallbackMsg {
        previous_lst_balance: Uint128::new(previouse_balance),
    });
    assert_eq!(result.messages.len(), 2);
    assert_eq!(
        result.messages[0].msg,
        Hub(Addr::unchecked("hub"))
            .bond_msg(ALLOWED_DENOM, rewards.u128(), None)
            .unwrap()
    );
    assert_eq!(
        result.messages[1].msg,
        CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
            contract_addr: MOCK_CONTRACT_ADDR.to_string(),
            msg: to_json_binary(&result_msg).unwrap(),
            funds: vec![]
        })
    );

    // UPDATE REWARDS CALLBACK
    // exchange rate of 1.2
    let added_lst_amount = rewards.multiply_ratio(100u128, 120u128);
    deps.querier.set_cw20_balance(
        MOCK_LST,
        MOCK_CONTRACT_ADDR,
        previouse_balance + added_lst_amount.u128(),
    );

    let msg = result_msg;
    let result = execute(deps.as_mut(), env, info, msg).unwrap();

    let treasury_amount = Decimal::percent(10) * added_lst_amount;
    let rewards_collected = added_lst_amount - treasury_amount;

    assert_eq!(result.messages.len(), 1);
    assert_eq!(
        result.messages[0].msg,
        AssetInfo::cw20(Addr::unchecked(MOCK_LST))
            .with_balance(treasury_amount)
            .transfer_msg(MOCK_DAO_TREASURY_ADDRESS)
            .unwrap()
    );
    assert_eq!(
        result.attributes,
        vec![
            attr("action", "update_rewards_callback"),
            attr("rewards_collected", rewards_collected),
            attr("treasury_amount", treasury_amount)
        ]
    );

    deps.querier.set_cw20_balance(
        MOCK_LST,
        MOCK_CONTRACT_ADDR,
        previouse_balance + added_lst_amount.u128() - treasury_amount.u128(),
    );
}

pub(super) fn query_helper<T: DeserializeOwned>(deps: Deps, msg: QueryCollectionMsg) -> T {
    from_json(query(deps, mock_env(), msg).unwrap()).unwrap()
}
