use super::Extension;
use crate::state::{Config as ConfigRes, MinterConfig, MinterStats, MinterExtension};
use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::Empty;
use cw721::{
    AllNftInfoResponse, ApprovalResponse, ApprovalsResponse, ContractInfoResponse, NftInfoResponse,
    NumTokensResponse, OperatorsResponse, OwnerOfResponse, TokensResponse,
};
use cw721_base::QueryMsg as CW721QueryMsg;

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryCollectionMsg {
    #[returns(ConfigRes)]
    Config {},

    /// With MetaData Extension.
    /// Returns metadata about one particular token,
    /// based on *ERC721 Metadata JSON Schema*
    /// https://docs.opensea.io/docs/metadata-standards
    ///
    /// {    
    ///    "name": "AllianceNFT # 1",
    ///    "token_uri": null,
    ///    "extension": {
    ///      "image": "https://ipfs.io/ipfs/{hash}",
    ///      "description": "Received for participating on Game Of Alliance",
    ///      "name": "AllianceNFT # 1",
    ///      "attributes": [{
    ///              "display_type" : null,
    ///              "trait_type": "x",
    ///              "value": "1"
    ///          },{
    ///              "display_type" : null,
    ///              "trait_type": "y",
    ///              "value": "1"
    ///          },{
    ///              "display_type" : null,
    ///              "trait_type": "width",
    ///              "value": "120"
    ///          },{
    ///              "display_type" : null,
    ///              "trait_type": "height",
    ///              "value": "120"
    ///          },{
    ///              "display_type" : null,
    ///              "trait_type": "rarity",
    ///              "value": 11
    ///          }],
    ///      "image_data": null,
    ///      "external_url": null,
    ///      "background_color": null,
    ///      "animation_url": null,
    ///      "youtube_url": null
    ///    }
    ///  }
    #[returns(NftInfoResponse<Extension>)]
    NftInfo { token_id: String },

    /// With MetaData Extension.
    /// Returns the result of both `NftInfo` and `OwnerOf` as one query as an optimization
    #[returns(AllNftInfoResponse<Extension>)]
    AllNftInfo {
        token_id: String,
        /// unset or false will filter out expired approvals, you must set to true to see them
        include_expired: Option<bool>,
    },

    /// CW721 Queries

    /// Return the owner of the given token, error if token does not exist
    #[returns(OwnerOfResponse)]
    OwnerOf {
        token_id: String,
        /// unset or false will filter out expired approvals, you must set to true to see them
        include_expired: Option<bool>,
    },
    /// Return operator that can access all of the owner's tokens.
    /// Return the owner of the given token, error if token does not exist
    #[returns(ApprovalResponse)]
    Approval {
        token_id: String,
        spender: String,
        include_expired: Option<bool>,
    },
    /// Return approvals that a token has
    #[returns(ApprovalsResponse)]
    Approvals {
        token_id: String,
        include_expired: Option<bool>,
    },
    /// List all operators that can access all of the owner's tokens
    #[returns(OperatorsResponse)]
    AllOperators {
        owner: String,
        /// unset or false will filter out expired items, you must set to true to see them
        include_expired: Option<bool>,
        start_after: Option<String>,
        limit: Option<u32>,
    },
    /// Total number of tokens issued
    #[returns(NumTokensResponse)]
    NumTokens {},

    /// With MetaData Extension.
    #[returns(ContractInfoResponse)]
    ContractInfo {},

    /// With Enumerable extension.
    /// Returns all tokens owned by the given address, [] if unset.
    #[returns(TokensResponse)]
    Tokens {
        owner: String,
        start_after: Option<String>,
        limit: Option<u32>,
    },
    /// With Enumerable extension.
    /// Requires pagination. Lists all token_ids controlled by the contract.
    #[returns(TokensResponse)]
    AllTokens {
        start_after: Option<String>,
        limit: Option<u32>,
    },

    // Return the minter
    #[returns(MinterResponse)]
    Minter {},
}

#[cw_serde]
pub struct MinterResponse {
    pub minter: String,
}

impl From<QueryCollectionMsg> for CW721QueryMsg<Empty> {
    fn from(msg: QueryCollectionMsg) -> CW721QueryMsg<Empty> {
        match msg {
            QueryCollectionMsg::OwnerOf {
                token_id,
                include_expired,
            } => CW721QueryMsg::OwnerOf {
                token_id,
                include_expired,
            },
            QueryCollectionMsg::Approval {
                token_id,
                spender,
                include_expired,
            } => CW721QueryMsg::Approval {
                token_id,
                spender,
                include_expired,
            },
            QueryCollectionMsg::Approvals {
                token_id,
                include_expired,
            } => CW721QueryMsg::Approvals {
                token_id,
                include_expired,
            },
            QueryCollectionMsg::AllOperators {
                owner,
                include_expired,
                start_after,
                limit,
            } => CW721QueryMsg::AllOperators {
                owner,
                include_expired,
                start_after,
                limit,
            },
            QueryCollectionMsg::NumTokens {} => CW721QueryMsg::NumTokens {},
            QueryCollectionMsg::ContractInfo {} => CW721QueryMsg::ContractInfo {},
            QueryCollectionMsg::NftInfo { token_id } => CW721QueryMsg::NftInfo { token_id },
            QueryCollectionMsg::AllNftInfo {
                token_id,
                include_expired,
            } => CW721QueryMsg::AllNftInfo {
                token_id,
                include_expired,
            },
            QueryCollectionMsg::Tokens {
                owner,
                start_after,
                limit,
            } => CW721QueryMsg::Tokens {
                owner,
                start_after,
                limit,
            },
            QueryCollectionMsg::AllTokens { start_after, limit } => {
                CW721QueryMsg::AllTokens { start_after, limit }
            }
            QueryCollectionMsg::Minter {} => CW721QueryMsg::Minter {},
            _ => panic!("cannot covert {:?} to CW721QueryMsg", msg),
        }
    }
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMinterMsg {
    #[returns(MinterConfig)]
    Config {},
    #[returns(MinterStats)]
    Stats {},
    #[returns(MinterExtension)]
    NftData(String),
}
