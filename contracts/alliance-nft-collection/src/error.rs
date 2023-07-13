use cosmwasm_std::StdError;
use thiserror::Error;
use cw721_metadata_onchain::ContractError as Cw721MetadataContractError;
#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("{0}")]
    FromContractError(#[from] Cw721MetadataContractError),
}
