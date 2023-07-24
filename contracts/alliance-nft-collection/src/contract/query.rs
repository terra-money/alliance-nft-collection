use cosmwasm_std::{entry_point, to_binary};
use cosmwasm_std::{Binary, Deps, Env, StdResult};

use crate::state::CONFIG;
use crate::types::{
    query::QueryMsg,
    AllianceNftCollection,
};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => to_binary(&CONFIG.load(deps.storage)?),
        _ => {
            let parent = AllianceNftCollection::default();
            parent.query(deps, env, msg.into())
        }
    }
}
