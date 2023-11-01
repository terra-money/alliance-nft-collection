use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Response, Timestamp};

use crate::{errors::ContractError, Extension};

#[cw_serde]
pub struct Trait {
    pub display_type: Option<String>,
    pub trait_type: String,
    pub value: String,
}

// see: https://docs.opensea.io/docs/metadata-standards
#[cw_serde]
pub struct Metadata {
    pub image: Option<String>,
    pub image_data: Option<String>,
    pub external_url: Option<String>,
    pub description: Option<String>,
    pub name: Option<String>,
    pub attributes: Option<Vec<Trait>>,
    pub background_color: Option<String>,
    pub animation_url: Option<String>,
    pub youtube_url: Option<String>,
}

#[cw_serde]
pub struct Config {
    pub owner: Addr,
    pub asset_denom: String,
}

#[cw_serde]
pub struct MinterConfig {
    pub owner: Addr,
    pub dao_address: Addr,
    pub nft_collection_address: Addr,
    pub mint_start_time: Timestamp,
    pub mint_end_time: Timestamp,
}

impl MinterConfig {
    pub fn new_partial(
        owner: Addr,
        dao_address: Addr,
        mint_start_time: Timestamp,
        mint_end_time: Timestamp,
    ) -> MinterConfig {
        MinterConfig {
            owner,
            mint_start_time,
            mint_end_time,
            dao_address,
            nft_collection_address: Addr::unchecked(""),
        }
    }

    // check if the sender is the owner
    pub fn is_authorized_execution(&self, expected: Addr) -> Result<Response, ContractError> {
        if self.owner != expected {
            return Err(ContractError::Unauthorized(expected, self.owner.clone()));
        }
        Ok(Response::default())
    }

    // check if the block time is between start and end time
    pub fn is_mint_enabled(&self, current_time: Timestamp) -> Result<Response, ContractError> {
        if current_time < self.mint_start_time || current_time > self.mint_end_time {
            return Err(ContractError::MintTimeCompleted(
                self.mint_start_time,
                self.mint_end_time,
                current_time,
            ));
        }

        Ok(Response::default())
    }

    // check if the block time is after end time
    pub fn is_send_to_dao_enabled(&self, time: Timestamp) -> Result<Response, ContractError> {
        if time < self.mint_end_time {
            return Err(ContractError::CannotSendToDao(time, self.mint_end_time));
        }

        Ok(Response::default())
    }
}

#[cw_serde]
pub struct MinterStats {
    pub available_nfts: i16,
    pub minted_nfts: i16,
}

impl MinterStats {
    pub fn default() -> MinterStats {
        MinterStats {
            available_nfts: 0,
            minted_nfts: 0,
        }
    }
}

// Model necessary because the nfts are sorted by the token_id
// the ones that scored more points should have a lower token_id ...
#[cw_serde]
pub struct MinterExtension {
    pub token_id: String,
    pub extension: Extension,
}