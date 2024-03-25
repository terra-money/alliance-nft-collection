use std::collections::HashMap;

use alliance_nft_packages::errors::ContractError;
use alliance_nft_packages::execute::{ExecuteCollectionMsg, ExecuteMinterMsg, MintMsg};
use alliance_nft_packages::state::MinterExtension;
use cosmwasm_std::to_json_binary;
use cosmwasm_std::{entry_point, DepsMut, Env, MessageInfo, Order::Ascending, Response, WasmMsg};

use crate::state::{CONFIG, NFT_METADATA, STATS};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMinterMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMinterMsg::AppendNftMetadata(metadata) => {
            try_append_nft_metadata(deps, info, metadata)
        }
        ExecuteMinterMsg::Mint {} => try_mint(deps, env, info),
        ExecuteMinterMsg::RemoveToken(address) => try_remove_token(deps, info, address),
        ExecuteMinterMsg::SendToDao(batch) => try_send_to_dao_treasury(deps, env, batch),
        ExecuteMinterMsg::ChangeDaoTreasuryAddress(address) => {
            try_change_dao_treasury_address(deps, info, address)
        }
        ExecuteMinterMsg::ChangeOwner(new_owner) => try_change_owner(deps, info, new_owner),
    }
}

/// Remove an NFT from the allowed minting list
fn try_remove_token(
    deps: DepsMut,
    info: MessageInfo,
    address: String,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    cfg.is_authorized_execution(info.sender)?;

    if NFT_METADATA.has(deps.storage, address.clone()) {
        NFT_METADATA.remove(deps.storage, address.clone());
        STATS.update(deps.storage, |mut stats| -> Result<_, ContractError> {
            stats.available_nfts -= 1;
            Ok(stats)
        })?;
    }

    Ok(Response::new().add_attributes([
        ("method", "try_remove_token"),
        ("removed_token", address.as_ref()),
    ]))
}

/// Append NFT metadata on chain.
/// Execution only allowed when:
/// - sender is the owner and
/// - address does not exit in minters yet
/// this function also increase the available to n + 1
fn try_append_nft_metadata(
    deps: DepsMut,
    info: MessageInfo,
    metadata: HashMap<String, MinterExtension>,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    cfg.is_authorized_execution(info.sender)?;

    let mut new_minted_nfts = 0;
    for (key, value) in metadata {
        if NFT_METADATA.has(deps.storage, key.clone()) {
            return Err(ContractError::AlreadyExists(key));
        }
        NFT_METADATA.save(deps.storage, key, &value)?;
        new_minted_nfts += 1;
    }

    STATS.update(deps.storage, |mut stats| -> Result<_, ContractError> {
        stats.available_nfts += new_minted_nfts;
        Ok(stats)
    })?;

    Ok(Response::new().add_attributes([
        ("method", "try_append_nft_metadata"),
        ("new_minted_nfts", &new_minted_nfts.to_string()),
    ]))
}

/// Execution allowed only between start and end time. This method will:
/// - read the metadata for the sender address,
/// - remove the metadata from the storage,
/// - mint the NFT with the metadata,
/// - decrease the available nfts by 1,
/// - increase the minted nfts by 1
/// - send the mint message to the NFT collection contract
fn try_mint(deps: DepsMut, env: Env, info: MessageInfo) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    cfg.is_minting_period(env.block.time)?;

    let collection_addr = match cfg.nft_collection_address {
        Some(addr) => addr,
        None => return Err(ContractError::NftCollectionAddressNotSet {}),
    };

    let nft_metadata = NFT_METADATA.load(deps.storage, info.sender.to_string())?;
    NFT_METADATA.remove(deps.storage, info.sender.to_string());

    let mint_msg = WasmMsg::Execute {
        contract_addr: collection_addr.to_string(),
        msg: to_json_binary(&ExecuteCollectionMsg::Mint(MintMsg {
            token_id: nft_metadata.token_id,
            owner: info.sender.to_string(),
            extension: nft_metadata.extension,
            token_uri: None,
        }))?,
        funds: vec![],
    };

    STATS.update(deps.storage, |mut stats| -> Result<_, ContractError> {
        stats.available_nfts -= 1;
        stats.minted_nfts += 1;
        Ok(stats)
    })?;

    Ok(Response::new()
        .add_attribute("method", "try_mint")
        .add_message(mint_msg))
}

/// Execution allowed only after end time if any NFT was left to be minted.
/// This method will:
/// - iterate over all nft metadata and mint the NFTs with the metadata
/// - modify the minter stats
/// - remove the metadata from the storage
/// - send the mint messages to the NFT collection contract.
fn try_send_to_dao_treasury(
    deps: DepsMut,
    env: Env,
    mut batch_length: i16,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    cfg.has_minting_period_finish(env.block.time)?;
    let collection_addr = match cfg.nft_collection_address {
        Some(addr) => addr,
        None => return Err(ContractError::NftCollectionAddressNotSet {}),
    };
    let owner = match cfg.dao_treasury_address {
        Some(addr) => addr,
        None => return Err(ContractError::DaoTreasuryAddressNotSet {}),
    };

    let mut stats = STATS.load(deps.storage)?;
    if stats.available_nfts == 0 {
        return Err(ContractError::NoAvailableNfts {});
    }
    if batch_length > stats.available_nfts {
        batch_length = stats.available_nfts;
    }

    let mut current_batch_iteration = 0;
    let mut addrs_to_remove_from_map: Vec<String> = Vec::new();
    let mut mint_msgs: Vec<WasmMsg> = Vec::new();

    // iterat over all nft metadata and append the info to two vectors
    // - addrs_to_remove_from_map: will be used to remove the metadata from the map
    // - mint_msgs: will be used to send the mint message to the NFT collection contract
    NFT_METADATA
        .range(deps.storage, None, None, Ascending)
        .try_for_each(|item| {
            if current_batch_iteration == batch_length {
                return None;
            }
            current_batch_iteration += 1;
            let nft_info = item.unwrap();

            let msg = WasmMsg::Execute {
                contract_addr: collection_addr.to_string(),
                msg: to_json_binary(&ExecuteCollectionMsg::Mint(MintMsg {
                    token_id: nft_info.1.token_id,
                    owner: owner.to_string(),
                    extension: nft_info.1.extension,
                    token_uri: None,
                }))
                .unwrap(),
                funds: vec![],
            };

            addrs_to_remove_from_map.push(nft_info.0.clone());
            mint_msgs.push(msg);

            Some(())
        });

    // update minter stats
    let minted_nfts = addrs_to_remove_from_map.len() as i16;
    stats.available_nfts -= minted_nfts;
    stats.minted_nfts += minted_nfts;
    STATS.save(deps.storage, &stats)?;

    // remove the metadata from the map
    for addr in addrs_to_remove_from_map.into_iter() {
        NFT_METADATA.remove(deps.storage, addr);
    }

    Ok(Response::new()
        .add_attribute("method", "try_send_to_dao_treasury")
        .add_attribute("nfts_send", current_batch_iteration.to_string())
        .add_messages(mint_msgs))
}

// This method will change the dao treasury address
// Execution only allowed when:
// - sender is the owner
// - address is a valid terra address
fn try_change_dao_treasury_address(
    deps: DepsMut,
    info: MessageInfo,
    address: String,
) -> Result<Response, ContractError> {
    let mut cfg = CONFIG.load(deps.storage)?;
    let addr = deps.api.addr_validate(&address)?;

    cfg.is_authorized_execution(info.sender)?;
    cfg.dao_treasury_address = Some(addr);
    CONFIG.save(deps.storage, &cfg)?;

    Ok(Response::new()
        .add_attribute("method", "try_change_dao_treasury_address")
        .add_attribute("new_dao_treasury_address", address))
}

fn try_change_owner(
    deps: DepsMut,
    info: MessageInfo,
    new_owner: String,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    cfg.is_authorized_execution(info.sender)?;
    let new_owner = deps.api.addr_validate(&new_owner)?;
    CONFIG.update(deps.storage, |mut config| -> Result<_, ContractError> {
        config.owner = new_owner.clone();
        Ok(config)
    })?;
    let collection_addr = match cfg.nft_collection_address {
        Some(addr) => addr,
        None => return Err(ContractError::NftCollectionAddressNotSet {}),
    };

    let msg = WasmMsg::Execute {
        contract_addr: collection_addr.to_string(),
        msg: to_json_binary(&ExecuteCollectionMsg::ChangeOwner(new_owner.to_string())).unwrap(),
        funds: vec![],
    };

    Ok(Response::default()
        .add_attributes(vec![
            ("action", "change_owner"),
            ("new_owner", new_owner.to_string().as_str()),
        ])
        .add_message(msg))
}
