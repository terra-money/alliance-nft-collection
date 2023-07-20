use cosmwasm_std::{entry_point, Addr, Binary, CosmosMsg};
use cosmwasm_std::{DepsMut, Env, MessageInfo, Response};
use terra_proto_rs::{
    alliance::alliance::MsgDelegate, cosmos::base::v1beta1::Coin, traits::Message,
};

use crate::state::{upsert_vals, CONFIG};
use crate::types::execute::{
    AllianceDelegateMsg, AllianceRedelegateMsg, AllianceUndelegateMsg, MintMsg,
};
use crate::types::{errors::ContractError, execute::ExecuteMsg, AllianceNftCollection};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::AllianceDelegate(msg) => try_alliance_delegate(deps, env, info, msg),
        ExecuteMsg::AllianceUndelegate(msg) => try_alliance_undelegate(deps, env, info, msg),
        ExecuteMsg::AllianceRedelegate(msg) => try_alliance_redelegate(deps, env, info, msg),

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

fn try_alliance_delegate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: Box<AllianceDelegateMsg>,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.as_ref().storage)?;
    authorize_execution(cfg.owner.clone(), info.sender)?;
    let mut cosmos_msg: Vec<CosmosMsg> = Vec::new();

    for del in msg.delegations.iter() {
        let msg = CosmosMsg::Stargate {
            type_url: "/alliance.alliance.MsgDelegate".to_string(),
            value: Binary::from(
                MsgDelegate {
                    delegator_address: env.contract.address.to_string(),
                    validator_address: del.validator.clone(),
                    amount: Some(Coin {
                        denom: cfg.asset_denom.clone(),
                        amount: del.amount.to_string(),
                    }),
                }
                .encode_to_vec(),
            ),
        };

        upsert_vals(deps.storage, del.validator.clone(), del.amount.clone())?;
        cosmos_msg.push(msg);
    }

    Ok(Response::default()
        .add_attribute("method", "try_alliance_delegate")
        .add_messages(cosmos_msg))
}

fn try_alliance_undelegate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: Box<AllianceUndelegateMsg>,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    authorize_execution(cfg.owner, info.sender)?;

    Ok(Response::default())
}

fn try_alliance_redelegate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: Box<AllianceRedelegateMsg>,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    authorize_execution(cfg.owner, info.sender)?;

    Ok(Response::default())
}

fn try_breaknft(_token_id: String) -> Result<Response, ContractError> {
    Ok(Response::default())
}

fn try_mint(_mint_msg: Box<MintMsg>) -> Result<Response, ContractError> {
    Ok(Response::default())
}

fn authorize_execution(owner: Addr, sender: Addr) -> Result<Response, ContractError> {
    if sender != owner {
        return Err(ContractError::Unauthorized(sender, owner));
    }
    Ok(Response::default())
}
