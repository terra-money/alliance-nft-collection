use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, DepsMut, Uint128, StdError, Storage};
use cw_storage_plus::{Item, Map};

use crate::types::errors::ContractError;

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

pub const CONFIG: Item<Config> = Item::new("cfg");

// Keep track of validators and stake
pub const VALS: Map<String, Uint128> = Map::new("val");

pub fn upsert_vals(storage: &mut dyn Storage, validator: String, stake: Uint128) -> Result<(), ContractError> {
    VALS.update(storage, validator, |old| match old {
        Some(old_stake) => Ok::<Uint128, StdError>(old_stake + stake),
        None => Ok(stake),
    })?;
    Ok(())
}

// Keep track of in-progress unbondings
// - max of 7 unbondings at the same time
pub const UNBONDINGS: Map<String, Uint128> = Map::new("unb");

// Keep track of in-progress redelegations
// - max of 7 redelegations at the same time
pub const REDELEGATIONS: Map<String, Uint128> = Map::new("red");
