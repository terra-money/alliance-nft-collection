use cosmwasm_schema::cw_serde;
use cw721_base::InstantiateMsg as CW721InstantiateMsg;

#[cw_serde]
pub struct InstantiateMsg {
    pub name: String,
    pub symbol: String,
    pub minter: String,
}

impl From<InstantiateMsg> for CW721InstantiateMsg {
    fn from(msg: InstantiateMsg) -> CW721InstantiateMsg {
        CW721InstantiateMsg {
            name: msg.name,
            symbol: msg.symbol,
            minter: msg.minter,
        }
    }
}
