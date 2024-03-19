use alliance_nft_packages::eris::{
    dedupe_assetinfos, validate_dao_treasury_share, validate_whitelisted_assets, AssetInfoExt,
};
use alliance_nft_packages::execute::{UpdateConfigMsg, UpdateRewardsCallbackMsg};
use alliance_nft_packages::state::ALLOWED_DENOM;
use cosmwasm_std::{
    attr, entry_point, to_json_binary, Addr, Binary, CosmosMsg, Decimal, Order, SubMsg, Uint128,
    WasmMsg,
};
use cosmwasm_std::{DepsMut, Env, MessageInfo, Response};
use cw721::Cw721Query;
use cw_asset::AssetInfoBase;
use terra_proto_rs::alliance::alliance::{MsgClaimDelegationRewards, MsgRedelegate, MsgUndelegate};
use terra_proto_rs::{
    alliance::alliance::MsgDelegate, cosmos::base::v1beta1::Coin, traits::Message,
};

use crate::state::{
    reduce_val_stake, upsert_val, BROKEN_NFTS, CONFIG, NFT_BALANCE_CLAIMED, NUM_ACTIVE_NFTS,
    REWARD_BALANCE, VALS,
};
use alliance_nft_packages::{
    errors::ContractError,
    execute::{
        AllianceDelegateMsg, AllianceRedelegateMsg, AllianceUndelegateMsg, ExecuteCollectionMsg,
        MintMsg,
    },
    AllianceNftCollection,
};

use super::reply::CLAIM_REWARD_ERROR_REPLY_ID;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteCollectionMsg,
) -> Result<Response, ContractError> {
    let parent: AllianceNftCollection = AllianceNftCollection::default();
    match msg {
        ExecuteCollectionMsg::AllianceDelegate(msg) => try_alliance_delegate(deps, env, info, msg),
        ExecuteCollectionMsg::AllianceUndelegate(msg) => {
            try_alliance_undelegate(deps, env, info, msg)
        }
        ExecuteCollectionMsg::AllianceRedelegate(msg) => {
            try_alliance_redelegate(deps, env, info, msg)
        }
        ExecuteCollectionMsg::AllianceClaimRewards {} => try_alliance_claim_rewards(deps, env),

        ExecuteCollectionMsg::StakeRewardsCallback {} => try_stake_reward_callback(deps, env, info),
        ExecuteCollectionMsg::UpdateRewardsCallback(msg) => {
            try_update_reward_callback(deps, env, info, msg)
        }

        ExecuteCollectionMsg::BreakNft(token_id) => try_breaknft(deps, env, info, parent, token_id),
        ExecuteCollectionMsg::Mint(mint_msg) => try_mint(deps, info, parent, mint_msg),
        ExecuteCollectionMsg::ChangeOwner(new_owner) => try_change_owner(deps, info, new_owner),
        ExecuteCollectionMsg::UpdateConfig(msg) => try_update_config(deps, info, msg),

        _ => Ok(parent.execute(deps, env, info, msg.into())?),
    }
}

fn try_alliance_claim_rewards(deps: DepsMut, env: Env) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    let num_of_active = NUM_ACTIVE_NFTS.load(deps.storage)?;
    if num_of_active == 0 {
        return Err(ContractError::NoActiveNfts {});
    }

    let validators = VALS
        .range(deps.storage, None, None, Order::Ascending)
        .map(|v| v.unwrap().0)
        .collect::<Vec<String>>();
    let sub_msgs: Vec<SubMsg> = validators
        .iter()
        .map(|v| {
            let msg = MsgClaimDelegationRewards {
                delegator_address: env.contract.address.to_string(),
                validator_address: v.to_string(),
                denom: cfg.asset_denom.clone(),
            };
            let msg = CosmosMsg::Stargate {
                type_url: "/alliance.alliance.MsgClaimDelegationRewards".to_string(),
                value: Binary::from(msg.encode_to_vec()),
            };
            // Reply on error here is used to ignore errors from claiming rewards with validators that we did not delegate to
            SubMsg::reply_on_error(msg, CLAIM_REWARD_ERROR_REPLY_ID)
        })
        .collect();

    let msg = get_stake_reward_callback_msg(env);

    Ok(Response::new()
        .add_attributes(vec![("action", "update_rewards")])
        .add_submessages(sub_msgs)
        .add_message(msg))
}

fn get_stake_reward_callback_msg(env: Env) -> CosmosMsg {
    CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: env.contract.address.to_string(),
        msg: to_json_binary(&ExecuteCollectionMsg::StakeRewardsCallback {}).unwrap(),
        funds: vec![],
    })
}

fn try_stake_reward_callback(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
) -> Result<Response, ContractError> {
    authorize_execution(env.contract.address.clone(), info.sender)?;
    let config = CONFIG.load(deps.storage)?;

    // check if there are tokens to stake
    let tokens_to_stake = AssetInfoBase::native(ALLOWED_DENOM)
        .query_balance(&deps.querier, env.contract.address.clone())?;

    if tokens_to_stake.is_zero() {
        return Ok(Response::new().add_attributes(vec![
            ("action", "stake_reward_callback"),
            ("result", "nothing to stake"),
        ]));
    }

    // create stake / bond message
    let stake_msg = config
        .lst_hub_address
        .bond_msg(ALLOWED_DENOM, tokens_to_stake.u128(), None)?;

    // prepare update rewards callback, by querying the current total lsts in the contract.
    let previous_lst_balance = config
        .lst_asset_info
        .query_balance(&deps.querier, env.contract.address.clone())?;

    let update_rewards_msg = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: env.contract.address.to_string(),
        msg: to_json_binary(&ExecuteCollectionMsg::UpdateRewardsCallback(
            UpdateRewardsCallbackMsg {
                previous_lst_balance,
            },
        ))?,
        funds: vec![],
    });

    Ok(Response::new()
        .add_attributes(vec![("action", "stake_reward_callback")])
        .add_message(stake_msg)
        .add_message(update_rewards_msg))
}

fn try_update_reward_callback(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: UpdateRewardsCallbackMsg,
) -> Result<Response, ContractError> {
    authorize_execution(env.contract.address.clone(), info.sender)?;
    let config = CONFIG.load(deps.storage)?;

    let current_balance = config
        .lst_asset_info
        .query_balance(&deps.querier, env.contract.address.clone())?;
    let previous_balance = msg.previous_lst_balance;
    let mut rewards_collected = current_balance - previous_balance;

    // if there is an lst_treasury_share, then the specified amount will be sent to the dao treasury.
    let mut msgs = vec![];
    let mut attributes = vec![];
    if !config.dao_treasury_share.is_zero() {
        let treasury_amount = config.dao_treasury_share * rewards_collected;
        if !treasury_amount.is_zero() {
            rewards_collected = rewards_collected.checked_sub(treasury_amount)?;
            msgs.push(
                config
                    .lst_asset_info
                    .with_balance(treasury_amount)
                    .transfer_msg(config.dao_treasury_address)?,
            );
            attributes.push(attr("treasury_amount", treasury_amount));
        }
    }

    let num_of_active_nfts = NUM_ACTIVE_NFTS.load(deps.storage)?;
    let average_reward = rewards_collected / Uint128::from(num_of_active_nfts);
    REWARD_BALANCE.update(deps.storage, |balance| -> Result<_, ContractError> {
        Ok(balance + average_reward)
    })?;

    Ok(Response::new()
        .add_attributes(vec![
            attr("action", "update_rewards_callback"),
            attr("rewars_collected", rewards_collected),
        ])
        .add_attributes(attributes)
        .add_messages(msgs))
}

fn try_alliance_delegate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: AllianceDelegateMsg,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.as_ref().storage)?;
    authorize_execution(cfg.owner.clone(), info.sender)?;

    let mut cosmos_msg: Vec<CosmosMsg> = Vec::new();

    for del in msg.delegations.iter() {
        let msg = CosmosMsg::Stargate {
            type_url: "/alliance.alliance.MsgDelegate".to_string(),
            value: Binary::from(
                MsgDelegate {
                    delegator_address: env.contract.address.to_string(),
                    validator_address: del.validator.clone(),
                    amount: Some(Coin {
                        denom: cfg.asset_denom.clone(),
                        amount: del.amount.to_string(),
                    }),
                }
                .encode_to_vec(),
            ),
        };

        upsert_val(deps.storage, del.validator.clone(), del.amount)?;
        cosmos_msg.push(msg);
    }

    let msg = get_stake_reward_callback_msg(env);
    cosmos_msg.push(msg);

    Ok(Response::default()
        .add_attribute("method", "try_alliance_delegate")
        .add_messages(cosmos_msg))
}

fn try_alliance_undelegate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: AllianceUndelegateMsg,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    authorize_execution(cfg.owner.clone(), info.sender)?;

    if msg.undelegations.is_empty() {
        return Err(ContractError::EmptyDelegation {});
    }
    let mut cosmos_msg = vec![];
    for delegation in msg.undelegations {
        let undelegate_msg = MsgUndelegate {
            amount: Some(Coin {
                denom: cfg.asset_denom.clone(),
                amount: delegation.amount.to_string(),
            }),
            delegator_address: env.contract.address.to_string(),
            validator_address: delegation.validator.to_string(),
        };
        let msg = CosmosMsg::Stargate {
            type_url: "/alliance.alliance.MsgUndelegate".to_string(),
            value: Binary::from(undelegate_msg.encode_to_vec()),
        };
        cosmos_msg.push(msg);
        reduce_val_stake(deps.storage, delegation.validator, delegation.amount)?;
    }
    let msg = get_stake_reward_callback_msg(env);
    cosmos_msg.push(msg);
    Ok(Response::new()
        .add_attributes(vec![("action", "try_alliance_undelegate")])
        .add_messages(cosmos_msg))
}

fn try_alliance_redelegate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: AllianceRedelegateMsg,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    authorize_execution(cfg.owner.clone(), info.sender)?;

    if msg.redelegations.is_empty() {
        return Err(ContractError::EmptyDelegation {});
    }
    let mut cosmos_msg = vec![];
    for redelegation in msg.redelegations {
        let src_validator = redelegation.src_validator;
        let dst_validator = redelegation.dst_validator;
        let redelegate_msg = MsgRedelegate {
            amount: Some(Coin {
                denom: cfg.asset_denom.clone(),
                amount: redelegation.amount.to_string(),
            }),
            delegator_address: env.contract.address.to_string(),
            validator_src_address: src_validator.to_string(),
            validator_dst_address: dst_validator.to_string(),
        };
        let msg = CosmosMsg::Stargate {
            type_url: "/alliance.alliance.MsgRedelegate".to_string(),
            value: Binary::from(redelegate_msg.encode_to_vec()),
        };
        cosmos_msg.push(msg);
        upsert_val(deps.storage, dst_validator, redelegation.amount)?;
        reduce_val_stake(deps.storage, src_validator, redelegation.amount)?;
    }
    let msg = get_stake_reward_callback_msg(env);
    cosmos_msg.push(msg);
    Ok(Response::new()
        .add_attributes(vec![("action", "try_alliance_redelegate")])
        .add_messages(cosmos_msg))
}

fn try_breaknft(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    parent: AllianceNftCollection,
    token_id: String,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    let owner_res = parent.owner_of(deps.as_ref(), env.clone(), token_id.clone(), false)?;
    let owner = deps.api.addr_validate(&owner_res.owner)?;
    authorize_execution(owner.clone(), info.sender)?;

    BROKEN_NFTS.update(
        deps.storage,
        token_id.clone(),
        |b| -> Result<_, ContractError> {
            match b {
                Some(b) => {
                    if b {
                        Err(ContractError::AlreadyBroken {})
                    } else {
                        Ok(true)
                    }
                }
                None => Ok(true),
            }
        },
    )?;

    let rewards_claimed = NFT_BALANCE_CLAIMED.load(deps.storage, token_id.to_string())?;
    let average_rewards = REWARD_BALANCE.load(deps.storage)?;
    let rewards_claimable = average_rewards - rewards_claimed;

    NFT_BALANCE_CLAIMED.save(deps.storage, token_id.clone(), &average_rewards)?;
    NUM_ACTIVE_NFTS.update(deps.storage, |n| -> Result<_, ContractError> { Ok(n - 1) })?;
    if rewards_claimable.is_zero() {
        Ok(Response::default().add_attributes(vec![
            ("action", "break_nft"),
            ("token_id", token_id.as_str()),
            ("rewards", rewards_claimable.to_string().as_str()),
        ]))
    } else {
        // send user share to owner.
        let send_msg = cfg
            .lst_asset_info
            .clone()
            .with_balance(rewards_claimable)
            .transfer_msg(owner.to_string())?;

        // prepare the additional whitelisted reward assets based on the user share
        // user share = rewards_claimable / rewards_total
        let mut transfer_reward_asset_msgs = vec![];
        let rewards_total = cfg
            .lst_asset_info
            .query_balance(&deps.querier, env.contract.address.to_string())?;
        let user_share = Decimal::from_ratio(rewards_claimable, rewards_total);

        for whitelisted_reward_asset in cfg.whitelisted_reward_assets {
            let balance = whitelisted_reward_asset
                .query_balance(&deps.querier, env.contract.address.to_string())?;
            // always floored
            let user_balance = user_share * balance;
            if !user_balance.is_zero() {
                transfer_reward_asset_msgs.push(
                    whitelisted_reward_asset
                        .with_balance(user_balance)
                        .transfer_msg(owner.to_string())?,
                );
            }
        }

        Ok(Response::default()
            .add_message(send_msg)
            .add_messages(transfer_reward_asset_msgs)
            .add_attributes(vec![
                ("action", "break_nft"),
                ("token_id", token_id.as_str()),
                ("rewards", rewards_claimable.to_string().as_str()),
                ("user_share", user_share.to_string().as_str()),
            ]))
    }
}

fn try_mint(
    deps: DepsMut,
    info: MessageInfo,
    parent: AllianceNftCollection,
    mint_msg: MintMsg,
) -> Result<Response, ContractError> {
    // authorization is checked in the parent contract
    NUM_ACTIVE_NFTS.update(deps.storage, |n| -> Result<_, ContractError> { Ok(n + 1) })?;
    let reward_balance = REWARD_BALANCE.load(deps.storage)?;
    NFT_BALANCE_CLAIMED.save(deps.storage, mint_msg.token_id.clone(), &reward_balance)?;
    parent
        .mint(
            deps,
            info,
            mint_msg.token_id,
            mint_msg.owner,
            mint_msg.token_uri,
            mint_msg.extension,
        )
        .map_err(ContractError::FromContractError)
}

fn try_change_owner(
    deps: DepsMut,
    info: MessageInfo,
    new_owner: String,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    authorize_execution(cfg.owner.clone(), info.sender)?;
    let new_owner = deps.api.addr_validate(&new_owner)?;

    CONFIG.update(deps.storage, |mut config| -> Result<_, ContractError> {
        config.owner = new_owner.clone();
        Ok(config)
    })?;
    Ok(Response::default().add_attributes(vec![
        ("action", "change_owner"),
        ("new_owner", new_owner.to_string().as_str()),
    ]))
}

fn try_update_config(
    deps: DepsMut,
    info: MessageInfo,
    msg: UpdateConfigMsg,
) -> Result<Response, ContractError> {
    let mut cfg = CONFIG.load(deps.storage)?;
    authorize_execution(cfg.owner.clone(), info.sender)?;

    if let Some(dao_treasury_address) = msg.dao_treasury_address {
        cfg.dao_treasury_address = deps.api.addr_validate(&dao_treasury_address)?;
    }

    if let Some(dao_treasury_share) = msg.dao_treasury_share {
        cfg.dao_treasury_share = validate_dao_treasury_share(dao_treasury_share)?;
    }

    if let Some(set_whitelisted_reward_assets) = msg.set_whitelisted_reward_assets {
        let mut set_assets =
            validate_whitelisted_assets(&deps, &cfg.lst_asset_info, set_whitelisted_reward_assets)?;
        dedupe_assetinfos(&mut set_assets);
        cfg.whitelisted_reward_assets = set_assets;
    }

    if let Some(add_whitelisted_reward_assets) = msg.add_whitelisted_reward_assets {
        let mut add_assets =
            validate_whitelisted_assets(&deps, &cfg.lst_asset_info, add_whitelisted_reward_assets)?;
        let mut existing = cfg.whitelisted_reward_assets;
        existing.append(&mut add_assets);
        dedupe_assetinfos(&mut existing);
        cfg.whitelisted_reward_assets = existing;
    }

    CONFIG.save(deps.storage, &cfg)?;

    Ok(Response::default().add_attributes(vec![("action", "try_update_config")]))
}

fn authorize_execution(owner: Addr, sender: Addr) -> Result<Response, ContractError> {
    if sender != owner {
        return Err(ContractError::Unauthorized(sender, owner));
    }
    Ok(Response::default())
}
