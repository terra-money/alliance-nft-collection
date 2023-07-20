use crate::{contract::query::query, types::query::QueryMsg};

use super::instantiate::intantiate_with_reply;

#[test]
fn test_query_parent() {
    let (deps, env, _) = intantiate_with_reply();

    let contract_info_res = query(deps.as_ref(), env, QueryMsg::ContractInfo {}).unwrap();

    assert_eq!(contract_info_res, "{\"name\":\"Collection Name\",\"symbol\":\"CNA\"}".as_bytes())
}
