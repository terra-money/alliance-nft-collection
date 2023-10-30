use alliance_nft_packages::errors::ContractError;
use cosmwasm_std::{entry_point, DepsMut, Env, Reply, Response};

use super::instantiate::reply_on_instantiate;

pub const INSTANTIATE_REPLY_ID: u64 = 1;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn reply(deps: DepsMut, env: Env, reply: Reply) -> Result<Response, ContractError> {
    match reply.id {
        INSTANTIATE_REPLY_ID => Ok(reply_on_instantiate(deps, env, reply)?),
        _ => Err(ContractError::InvalidReplyId(reply.id)),
    }
}
