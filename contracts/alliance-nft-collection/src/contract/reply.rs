use cosmwasm_std::{entry_point, DepsMut, Env, Reply, Response};

use super::instantiate::reply_on_instantiate;
use alliance_nft_packages::errors::ContractError;

pub const INSTANTIATE_REPLY_ID: u64 = 1;
pub const CLAIM_REWARD_ERROR_REPLY_ID: u64 = 2;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn reply(deps: DepsMut, env: Env, reply: Reply) -> Result<Response, ContractError> {
    match reply.id {
        INSTANTIATE_REPLY_ID => Ok(reply_on_instantiate(deps, env, reply)?),
        CLAIM_REWARD_ERROR_REPLY_ID => Ok(Response::default().add_attribute(
            "claim_reward_error_reply",
            CLAIM_REWARD_ERROR_REPLY_ID.to_string(),
        )),
        _ => Err(ContractError::InvalidReplyId(reply.id)),
    }
}
