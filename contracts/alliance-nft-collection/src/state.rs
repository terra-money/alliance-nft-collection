use cosmwasm_std::{StdError, Storage, Uint128};
use cw_storage_plus::{Item, Map};

use alliance_nft_packages::{errors::ContractError, state::Config};

pub const CONFIG: Item<Config> = Item::new("cfg");

// Keep track of validators and stake
pub const VALS: Map<String, Uint128> = Map::new("val");

pub fn upsert_val(
    storage: &mut dyn Storage,
    validator: String,
    stake: Uint128,
) -> Result<(), ContractError> {
    VALS.update(storage, validator, |old| match old {
        Some(old_stake) => Ok::<Uint128, StdError>(old_stake + stake),
        None => Ok(stake),
    })?;
    Ok(())
}

pub fn reduce_val_stake(
    storage: &mut dyn Storage,
    validator: String,
    stake: Uint128,
) -> Result<(), ContractError> {
    VALS.update(storage, validator.clone(), |old| match old {
        Some(old_stake) => {
            if old_stake < stake {
                Err(ContractError::NotEnoughStakeToUndelegate {})
            } else {
                Ok(old_stake - stake)
            }
        }
        None => Err(ContractError::ValidatorNotFound(validator.to_string())),
    })?;
    Ok(())
}

// Keep track of rewards claimed for each token_id
pub const NFT_BALANCE_CLAIMED: Map<String, Uint128> = Map::new("nb");
pub const REWARD_BALANCE: Item<Uint128> = Item::new("rb");
pub const NUM_ACTIVE_NFTS: Item<u64> = Item::new("nan");
pub const BROKEN_NFTS: Map<String, bool> = Map::new("bn");
