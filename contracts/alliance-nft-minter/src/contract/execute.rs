use alliance_nft_packages::errors::ContractError;
use alliance_nft_packages::execute::ExecuteMinterMsg;
use cosmwasm_std::entry_point;
use cosmwasm_std::{DepsMut, Env, MessageInfo, Response};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMinterMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMinterMsg::Mint{} => try_mint(deps, info),
    }
}

fn try_mint(
    _deps: DepsMut,
    _info: MessageInfo,
) -> Result<Response, ContractError> {

    Ok(Response::new()
        .add_attribute("method", "try_mint"))
}
