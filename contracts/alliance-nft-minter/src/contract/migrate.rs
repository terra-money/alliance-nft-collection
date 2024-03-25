use alliance_nft_packages::errors::ContractError;
use alliance_nft_packages::migrate::MigrateMsg;
use cosmwasm_std::{entry_point, to_json_binary, CosmosMsg, WasmMsg};
use cosmwasm_std::{DepsMut, Env, Response};
use cw2::{get_contract_version, set_contract_version};

use crate::state::CONFIG;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(deps: DepsMut, _env: Env, msg: MigrateMsg) -> Result<Response, ContractError> {
    try_migrate(deps, msg)
}

fn try_migrate(deps: DepsMut, msg: MigrateMsg) -> Result<Response, ContractError> {
    let version = msg.version.clone();
    let contract_version = get_contract_version(deps.storage)?;
    set_contract_version(deps.storage, contract_version.contract, version)?;

    let mut response = Response::new()
        .add_attribute("method", "try_migrate")
        .add_attribute("version", contract_version.version);

    if let Some(nft_collection_code_id) = msg.nft_collection_code_id {
        let config = CONFIG.load(deps.storage)?;
        if let Some(nft_collection_address) = config.nft_collection_address {
            let migrate_nft_collection_msg = CosmosMsg::Wasm(WasmMsg::Migrate {
                contract_addr: nft_collection_address.to_string(),
                new_code_id: nft_collection_code_id,
                msg: to_json_binary(&msg)?,
            });
            response = response.add_message(migrate_nft_collection_msg);
        }
    }

    Ok(response)
}
