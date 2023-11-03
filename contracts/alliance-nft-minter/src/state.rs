use alliance_nft_packages::state::{MinterConfig, MinterStats, MinterExtension};
use cw_storage_plus::{Item, Map};

// contract configuration like admin and minting times
pub const CONFIG: Item<MinterConfig> = Item::new("cfg");
// array of metadata where the: 
//  - key is the terra address,
//  - value is the nft metadata,
pub const NFT_METADATA: Map<String, MinterExtension> = Map::new("nfts");

// Keep track of the number of minted NFTs
pub const STATS: Item<MinterStats> = Item::new("ms");
