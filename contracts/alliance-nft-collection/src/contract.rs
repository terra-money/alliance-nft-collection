use cosmwasm_std::{entry_point, Empty};
use cosmwasm_std::{Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;
use cw721_base::{Extension, Cw721Contract};
use cw721_metadata_onchain::{Cw721MetadataContract, InstantiateMsg};

use crate::error::ContractError;
use crate::msg::{QueryAllianceMsg, ExecuteAllianceMsg};

// Version info for migration
const CONTRACT_NAME: &str = "crates.io:alliance-nft-collection";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

pub type Cw2981Contract<'a> = Cw721Contract<'a, Extension, Empty, ExecuteAllianceMsg, QueryAllianceMsg>;
pub type ExecuteMsg = cw721_base::ExecuteMsg<Extension, ExecuteAllianceMsg>;
pub type QueryMsg = cw721_base::QueryMsg<Empty>;

// This makes a conscious choice on the various generics used by the contract
#[entry_point]
pub fn instantiate(
    mut deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let res = Cw721MetadataContract::default().instantiate(deps.branch(), env, info, msg)?;
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)
        .map_err(ContractError::Std)?;
    Ok(res)
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    Ok(match msg {
        ExecuteMsg::Extension { msg } => {
            match msg {
                ExecuteAllianceMsg::AllianceClaimRewards{} => {
                    Response::default()
                },
                ExecuteAllianceMsg::AllianceDelegate(delegations) => {
                    Response::default()
                },
                ExecuteAllianceMsg::AllianceUndelegate(undelegations) => {
                    Response::default()
                },
                ExecuteAllianceMsg::AllianceRedelegate(redelegations) => {
                    Response::default()
                },
            }
        },
        _ => {
            Cw721MetadataContract::default().execute(deps, env, info, msg.into())?
        },
    })
}

#[entry_point]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    Cw721MetadataContract::default().query(deps, env, msg)
}
