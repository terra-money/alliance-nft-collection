use alliance_nft_packages::eris::AssetInfoExt;
use alliance_nft_packages::query::RewardsResponse;
use alliance_nft_packages::state::{Config, Trait};
use alliance_nft_packages::{query::QueryCollectionMsg, AllianceNftCollection, Extension};
use cosmwasm_std::{entry_point, to_json_binary, Decimal, StdError, Uint128};
use cosmwasm_std::{Binary, Deps, Env, StdResult};
use cw721::{AllNftInfoResponse, Approval, NftInfoResponse, OwnerOfResponse};
use cw721_base::state::{Approval as BaseApproval, TokenInfo};

use crate::state::{BROKEN_NFTS, CONFIG, NFT_BALANCE_CLAIMED, REWARD_BALANCE};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryCollectionMsg) -> StdResult<Binary> {
    let parent = AllianceNftCollection::default();
    match msg {
        QueryCollectionMsg::Config {} => to_json_binary(&query_config(deps)?),
        QueryCollectionMsg::NftInfo { token_id } => {
            to_json_binary(&query_nft_info(deps, parent, token_id)?)
        }
        QueryCollectionMsg::AllNftInfo {
            token_id,
            include_expired,
        } => to_json_binary(&query_all_nft_info(
            deps,
            env,
            parent,
            token_id,
            include_expired,
        )?),

        QueryCollectionMsg::Rewards { token_id } => {
            to_json_binary(&query_rewards(deps, env, token_id)?)
        }

        _ => parent.query(deps, env, msg.into()),
    }
}

fn query_config(deps: Deps) -> StdResult<Config> {
    let res = CONFIG.load(deps.storage)?;

    Ok(res)
}

fn query_rewards(deps: Deps, env: Env, token_id: String) -> StdResult<RewardsResponse> {
    let cfg = CONFIG.load(deps.storage)?;

    let rewards_claimed = NFT_BALANCE_CLAIMED.load(deps.storage, token_id.to_string())?;
    let average_rewards = REWARD_BALANCE.load(deps.storage)?;
    let rewards_claimable = average_rewards - rewards_claimed;

    let mut rewards = vec![cfg.lst_asset_info.clone().with_balance(rewards_claimable)];

    let rewards_total = cfg
        .lst_asset_info
        .query_balance(&deps.querier, env.contract.address.to_string())
        .map_err(|e| StdError::generic_err(format!("failed lst query: {0}", e)))?;
    let user_share = Decimal::from_ratio(rewards_claimable, rewards_total);

    for whitelisted_reward_asset in cfg.whitelisted_reward_assets {
        let balance = whitelisted_reward_asset
            .query_balance(&deps.querier, env.contract.address.to_string())
            .map_err(|e| StdError::generic_err(format!("failed balance query: {0}", e)))?;

        // always floored
        let user_balance = user_share * balance;
        if !user_balance.is_zero() {
            rewards.push(whitelisted_reward_asset.with_balance(user_balance));
        }
    }
    Ok(RewardsResponse { rewards })
}

fn query_token_info(
    deps: Deps,
    parent: AllianceNftCollection,
    token_id: String,
) -> StdResult<TokenInfo<Extension>> {
    let mut info = parent.tokens.load(deps.storage, &token_id)?;
    let is_broken = BROKEN_NFTS
        .may_load(deps.storage, token_id.clone())?
        .unwrap_or(false);
    let rewards_left = if is_broken {
        Uint128::zero()
    } else {
        let reward_balance = REWARD_BALANCE.load(deps.storage)?;
        let claimed_reward = NFT_BALANCE_CLAIMED.load(deps.storage, token_id)?;
        reward_balance
            .checked_sub(claimed_reward)
            .unwrap_or(Uint128::zero())
    };

    let mut traits = info.extension.attributes.unwrap();
    traits.push(Trait {
        display_type: None,
        trait_type: "broken".to_string(),
        value: is_broken.to_string(),
    });
    traits.push(Trait {
        display_type: None,
        trait_type: "rewards".to_string(),
        value: rewards_left.to_string(),
    });
    info.extension.attributes = Some(traits);
    Ok(info)
}

fn query_nft_info(
    deps: Deps,
    parent: AllianceNftCollection,
    token_id: String,
) -> StdResult<NftInfoResponse<Extension>> {
    let info = query_token_info(deps, parent, token_id)?;
    Ok(NftInfoResponse {
        token_uri: info.token_uri,
        extension: info.extension,
    })
}

fn query_all_nft_info(
    deps: Deps,
    env: Env,
    parent: AllianceNftCollection,
    token_id: String,
    include_expired: Option<bool>,
) -> StdResult<AllNftInfoResponse<Extension>> {
    let info = query_token_info(deps, parent, token_id)?;
    let block = &env.block;
    let include_expired = include_expired.unwrap_or(false);
    let approvals: Vec<Approval> = info
        .approvals
        .iter()
        .filter(|apr| include_expired || !apr.is_expired(block))
        .map(humanize_approval)
        .collect();

    Ok(AllNftInfoResponse {
        access: OwnerOfResponse {
            approvals,
            owner: info.owner.to_string(),
        },
        info: NftInfoResponse {
            token_uri: info.token_uri,
            extension: info.extension,
        },
    })
}

fn humanize_approval(approval: &BaseApproval) -> Approval {
    Approval {
        spender: approval.spender.to_string(),
        expires: approval.expires,
    }
}
