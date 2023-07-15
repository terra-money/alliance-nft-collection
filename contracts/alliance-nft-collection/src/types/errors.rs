use cosmwasm_std::StdError;
use cw721_base::ContractError as CW721BaseError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("{0}")]
    FromContractError(#[from] CW721BaseError),

    #[error("Invalid reply id {0}")]
    InvalidReplyId(u64),
}
