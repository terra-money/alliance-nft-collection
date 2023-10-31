use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Timestamp};
use cw721_base::InstantiateMsg as CW721InstantiateMsg;

#[cw_serde]
pub struct InstantiateCollectionMsg {
    pub name: String,
    pub symbol: String,
    pub minter: String,
    pub owner: Addr,
}

impl From<InstantiateCollectionMsg> for CW721InstantiateMsg {
    fn from(msg: InstantiateCollectionMsg) -> CW721InstantiateMsg {
        CW721InstantiateMsg {
            name: msg.name,
            symbol: msg.symbol,
            minter: msg.minter,
        }
    }
}

#[cw_serde]
pub struct InstantiateMinterMsg {
    pub dao_address: Addr,
    pub nft_collection_code_id: u64,
    pub mint_start_time: Timestamp,
    pub mint_end_time: Timestamp,
}
