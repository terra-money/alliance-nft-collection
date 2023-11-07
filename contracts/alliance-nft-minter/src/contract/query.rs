use alliance_nft_packages::query::QueryMinterMsg;
use alliance_nft_packages::state::{MinterConfig, MinterStats, MinterExtension};
use cosmwasm_std::{entry_point, to_binary};
use cosmwasm_std::{Binary, Deps, Env, StdResult};

use crate::state::{CONFIG, NFT_METADATA, STATS};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMinterMsg) -> StdResult<Binary> {
    match msg {
        QueryMinterMsg::Config {} => to_binary(&query_config(deps)?),
        QueryMinterMsg::Stats {} => to_binary(&query_stats(deps)?),
        QueryMinterMsg::NftData(address) => to_binary(&query_nft_data(deps, address)?),
    }
}

fn query_config(deps: Deps) -> StdResult<MinterConfig> {
    let res = CONFIG.load(deps.storage)?;

    Ok(res)
}

fn query_stats(deps: Deps) -> StdResult<MinterStats> {
    let res = STATS.load(deps.storage)?;

    Ok(res)
}

fn query_nft_data(deps: Deps, address: String) -> StdResult<MinterExtension> {
    let minter_stats = NFT_METADATA.load(deps.storage, address)?;

    Ok(minter_stats)
}
