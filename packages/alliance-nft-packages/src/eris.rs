use std::collections::HashSet;

use crate::errors::ContractError;
use cosmwasm_schema::cw_serde;
use cosmwasm_std::{
    coin, to_json_binary, Addr, Coin, CosmosMsg, Decimal, DepsMut, QuerierWrapper, StdResult,
    Uint128, WasmMsg,
};
use cw_asset::{Asset, AssetInfo, AssetInfoUnchecked};

pub fn validate_dao_treasury_share(share: Decimal) -> Result<Decimal, ContractError> {
    if share > Decimal::from_ratio(20u128, 100u128) {
        Err(ContractError::InvalidDaoTreasuryShare {})
    } else {
        Ok(share)
    }
}

pub fn validate_whitelisted_assets(
    deps: &DepsMut,
    assets: Vec<AssetInfoUnchecked>,
) -> Result<Vec<AssetInfo>, ContractError> {
    assets
        .iter()
        .map(|a| {
            a.check(deps.api, None)
                .map_err(ContractError::FromAssetError)
        })
        .collect::<Result<Vec<AssetInfo>, ContractError>>()
}

/// Dedupes a Vector of strings using a hashset.
pub fn dedupe_assetinfos(asset_infos: &mut Vec<AssetInfo>) {
    let mut set = HashSet::new();

    asset_infos.retain(|x| set.insert(x.clone()));
}

#[cw_serde]
pub enum ExecuteMsg {
    /// Bond specified amount of Luna
    Bond { receiver: Option<String> },
}

#[cw_serde]
pub enum ClaimExecuteMsg {
    Claim {},
}

#[cw_serde]
pub enum QueryMsg {
    State {},
}

#[cw_serde]
pub struct StateResponse {
    /// Total supply to the Stake token
    pub total_ustake: Uint128,
    /// Total amount of uluna staked (bonded)
    pub total_uluna: Uint128,
    /// The exchange rate between ustake and uluna, in terms of uluna per ustake
    pub exchange_rate: Decimal,
    /// Staking rewards currently held by the contract that are ready to be reinvested
    pub unlocked_coins: Vec<Coin>,
    // Amount of uluna currently unbonding
    pub unbonding: Uint128,
    // Amount of uluna currently available as balance of the contract
    pub available: Uint128,
    // Total amount of uluna within the contract (bonded + unbonding + available)
    pub tvl_uluna: Uint128,
}

#[cw_serde]
pub struct Hub(pub Addr);

impl Hub {
    /// executes a bond message to the staking Hub
    pub fn bond_msg(
        &self,
        denom: impl Into<String>,
        amount: u128,
        receiver: Option<String>,
    ) -> StdResult<CosmosMsg> {
        Ok(CosmosMsg::Wasm(WasmMsg::Execute {
            contract_addr: self.0.to_string(),
            msg: to_json_binary(&ExecuteMsg::Bond { receiver })?,
            funds: vec![coin(amount, denom)],
        }))
    }

    pub fn query_state(&self, querier: &QuerierWrapper) -> StdResult<StateResponse> {
        let state: StateResponse =
            querier.query_wasm_smart(self.0.to_string(), &QueryMsg::State {})?;
        Ok(state)
    }
}

pub trait AssetInfoExt {
    /// simplifies converting an AssetInfo to an Asset with balance
    fn with_balance(self, balance: Uint128) -> Asset;
}

impl AssetInfoExt for AssetInfo {
    fn with_balance(self, amount: Uint128) -> Asset {
        match self {
            cw_asset::AssetInfoBase::Native(denom) => Asset::native(denom, amount),
            cw_asset::AssetInfoBase::Cw20(contract_addr) => Asset::cw20(contract_addr, amount),
            _ => todo!(),
        }
    }
}
