use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Uint128};

use cw721_base::{ExecuteMsg as CW721ExecuteMsg,Extension};
use cw721_metadata_onchain::Metadata;

#[cw_serde]
pub struct InstantiateMsg {
    pub owner: Addr,
}

#[cw_serde]
pub enum ExecuteAllianceMsg {
    AllianceDelegate(AllianceDelegateMsg),
    AllianceUndelegate(AllianceUndelegateMsg),
    AllianceRedelegate(AllianceRedelegateMsg),
    AllianceClaimRewards{},

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


#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryAllianceMsg {
    #[returns(ConfigResponse)]
    GetConfig {},
}

#[cw_serde]
pub struct ConfigResponse { 
    pub owner: Addr,
}
