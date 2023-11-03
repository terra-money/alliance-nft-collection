use alliance_nft_packages::{instantiate::InstantiateMinterMsg, execute::ExecuteMinterMsg, query::QueryMinterMsg};
use cosmwasm_schema::write_api;

fn main() {
    write_api! {
        instantiate: InstantiateMinterMsg,
        execute: ExecuteMinterMsg,
        query: QueryMinterMsg,
    }
}
