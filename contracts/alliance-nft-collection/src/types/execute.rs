use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Binary, Empty, Uint128};
use cw721_base::ExecuteMsg as CW721ExecuteMsg;
use cw_utils::Expiration;

use super::Extension;

#[cw_serde]
pub struct MintMsg {
    /// Unique ID of the NFT
    token_id: String,
    /// The owner of the newly minter NFT
    owner: String,
    /// Universal resource identifier for this NFT
    /// Should point to a JSON file that conforms to the ERC721
    /// Metadata JSON Schema
    token_uri: Option<String>,
    /// Any custom extension used by this contract
    extension: Extension,
}

#[cw_serde]
pub enum ExecuteMsg {
    AllianceDelegate(Box<AllianceDelegateMsg>),
    AllianceUndelegate(Box<AllianceUndelegateMsg>),
    AllianceRedelegate(Box<AllianceRedelegateMsg>),
    AllianceClaimRewards {},

    // Claim the accumulated rewards and send them to the owner
    // while the NFT is broken it will not accumulate rewards
    BreakNft(String),

    /// Mint a new NFT, can only be called by the contract minter
    Mint(Box<MintMsg>),

    /// CW721 standard message

    /// Transfer is a base message to move a token to another account without triggering actions
    TransferNft {
        recipient: String,
        token_id: String,
    },
    /// Send is a base message to transfer a token to a contract and trigger an action
    /// on the receiving contract.
    SendNft {
        contract: String,
        token_id: String,
        msg: Binary,
    },
    /// Allows operator to transfer / send the token from the owner's account.
    /// If expiration is set, then this allowance has a time/height limit
    Approve {
        spender: String,
        token_id: String,
        expires: Option<Expiration>,
    },
    /// Remove previously granted Approval
    Revoke {
        spender: String,
        token_id: String,
    },
    /// Allows operator to transfer / send any token from the owner's account.
    /// If expiration is set, then this allowance has a time/height limit
    ApproveAll {
        operator: String,
        expires: Option<Expiration>,
    },
    /// Remove previously granted ApproveAll permission
    RevokeAll {
        operator: String,
    },
}

impl From<ExecuteMsg> for CW721ExecuteMsg<Extension, Empty> {
    fn from(msg: ExecuteMsg) -> CW721ExecuteMsg<Extension, Empty> {
        match msg {
            ExecuteMsg::TransferNft {
                recipient,
                token_id,
            } => CW721ExecuteMsg::TransferNft {
                recipient,
                token_id,
            },
            ExecuteMsg::SendNft {
                contract,
                token_id,
                msg,
            } => CW721ExecuteMsg::SendNft {
                contract,
                token_id,
                msg,
            },
            ExecuteMsg::Approve {
                spender,
                token_id,
                expires,
            } => CW721ExecuteMsg::Approve {
                spender,
                token_id,
                expires,
            },
            ExecuteMsg::Revoke { spender, token_id } => {
                CW721ExecuteMsg::Revoke { spender, token_id }
            }
            ExecuteMsg::ApproveAll { operator, expires } => {
                CW721ExecuteMsg::ApproveAll { operator, expires }
            }
            ExecuteMsg::RevokeAll { operator } => CW721ExecuteMsg::RevokeAll { operator },
            _ => panic!("cannot covert {:?} to CW721ExecuteMsg", msg),
        }
    }
}

#[cw_serde]
pub struct AllianceDelegation {
    pub validator: String,
    pub amount: Uint128,
}

#[cw_serde]
pub struct AllianceDelegateMsg {
    pub delegations: Vec<AllianceDelegation>,
}

#[cw_serde]
pub struct AllianceUndelegateMsg {
    pub undelegations: Vec<AllianceDelegation>,
}

#[cw_serde]
pub struct AllianceRedelegation {
    pub src_validator: String,
    pub dst_validator: String,
    pub amount: Uint128,
}

#[cw_serde]
pub struct AllianceRedelegateMsg {
    pub redelegations: Vec<AllianceRedelegation>,
}
