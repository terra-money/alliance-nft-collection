use cosmwasm_std::{StdError, Addr};
use cw721_base::ContractError as CW721BaseError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized execution, sender ({0}) is not the contract owner ({1})")]
    Unauthorized(Addr, Addr),

    #[error("{0}")]
    FromContractError(#[from] CW721BaseError),

    #[error("Invalid reply id {0}")]
    InvalidReplyId(u64),
}
