use alliance_nft_collection::types::{
    execute::ExecuteMsg, 
    instantiate::InstantiateMsg, 
    query::QueryMsg
};
use cosmwasm_schema::write_api;

fn main() {
    write_api! {
        instantiate: InstantiateMsg,
        execute: ExecuteMsg,
        query: QueryMsg,
    }
}
