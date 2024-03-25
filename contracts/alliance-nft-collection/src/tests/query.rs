use crate::{
    contract::query::query,
    tests::helpers::{query_helper, MOCK_DAO_TREASURY_ADDRESS, MOCK_LST},
};
use alliance_nft_packages::{eris::Hub, query::QueryCollectionMsg, state::Config};
use cosmwasm_std::{Addr, Decimal};

use super::instantiate::intantiate_with_reply;

#[test]
fn test_query_info_and_config() {
    let (deps, env, _) = intantiate_with_reply();

    let contract_info_res = query(
        deps.as_ref(),
        env.clone(),
        QueryCollectionMsg::ContractInfo {},
    )
    .unwrap();

    let contract_conf_res: Config = query_helper(deps.as_ref(), QueryCollectionMsg::Config {});

    assert_eq!(
        contract_info_res,
        "{\"name\":\"Collection Name\",\"symbol\":\"CNA\"}".as_bytes()
    );
    assert_eq!(
        contract_conf_res,
        Config {
            owner: Addr::unchecked("owner"),
            asset_denom: "factory/cosmos2contract/AllianceNFT".to_string(),
            dao_treasury_share: Decimal::percent(10),
            lst_asset_info: cw_asset::AssetInfoBase::Cw20(Addr::unchecked(MOCK_LST)),
            lst_hub_address: Hub(Addr::unchecked("hub")),
            dao_treasury_address: Addr::unchecked(MOCK_DAO_TREASURY_ADDRESS),
            whitelisted_reward_assets: vec![]
        }
    );
}
