use cosmwasm_std::{entry_point, to_binary, Uint128};
use cosmwasm_std::{Binary, Deps, Env, StdResult};
use cw721::{AllNftInfoResponse, Approval, NftInfoResponse, OwnerOfResponse};
use cw721_base::state::{Approval as BaseApproval, TokenInfo};

use alliance_nft_packages::state::{Trait, Config};
use alliance_nft_packages::{query::QueryCollectionMsg, AllianceNftCollection, Extension};

use crate::state::{CONFIG, BROKEN_NFTS, REWARD_BALANCE, NFT_BALANCE_CLAIMED};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryCollectionMsg) -> StdResult<Binary> {
    let parent = AllianceNftCollection::default();
    match msg {
        QueryCollectionMsg::Config {} => to_binary(&query_config(deps)?),
        QueryCollectionMsg::NftInfo { token_id } => to_binary(&query_nft_info(deps, parent, token_id)?),
        QueryCollectionMsg::AllNftInfo {
            token_id,
            include_expired,
        } => to_binary(&query_all_nft_info(
            deps,
            env,
            parent,
            token_id,
            include_expired,
        )?),
        _ => parent.query(deps, env, msg.into()),
    }
}

fn query_config(deps : Deps) -> StdResult<Config>{
    let res = CONFIG.load(deps.storage)?;

    Ok(res)
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
