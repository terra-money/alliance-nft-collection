use alliance_nft_packages::query::QueryMinterMsg;
use alliance_nft_packages::state::MinterConfig;
use cosmwasm_std::{entry_point, to_binary};
use cosmwasm_std::{Binary, Deps, Env, StdResult};

use crate::state::CONFIG;


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMinterMsg) -> StdResult<Binary> {
    match msg {
        QueryMinterMsg::Config {} => to_binary(&query_config(deps)?),
    }
}

fn query_config(deps : Deps) -> StdResult<MinterConfig>{
    let res = CONFIG.load(deps.storage)?;

    Ok(res)
}
