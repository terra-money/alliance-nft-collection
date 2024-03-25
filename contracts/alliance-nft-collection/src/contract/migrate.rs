use alliance_nft_packages::eris::{validate_dao_treasury_share, Hub};
use alliance_nft_packages::migrate::Version110MigrateData;
use alliance_nft_packages::state::{Config, ConfigV100, ALLOWED_DENOM};
use cosmwasm_std::entry_point;
use cosmwasm_std::{DepsMut, Env, Response};
use cw2::{get_contract_version, set_contract_version};

use alliance_nft_packages::{errors::ContractError, migrate::MigrateMsg};
use cw_asset::AssetInfo;
use cw_storage_plus::Item;

use crate::state::{CONFIG, REWARD_BALANCE};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(deps: DepsMut, env: Env, msg: MigrateMsg) -> Result<Response, ContractError> {
    try_migrate(deps, env, msg)
}

fn try_migrate(deps: DepsMut, env: Env, msg: MigrateMsg) -> Result<Response, ContractError> {
    let version = msg.version;
    let contract_version = get_contract_version(deps.storage)?;
    set_contract_version(
        deps.storage,
        contract_version.contract.clone(),
        version.clone(),
    )?;

    if version == "1.1.0" {
        return match msg.version110_data {
            Some(data) => return migrate_to_1_1_0(deps, env, data, contract_version.contract),
            None => Err(ContractError::MissingMigrationData(version)),
        };
    }

    Ok(Response::new()
        .add_attribute("method", "try_migrate")
        .add_attribute("version", contract_version.version))
}

fn migrate_to_1_1_0(
    deps: DepsMut,
    env: Env,
    data: Version110MigrateData,
    version: String,
) -> Result<Response, ContractError> {
    // apply config from migration data. Only share, whitelisted_reward_assets can be changed via an updateconfig message.
    let config_old: ConfigV100 = Item::new("cfg").load(deps.storage)?;
    let config = Config {
        owner: config_old.owner,
        asset_denom: config_old.asset_denom,
        dao_treasury_address: deps.api.addr_validate(&data.dao_treasury_address)?,
        dao_treasury_share: validate_dao_treasury_share(data.dao_treasury_share)?,
        lst_hub_address: Hub(deps.api.addr_validate(&data.lst_hub)?),
        lst_asset_info: data.lst_asset_info.check(deps.api, None)?,
        whitelisted_reward_assets: vec![],
    };
    CONFIG.save(deps.storage, &config)?;

    // for simplification, we just use the exchange rate to estimate the resulting received ampLUNA
    // if there is a rounding issue, we will top up the missing ampLUNA to the contract, which is way less than 1 ampLUNA
    // this allows us to keep the contract simplified and not work with callback messages to check how much ampLUNA was really received.
    // total_ustake = 200k, total_uluna = 300k, rewards_current = 10k -> rewards_in_lst = 6.66k
    let lst_hub_state = config.lst_hub_address.query_state(&deps.querier)?;
    let rewards_current = REWARD_BALANCE.load(deps.storage)?;
    let rewards_in_lst =
        rewards_current.multiply_ratio(lst_hub_state.total_ustake, lst_hub_state.total_uluna);
    REWARD_BALANCE.save(deps.storage, &rewards_in_lst)?;

    // create bond message
    let balance_native =
        AssetInfo::native(ALLOWED_DENOM).query_balance(&deps.querier, env.contract.address)?;
    let bond_msg = config
        .lst_hub_address
        .bond_msg(ALLOWED_DENOM, balance_native.u128(), None)?;

    // we are not updating NFT_BALANCE_CLAIMED (nb), as all NFT_BALANCE_CLAIMED are at 0, further once broken it does not matter anymore.
    // and there arent any NFTs that are not broken and having a claimed balance.
    // This can only happen if a mint happened after the first rewards were distributed, which is not the case for Alliance DAO
    // and should not be the case between now and the application of the migration.

    Ok(Response::new()
        .add_attribute("method", "migrate_to_1_1_0")
        .add_attribute("version", version)
        .add_message(bond_msg))
}
