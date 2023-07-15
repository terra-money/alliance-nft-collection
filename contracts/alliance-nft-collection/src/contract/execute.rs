use cosmwasm_std::entry_point;
use cosmwasm_std::{DepsMut, Env, MessageInfo, Response};

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
