use cosmwasm_schema::cw_serde;
use cosmwasm_std::Decimal;
use cw_asset::AssetInfoUnchecked;

#[cw_serde]
pub struct MigrateMsg {
    pub version: String,

    pub nft_collection_code_id: Option<u64>,

    pub version110_data: Option<Version110MigrateData>,
}

#[cw_serde]
pub struct Version110MigrateData {
    pub dao_treasury_address: String,
    pub dao_treasury_share: Decimal,
    pub lst_hub: String,
    pub lst_asset_info: AssetInfoUnchecked,
}
