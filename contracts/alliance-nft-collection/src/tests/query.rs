use alliance_nft_packages::query::QueryCollectionMsg;
use crate::contract::query::query;

use super::instantiate::intantiate_with_reply;

#[test]
fn test_query_info_and_config() {
    let (deps, env, _) = intantiate_with_reply();

    let contract_info_res = query(deps.as_ref(), env.clone(), QueryCollectionMsg::ContractInfo {}).unwrap();
    let contract_conf_res = query(deps.as_ref(), env, QueryCollectionMsg::Config {}).unwrap();

    assert_eq!(
        contract_info_res,
        "{\"name\":\"Collection Name\",\"symbol\":\"CNA\"}".as_bytes()
    );
    assert_eq!(
        contract_conf_res,
        "{\"owner\":\"owner\",\"asset_denom\":\"factory/cosmos2contract/AllianceDAO\"}".as_bytes()
    );
}
