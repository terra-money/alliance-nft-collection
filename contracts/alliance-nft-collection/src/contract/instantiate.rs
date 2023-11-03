use alliance_nft_packages::{
    errors::ContractError,
    instantiate::InstantiateCollectionMsg,
    state::Config,
    AllianceNftCollection,
};
use cosmwasm_std::{
    entry_point, Binary, CosmosMsg, DepsMut, Env, MessageInfo, Reply, Response, StdError, SubMsg,
    Uint128,
};
use cw2::set_contract_version;
use cw_utils::parse_instantiate_response_data;
use terra_proto_rs::{
    cosmos::{
        bank::v1beta1::{DenomUnit, Metadata},
        base::v1beta1::Coin,
    },
    osmosis::tokenfactory::v1beta1::{MsgCreateDenom, MsgMint, MsgSetDenomMetadata},
    traits::Message,
};

use crate::state::{CONFIG, REWARD_BALANCE, NUM_ACTIVE_NFTS};

use super::reply::INSTANTIATE_REPLY_ID;

pub const CONTRACT_NAME: &str = "crates.io:alliance-nft-collection";
pub const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
const SUBDENOM: &str = "AllianceDAO";
const TOKENS_SUPPLY: u64 = 1_000_000_000_000;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateCollectionMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)
        .map_err(ContractError::Std)?;

    CONFIG.save(
        deps.storage,
        &Config {
            owner: msg.owner.clone(),
            asset_denom: format!("factory/{}/{}", env.contract.address, SUBDENOM),
        },
    )?;

    REWARD_BALANCE.save(deps.storage, &Uint128::zero())?;
    NUM_ACTIVE_NFTS.save(deps.storage, &0)?;

    let create_denom_req: CosmosMsg = CosmosMsg::Stargate {
        type_url: "/osmosis.tokenfactory.v1beta1.MsgCreateDenom".to_string(),
        value: Binary::from(
            MsgCreateDenom {
                sender: env.contract.address.to_string(),
                subdenom: SUBDENOM.to_string(),
            }
            .encode_to_vec(),
        ),
    };

    let parent = AllianceNftCollection::default();
    let res = parent.instantiate(deps, env, info, msg.into())?;

    Ok(res.add_submessage(SubMsg::reply_on_success(
        create_denom_req,
        INSTANTIATE_REPLY_ID,
    )))
}

pub fn reply_on_instantiate(
    _deps: DepsMut,
    env: Env,
    reply: Reply,
) -> Result<Response, ContractError> {
    let denom = parse_instantiate_response_data(reply.result.unwrap().data.unwrap().as_slice())
        .map_err(|_| ContractError::Std(StdError::generic_err("reply parse error".to_string())))?
        .contract_address;

    let mint_req = MsgMint {
        sender: env.contract.address.to_string(),
        mint_to_address: env.contract.address.to_string(),
        amount: Some(Coin {
            denom: denom.to_string(),
            amount: TOKENS_SUPPLY.to_string(),
        }),
    };
    let mint_sub_msg = CosmosMsg::Stargate {
        type_url: "/osmosis.tokenfactory.v1beta1.MsgMint".to_string(),
        value: Binary(mint_req.encode_to_vec()),
    };

    // This will set metadata for the denom in the Bank Module
    let set_metadata_req = MsgSetDenomMetadata {
        sender: env.contract.address.to_string(),
        metadata: Some(Metadata {
            description:
                "Staking token for AllianceDAO used by the NFT collection to generate rewards"
                    .to_string(),
            denom_units: vec![DenomUnit {
                denom: denom.to_string(),
                exponent: 0,
                aliases: vec![],
            }],
            base: denom.to_string(),
            display: denom,
            name: "Alliance Token".to_string(),
            symbol: SUBDENOM.to_string(),
            uri: "".to_string(),
            uri_hash: "".to_string(),
        }),
    };

    let sub_msg_set_metadata = CosmosMsg::Stargate {
        type_url: "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata".to_string(),
        value: Binary(set_metadata_req.encode_to_vec()),
    };

    Ok(Response::new()
        .add_submessage(SubMsg::new(sub_msg_set_metadata))
        .add_submessage(SubMsg::new(mint_sub_msg)))
}
