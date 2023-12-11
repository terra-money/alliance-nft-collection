use crate::contract::{execute::execute, query::query};
use crate::tests::helpers::append_nft_metadata_execution;
use alliance_nft_packages::execute::{ExecuteCollectionMsg, ExecuteMinterMsg, MintMsg};
use alliance_nft_packages::query::QueryMinterMsg;
use alliance_nft_packages::state::{MinterStats, Trait};
use alliance_nft_packages::Extension;
use cosmwasm_std::testing::mock_info;
use cosmwasm_std::{to_binary, Response, WasmMsg};

use super::instantiate::intantiate_with_reply;

#[test]
fn append_nft_metadata() {
    // Create the env with the contract
    let (mut deps, env, _) = intantiate_with_reply();

    // Execute the message
    let res = append_nft_metadata_execution(
        deps.as_mut(),
        "creator", 
        "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je".to_string(),
    );

    // assert the message response
    assert_eq!(
        res.unwrap(),
        Response::new().add_attributes([
            ("method", "try_append_nft_metadata"),
            ("new_minted_nfts", "1")
        ])
    );

    // query to see if stats match
    let query_res = query(deps.as_ref(), env, QueryMinterMsg::Stats {}).unwrap();
    assert_eq!(
        query_res,
        to_binary(&MinterStats {
            available_nfts: 1,
            minted_nfts: 0,
        })
        .unwrap()
    );
}

#[test]
fn append_nft_metadata_unauthorized() {
    // Create the env with the contract
    let (mut deps, env, _) = intantiate_with_reply();

    // Execute the message
    let res = append_nft_metadata_execution(
        deps.as_mut(),
        "random_address",
        "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je".to_string(),
    );

    // assert the message error
    assert_eq!(
        res.unwrap_err().to_string(),
        String::from(
            "Unauthorized execution, sender (random_address) is not the expected address (creator)"
        )
    );

    // query to see if stats match
    let query_res = query(deps.as_ref(), env, QueryMinterMsg::Stats {}).unwrap();
    assert_eq!(
        query_res,
        to_binary(&MinterStats {
            available_nfts: 0,
            minted_nfts: 0,
        })
        .unwrap()
    );
}

#[test]
fn append_nft_metadata_duplicated_error() {
    // Create the env with the contract
    let (mut deps, env, _) = intantiate_with_reply();

    // Execute the message
    let res = append_nft_metadata_execution(
        deps.as_mut(),
        "creator",
        "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je".to_string(),
    );

    // assert the message response
    assert_eq!(
        res.unwrap(),
        Response::new().add_attributes([
            ("method", "try_append_nft_metadata"),
            ("new_minted_nfts", "1")
        ])
    );

    // Execute the message
    let res = append_nft_metadata_execution(
        deps.as_mut(),
        "creator",
        "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je".to_string(),
    );

    // assert the message error
    assert_eq!(
        res.unwrap_err().to_string(),
        String::from(
            "Address terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je already exists in minters list"
        )
    );
    // query to see if stats match
    let query_res = query(deps.as_ref(), env, QueryMinterMsg::Stats {}).unwrap();
    assert_eq!(
        query_res,
        to_binary(&MinterStats {
            available_nfts: 1,
            minted_nfts: 0,
        })
        .unwrap()
    );
}

#[test]
fn mint_nft() {
    // Create the env with the contract
    let (mut deps, env, _) = intantiate_with_reply();

    // Execute the message
    let res = append_nft_metadata_execution(
        deps.as_mut(),
        "creator", // read this with epic voice
        "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je".to_string(),
    );

    // assert the message response
    assert_eq!(
        res.unwrap(),
        Response::new().add_attributes([
            ("method", "try_append_nft_metadata"),
            ("new_minted_nfts", "1")
        ])
    );

    // mint an nft
    let res = execute(
        deps.as_mut(),
        env.clone(),
        mock_info("terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je", &[]),
        ExecuteMinterMsg::Mint {},
    );

    // assert message response
    let mint_msg = WasmMsg::Execute {
        contract_addr: "nft_collection_address".to_string(),
        msg: to_binary(&ExecuteCollectionMsg::Mint(MintMsg {
            token_id: "1".to_string(),
            owner: "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je".to_string(),
            extension: Extension {
                image: Some("image".to_string()),
                image_data: None,
                external_url: None,
                description: None,
                name: None,
                attributes: Some(vec![Trait {
                    display_type: None,
                    trait_type: "trait_type".to_string(),
                    value: "value".to_string(),
                }]),
                background_color: None,
                animation_url: None,
                youtube_url: None,
            },
            token_uri: None,
        }))
        .unwrap(),
        funds: vec![],
    };
    assert_eq!(
        res.unwrap(),
        Response::default()
            .add_attribute("method", "try_mint")
            .add_message(mint_msg)
    );

    // query to see if stats match
    let query_res = query(deps.as_ref(), env, QueryMinterMsg::Stats {}).unwrap();
    assert_eq!(
        query_res,
        to_binary(&MinterStats {
            available_nfts: 0,
            minted_nfts: 1,
        })
        .unwrap()
    );
}

#[test]
fn mint_inexistent_nft() {
    // Create the env with the contract
    let (mut deps, env, _) = intantiate_with_reply();
    // mint an nft
    let res = execute(
        deps.as_mut(),
        env.clone(),
        mock_info("terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je", &[]),
        ExecuteMinterMsg::Mint {},
    );
    assert_eq!(
        res.unwrap_err().to_string(),
        String::from("alliance_nft_packages::state::MinterExtension not found")
    );

    // query to see if stats match
    let query_res = query(deps.as_ref(), env, QueryMinterMsg::Stats {}).unwrap();
    assert_eq!(
        query_res,
        to_binary(&MinterStats {
            available_nfts: 0,
            minted_nfts: 0,
        })
        .unwrap()
    );
}

#[test]
fn minting_outside_allowed_period() {
    // Create the env with the contract
    let (mut deps, mut env, _) = intantiate_with_reply();
    // increment the time with 2 secs
    env.block.time = env.block.time.plus_seconds(2);
    // mint an nft
    let res = execute(
        deps.as_mut(),
        env.clone(),
        mock_info("terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je", &[]),
        ExecuteMinterMsg::Mint {},
    );
    assert_eq!(
        res.unwrap_err().to_string(),
        String::from("Minting period starts at 1.000000000 and ends at 3.000000000. Current time is 4.000000000")
    );
    // decrement the time with 4 secs
    env.block.time = env.block.time.minus_seconds(4);
    // mint an nft
    let res = execute(
        deps.as_mut(),
        env.clone(),
        mock_info("terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je", &[]),
        ExecuteMinterMsg::Mint {},
    );
    assert_eq!(
        res.unwrap_err().to_string(),
        String::from("Minting period starts at 1.000000000 and ends at 3.000000000. Current time is 0.000000000")
    );

    // query to see if stats match
    let query_res = query(deps.as_ref(), env, QueryMinterMsg::Stats {}).unwrap();
    assert_eq!(
        query_res,
        to_binary(&MinterStats {
            available_nfts: 0,
            minted_nfts: 0,
        })
        .unwrap()
    );
}

#[test]
fn send_to_dao_treasury() {
    // Create the env with the contract
    let (mut deps, mut env, _) = intantiate_with_reply();
    // add 4 seconds to end time
    env.block.time = env.block.time.plus_seconds(4);

    // Execute the message
    let res = append_nft_metadata_execution(
        deps.as_mut(),
        "creator", // read this with epic voice
        "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je".to_string(),
    );

    // assert the message response
    assert_eq!(
        res.unwrap(),
        Response::new().add_attributes([
            ("method", "try_append_nft_metadata"),
            ("new_minted_nfts", "1")
        ])
    );

    // mint an nft
    let res = execute(
        deps.as_mut(),
        env.clone(),
        mock_info("terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je", &[]),
        ExecuteMinterMsg::SendToDao(2),
    );

    // assert message response
    let mint_msg = WasmMsg::Execute {
        contract_addr: "nft_collection_address".to_string(),
        msg: to_binary(&ExecuteCollectionMsg::Mint(MintMsg {
            token_id: "1".to_string(),
            owner: "dao_treasury_address".to_string(),
            extension: Extension {
                image: Some("image".to_string()),
                image_data: None,
                external_url: None,
                description: None,
                name: None,
                attributes: Some(vec![Trait {
                    display_type: None,
                    trait_type: "trait_type".to_string(),
                    value: "value".to_string(),
                }]),
                background_color: None,
                animation_url: None,
                youtube_url: None,
            },
            token_uri: None,
        }))
        .unwrap(),
        funds: vec![],
    };
    assert_eq!(
        res.unwrap(),
        Response::default()
            .add_attributes([("method", "try_send_to_dao_treasury"), ("nfts_send", "1")])
            .add_messages([mint_msg])
    );

    // query to see if stats match
    let query_res = query(deps.as_ref(), env, QueryMinterMsg::Stats {}).unwrap();
    assert_eq!(
        query_res,
        to_binary(&MinterStats {
            available_nfts: 0,
            minted_nfts: 1,
        })
        .unwrap()
    );
}

#[test]
fn send_to_dao_before_end_time() {
    // Create the env with the contract
    let (mut deps, env, _) = intantiate_with_reply();

    // Execute the message
    let res = append_nft_metadata_execution(
        deps.as_mut(),
        "creator", // read this with epic voice
        "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je".to_string(),
    );

    // assert the message response
    assert_eq!(
        res.unwrap(),
        Response::new().add_attributes([
            ("method", "try_append_nft_metadata"),
            ("new_minted_nfts", "1")
        ])
    );

    // mint an nft
    let res = execute(
        deps.as_mut(),
        env.clone(),
        mock_info("terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je", &[]),
        ExecuteMinterMsg::SendToDao(2),
    );

    assert_eq!(
        res.unwrap_err().to_string(),
        String::from("NFTs cannot be send to DAO yet, current time is 2.000000000 and mint end time is 3.000000000")
    );

    // query to see if stats match
    let query_res = query(deps.as_ref(), env, QueryMinterMsg::Stats {}).unwrap();
    assert_eq!(
        query_res,
        to_binary(&MinterStats {
            available_nfts: 1,
            minted_nfts: 0,
        })
        .unwrap()
    );
}

#[test]
fn test_try_change_dao_treasury_address_with_random_acc() {
    // Create the env with the contract
    let (mut deps, env, _) = intantiate_with_reply();

    // Execute the message
    let res = execute(
        deps.as_mut(),
        env.clone(),
        mock_info("das_ist_keine_owner", &[]),
        ExecuteMinterMsg::ChangeDaoTreasuryAddress(
            "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je".to_string(),
        ),
    );

    // assert the message response
    assert_eq!(
        res.unwrap_err().to_string(),
        String::from("Unauthorized execution, sender (das_ist_keine_owner) is not the expected address (creator)")
    );
}

#[test]
fn test_try_change_dao_treasury_address_with_creator() {
    // Create the env with the contract
    let (mut deps, env, _) = intantiate_with_reply();

    // Execute the message
    let res = execute(
        deps.as_mut(),
        env.clone(),
        mock_info("creator", &[]),
        ExecuteMinterMsg::ChangeDaoTreasuryAddress(
            "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je".to_string(),
        ),
    );

    // assert the message response
    assert_eq!(
        res.unwrap(),
        Response::default()
            .add_attribute("method", "try_change_dao_treasury_address")
            .add_attribute(
                "new_dao_treasury_address",
                "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je"
            ),
    );
}

#[test]
fn test_try_change_owener() {
    // Create the env with the contract
    let (mut deps, env, _) = intantiate_with_reply();

    // Execute the message
    let res = execute(
        deps.as_mut(),
        env.clone(),
        mock_info("creator", &[]),
        ExecuteMinterMsg::ChangeOwner("terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je".to_string()),
    );

    // assert the message response
    assert_eq!(
        res.unwrap(),
        Response::default()
            .add_attributes(vec![
                ("action", "change_owner"),
                ("new_owner", "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je"),
            ])
            .add_message(WasmMsg::Execute {
                contract_addr: "nft_collection_address".to_string(),
                msg: to_binary(&ExecuteCollectionMsg::ChangeOwner(
                    "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je".to_string()
                ))
                .unwrap(),
                funds: vec![],
            })
    );
}

#[test]
fn remove_nft_from_mint() {
    // Create the env with the contract
    let (mut deps, env, _) = intantiate_with_reply();

    // Execute the message
    let _ = append_nft_metadata_execution(
        deps.as_mut(),
        "creator",
        "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je".to_string(),
    );


    // mint an nft
    let res = execute(
        deps.as_mut(),
        env.clone(),
        mock_info("creator", &[]),
        ExecuteMinterMsg::RemoveToken(String::from("terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je")),
    );

    assert_eq!(
        res.unwrap(),
        Response::default()
            .add_attribute("method", "try_remove_token")
            .add_attribute("removed_token", "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je")
    );

    // query to see if stats match
    let query_res = query(deps.as_ref(), env, QueryMinterMsg::Stats {}).unwrap();
    assert_eq!(
        query_res,
        to_binary(&MinterStats {
            available_nfts: 0,
            minted_nfts: 0,
        })
        .unwrap()
    );
}


#[test]
fn remove_nft_from_mint_wrong_sender() {
    // Create the env with the contract
    let (mut deps, env, _) = intantiate_with_reply();

    // Execute the message
    let _ = append_nft_metadata_execution(
        deps.as_mut(),
        "creator",
        "terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je".to_string(),
    );


    // mint an nft
    let res = execute(
        deps.as_mut(),
        env.clone(),
        mock_info("creatorw", &[]),
        ExecuteMinterMsg::RemoveToken(String::from("terra1zdpgj8am5nqqvht927k3etljyl6a52kwqup0je")),
    );

    assert_eq!(
        res.unwrap_err().to_string(),
        String::from("Unauthorized execution, sender (creatorw) is not the expected address (creator)")
    );
}