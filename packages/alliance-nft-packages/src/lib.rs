pub mod errors;
pub mod execute;
pub mod instantiate;
pub mod migrate;
pub mod query;
pub mod state;

use crate::state::Metadata;
use cosmwasm_std::Empty;

pub type AllianceNftCollection<'a> = cw721_base::Cw721Contract<'a, Extension, Empty, Empty, Empty>;
pub type Extension = Metadata;
