use cosmwasm_std::{Addr, StdError, Timestamp};
use cw721_base::ContractError as CW721BaseError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized execution, sender ({0}) is not the expected address ({1})")]
    Unauthorized(Addr, Addr),

    #[error("{0}")]
    FromContractError(#[from] CW721BaseError),

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

    #[error("Mint time must be greater than {0} and lesser than {1}, current time is {2}")]
    MintTimeCompleted(Timestamp, Timestamp, Timestamp),

    #[error("NFTs cannot be send to DAO yet, current time is {0} and mint end time is {1}")]
    CannotSendToDao(Timestamp, Timestamp),

    #[error("Address {0} already exists in minters list")]
    AlreadyExists(String),

    #[error("No available NFTs to be minted")]
    NoAvailableNfts {}
}
