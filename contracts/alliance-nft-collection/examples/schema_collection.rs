use alliance_nft_packages::{
    instantiate::InstantiateCollectionMsg,
    execute::ExecuteCollectionMsg,
    query::QueryCollectionMsg
};
use cosmwasm_schema::write_api;

fn main() {
    write_api! {
        instantiate: InstantiateCollectionMsg,
        execute: ExecuteCollectionMsg,
        query: QueryCollectionMsg,
    }
}
