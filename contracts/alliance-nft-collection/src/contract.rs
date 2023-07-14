use cosmwasm_std::{entry_point, to_binary};
use cosmwasm_std::{Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::types::{
    AllianceNftCollection,
    execute::ExecuteMsg,
    instantiate:: InstantiateMsg,
    query:: QueryMsg,
};
use crate::state::CFG;

// Version info for migration
const CONTRACT_NAME: &str = "crates.io:alliance-nft-collection";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let parent = AllianceNftCollection::default();

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)
        .map_err(ContractError::Std)?;

    let res = parent.instantiate(deps, env, info, msg.into())?;
    Ok(res)
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    Ok(match msg {
        ExecuteMsg::AllianceClaimRewards {} => Response::default(),
        ExecuteMsg::AllianceDelegate(_delegations) => Response::default(),
        ExecuteMsg::AllianceUndelegate(_undelegations) => Response::default(),
        ExecuteMsg::AllianceRedelegate(_redelegations) => Response::default(),

        ExecuteMsg::BreakNft(_token_id) => Response::default(),
        ExecuteMsg::Mint(_mint_msg) => Response::default(),
        _ => {
            let parent = AllianceNftCollection::default();
            parent.execute(deps, env, info, msg.into())?
        }
    })
}

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
