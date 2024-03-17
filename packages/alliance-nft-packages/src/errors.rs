use cosmwasm_std::{Addr, OverflowError, StdError, Timestamp};
use cw721_base::ContractError as CW721BaseError;
use cw_asset::AssetError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized execution, sender ({0}) is not the expected address ({1})")]
    Unauthorized(Addr, Addr),

    #[error("{0}")]
    FromContractError(#[from] CW721BaseError),

    #[error("{0}")]
    FromAssetError(#[from] AssetError),

    #[error("{0}")]
    FromOverflowError(#[from] OverflowError),

    #[error("Invalid reply id {0}")]
    InvalidReplyId(u64),

    #[error("Empty delegation")]
    EmptyDelegation {},

    #[error("Validator {0} not found")]
    ValidatorNotFound(String),

    #[error("Not enough stake to undelegate")]
    NotEnoughStakeToUndelegate {},

    #[error("NFT already broken")]
    AlreadyBroken {},

    #[error("No active NFTs")]
    NoActiveNfts {},

    #[error("Invalid mint time range, mint_start_time is greater than mint_end_time")]
    InvalidMintTimeRange {},

    #[error("Invalid DAO treasury address")]
    InvalidDaoTreasuryAddress {},

    #[error("Invalid DAO treasury share. Must be less than or equal 20%")]
    InvalidDaoTreasuryShare {},

    #[error("Minting period starts at {0} and ends at {1}. Current time is {2}")]
    OutOfMintingPeriod(Timestamp, Timestamp, Timestamp),

    #[error("NFTs cannot be send to DAO yet, current time is {0} and mint end time is {1}")]
    CannotSendToDao(Timestamp, Timestamp),

    #[error("Address {0} already exists in minters list")]
    AlreadyExists(String),

    #[error("No available NFTs to be minted")]
    NoAvailableNfts {},

    #[error("DAO Address must be set")]
    DaoAddressNotSet {},

    #[error("Dao treasury address must be set")]
    DaoTreasuryAddressNotSet {},

    #[error("Nft collection address must be set")]
    NftCollectionAddressNotSet {},

    #[error("Migration data must be set: {0}")]
    MissingMigrationData(String),
}
