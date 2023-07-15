use cosmwasm_std::{entry_point, to_binary};
use cosmwasm_std::{Binary, Deps, Env, StdResult};

use crate::state::CFG;
use crate::types::{
    query::QueryMsg,
    AllianceNftCollection,
};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Cfg {} => to_binary(&CFG.load(deps.storage)?),
        _ => {
            let parent = AllianceNftCollection::default();
            parent.query(deps, env, msg.into())
        }
    }
}
