use cosmwasm_std::entry_point;
use cosmwasm_std::{DepsMut, Env, MessageInfo, Response};

use crate::types::execute::{AllianceDelegateMsg, AllianceUndelegateMsg, AllianceRedelegateMsg, MintMsg};
use crate::types::{
    errors::ContractError, execute::ExecuteMsg,
    AllianceNftCollection,
};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::AllianceDelegate(delegations) => try_alliance_delegate(delegations),
        ExecuteMsg::AllianceUndelegate(undelegations) => try_alliance_undelegate(undelegations),
        ExecuteMsg::AllianceRedelegate(redelegations) => try_alliance_redelegate(redelegations),
        
        ExecuteMsg::AllianceClaimRewards {} => try_alliance_claim_rewards(),

        ExecuteMsg::BreakNft(token_id) => try_breaknft(token_id),
        ExecuteMsg::Mint(mint_msg) => try_mint(mint_msg),
        _ => {
            let parent = AllianceNftCollection::default();
            Ok(parent.execute(deps, env, info, msg.into())?)
        }
    }
}


fn try_alliance_claim_rewards() -> Result<Response, ContractError> {

    Ok(Response::default())
}

fn try_alliance_delegate(_delegations: Box<AllianceDelegateMsg>) -> Result<Response, ContractError> {

    Ok(Response::default())
}

fn try_alliance_undelegate(_undelegations: Box<AllianceUndelegateMsg>) -> Result<Response, ContractError> {

    Ok(Response::default())
}

fn try_alliance_redelegate(_redelegations: Box<AllianceRedelegateMsg>) -> Result<Response, ContractError> {

    Ok(Response::default())
}

fn try_breaknft(_token_id: String) -> Result<Response, ContractError> {

    Ok(Response::default())
}

fn try_mint(_mint_msg: Box<MintMsg>) -> Result<Response, ContractError> {

    Ok(Response::default())
}
