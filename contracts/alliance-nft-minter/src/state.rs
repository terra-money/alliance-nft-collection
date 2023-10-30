use alliance_nft_packages::state::MinterConfig;
use cw_storage_plus::{Item, Map};

pub const CONFIG: Item<MinterConfig> = Item::new("cfg");
pub const NFTS: Map<String, bool> = Map::new("bn");
