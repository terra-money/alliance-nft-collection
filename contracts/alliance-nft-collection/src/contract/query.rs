use cosmwasm_std::{entry_point, MessageInfo, to_binary, Uint128};
use cosmwasm_std::{Binary, Deps, Env, StdResult};
use cw721::{AllNftInfoResponse, NftInfoResponse, OwnerOfResponse, Approval};
use cw721_base::state::{TokenInfo, Approval as BaseApproval};

use crate::state::{BROKEN_NFTS, CONFIG, Metadata, NFT_BALANCE_CLAIMED, REWARD_BALANCE, Trait};
use crate::types::{query::QueryMsg, AllianceNftCollection, Extension};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    let parent = AllianceNftCollection::default();
        match msg {
        QueryMsg::Config {} => to_binary(&CONFIG.load(deps.storage)?),
        QueryMsg::NftInfo {token_id} => to_binary(&query_nft_info(deps, parent, token_id)?),
            QueryMsg::AllNftInfo {token_id, include_expired} => to_binary(&query_all_nft_info(deps, env, parent, token_id, include_expired)?),
        _ => {
            parent.query(deps, env, msg.into())
        }
    }
}

fn query_token_info(deps: Deps, parent: AllianceNftCollection, token_id: String) -> StdResult<TokenInfo<Extension>> {
    let mut info = parent.tokens.load(deps.storage, &token_id)?;
    let reward_balance = REWARD_BALANCE.load(deps.storage)?;
    let claimed_reward = NFT_BALANCE_CLAIMED.load(deps.storage, token_id.clone())?;
    let rewards_left = reward_balance.checked_sub(claimed_reward).unwrap_or(Uint128::zero());

    let is_broken = BROKEN_NFTS.may_load(deps.storage, token_id.clone())?.unwrap_or(false);
    let mut traits = info.extension.attributes.unwrap().clone();
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

fn query_nft_info(deps: Deps, parent: AllianceNftCollection, token_id: String) -> StdResult<NftInfoResponse<Extension>> {
    let info = query_token_info(deps, parent, token_id.clone())?;
    Ok(NftInfoResponse {
        token_uri: info.token_uri,
        extension: info.extension,
    })
}

fn query_all_nft_info(deps: Deps, env: Env, parent: AllianceNftCollection, token_id: String, include_expired: Option<bool>) -> StdResult<AllNftInfoResponse<Extension>> {
    let info = query_token_info(deps, parent, token_id.clone())?;
    let block = &env.block;
    let include_expired = include_expired.unwrap_or(false);
    let approvals: Vec<Approval> = info.approvals
        .iter()
        .filter(|apr| include_expired || !apr.is_expired(block))
        .map(|a| humanize_approval(a))
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