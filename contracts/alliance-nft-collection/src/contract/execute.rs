use alliance_nft_packages::state::ALLOWED_DENOM;
use cosmwasm_std::{
    coins, entry_point, to_binary, Addr, BankMsg, Binary, Coin as CwCoin, CosmosMsg, Order, SubMsg,
    Uint128, WasmMsg, Storage, QuerierWrapper,
};
use cosmwasm_std::{DepsMut, Env, MessageInfo, Response};
use cw721::Cw721Query;
use terra_proto_rs::alliance::alliance::{MsgClaimDelegationRewards, MsgRedelegate, MsgUndelegate};
use terra_proto_rs::{
    alliance::alliance::MsgDelegate, cosmos::base::v1beta1::Coin, traits::Message,
};

use crate::state::{
    reduce_val_stake, upsert_val, BROKEN_NFTS, CONFIG, NFT_BALANCE_CLAIMED, NUM_ACTIVE_NFTS,
    REWARD_BALANCE, TEMP_BALANCE, VALS,
};
use alliance_nft_packages::{
    errors::ContractError,
    execute::{
        AllianceDelegateMsg, AllianceRedelegateMsg, AllianceUndelegateMsg, ExecuteCollectionMsg, MintMsg,
    },
    AllianceNftCollection,
};

use super::query::try_query_contract_balance;

const CLAIM_REWARD_ERROR_REPLY_ID: u64 = 1;

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
        ExecuteCollectionMsg::AllianceUndelegate(msg) => try_alliance_undelegate(deps, env, info, msg),
        ExecuteCollectionMsg::AllianceRedelegate(msg) => try_alliance_redelegate(deps, env, info, msg),

        ExecuteCollectionMsg::AllianceClaimRewards {} => try_alliance_claim_rewards(deps, env, info),
        ExecuteCollectionMsg::UpdateRewardsCallback {} => update_reward_callback(deps, env, info),

        ExecuteCollectionMsg::BreakNft(token_id) => try_breaknft(deps, env, info, parent, token_id),
        ExecuteCollectionMsg::Mint(mint_msg) => try_mint(deps, info, parent, mint_msg),
        ExecuteCollectionMsg::ChangeOwner(new_owner) => try_change_owner(deps, info, new_owner),

        _ => Ok(parent.execute(deps, env, info, msg.into())?),
    }
}

fn try_alliance_claim_rewards(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.storage)?;
    let num_of_active = NUM_ACTIVE_NFTS.load(deps.storage)?;
    if num_of_active == 0 {
        return Err(ContractError::NoActiveNfts {});
    }
    store_temp_contract_funds(&info.funds, deps.querier, deps.storage, &env.contract.address)?;

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
    let msg = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: env.contract.address.to_string(),
        msg: to_binary(&ExecuteCollectionMsg::UpdateRewardsCallback {}).unwrap(),
        funds: vec![],
    });

    Ok(Response::new()
        .add_attributes(vec![("action", "update_rewards")])
        .add_submessages(sub_msgs)
        .add_message(msg))
}

fn update_reward_callback(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
) -> Result<Response, ContractError> {
    authorize_execution(env.contract.address.clone(), info.sender)?;

    let current_balance = deps
        .querier
        .query_balance(env.contract.address, ALLOWED_DENOM)?
        .amount;
    let previous_balance = TEMP_BALANCE.load(deps.storage)?;
    let rewards_collected = current_balance - previous_balance;
    let num_of_active_nfts = NUM_ACTIVE_NFTS.load(deps.storage)?;
    let average_reward = rewards_collected / Uint128::from(num_of_active_nfts);
    REWARD_BALANCE.update(deps.storage, |balance| -> Result<_, ContractError> {
        Ok(balance + average_reward)
    })?;

    TEMP_BALANCE.remove(deps.storage);
    Ok(Response::new()
        .add_attributes(vec![("action", "update_rewards_callback")]
    ))
}

fn try_alliance_delegate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: AllianceDelegateMsg,
) -> Result<Response, ContractError> {
    let cfg = CONFIG.load(deps.as_ref().storage)?;
    authorize_execution(cfg.owner.clone(), info.sender)?;
    store_temp_contract_funds(&info.funds, deps.querier, deps.storage, &env.contract.address)?;
    
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

    let msg = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: env.contract.address.to_string(),
        msg: to_binary(&ExecuteCollectionMsg::UpdateRewardsCallback {}).unwrap(),
        funds: vec![],
    });
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
    store_temp_contract_funds(&info.funds, deps.querier, deps.storage, &env.contract.address)?;

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
    let msg = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: env.contract.address.to_string(),
        msg: to_binary(&ExecuteCollectionMsg::UpdateRewardsCallback {}).unwrap(),
        funds: vec![],
    });
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
    store_temp_contract_funds(&info.funds, deps.querier, deps.storage, &env.contract.address)?;

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
    let msg = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: env.contract.address.to_string(),
        msg: to_binary(&ExecuteCollectionMsg::UpdateRewardsCallback {}).unwrap(),
        funds: vec![],
    });
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
    let owner_res = parent.owner_of(deps.as_ref(), env, token_id.clone(), false)?;
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
        let send_msg = CosmosMsg::Bank(BankMsg::Send {
            amount: coins(rewards_claimable.u128(), ALLOWED_DENOM),
            to_address: owner.to_string(),
        });
        Ok(Response::default()
            .add_message(send_msg)
            .add_attributes(vec![
                ("action", "break_nft"),
                ("token_id", token_id.as_str()),
                ("rewards", rewards_claimable.to_string().as_str()),
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

fn authorize_execution(owner: Addr, sender: Addr) -> Result<Response, ContractError> {
    if sender != owner {
        return Err(ContractError::Unauthorized(sender, owner));
    }
    Ok(Response::default())
}

// Given the sent fund and the current contract balance, 
// store the difference in TEMP_BALANCE so we can keep,
// track of the rewards collected in the current tx.
fn store_temp_contract_funds(
    funds: &Vec<CwCoin>, 
    querier:QuerierWrapper, 
    storage: &mut dyn Storage, 
    contract_addr: &Addr
) -> Result<(), ContractError> {
    let reward_sent_in_tx: Option<&CwCoin> = funds.iter().find(|c| c.denom == ALLOWED_DENOM);
    let sent_balance = if let Some(coin) = reward_sent_in_tx {
        coin.amount
    } else {
        Uint128::zero()
    };
    let contract_balance = try_query_contract_balance(querier, contract_addr)?;
    TEMP_BALANCE.save(storage, &(contract_balance - sent_balance))?;
    Ok(())
}