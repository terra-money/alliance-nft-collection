use crate::state::Trait;
use crate::tests::helpers::{break_nft, claim_alliance_emissions, mint, query_nft, setup_contract};
use crate::types::Extension;
use cosmwasm_std::testing::{mock_dependencies, mock_dependencies_with_balance, mock_env, mock_info};
use cosmwasm_std::{BankMsg, Coin, CosmosMsg, Response, Uint128};
use cw721::NftInfoResponse;
use crate::contract::execute::execute;
use crate::types::execute::{ExecuteMsg, MintMsg};

#[test]
fn mint_and_query_nft() {
    let mut deps = mock_dependencies();
    setup_contract(deps.as_mut());

    let res = mint(deps.as_mut(), "1");

    assert_eq!(
        res,
        Response::default().add_attributes(vec![
            ("action", "mint"),
            ("minter", "minter"),
            ("owner", "owner"),
            ("token_id", "1"),
        ])
    );

    let nft = query_nft(deps.as_ref(), "1");
    assert_eq!(
        nft,
        NftInfoResponse {
            token_uri: None,
            extension: Extension {
                image: Some("image".to_string()),
                image_data: None,
                external_url: None,
                description: None,
                name: None,
                attributes: Some(vec![
                    Trait {
                        display_type: None,
                        trait_type: "trait_type".to_string(),
                        value: "value".to_string()
                    },
                    Trait {
                        display_type: None,
                        trait_type: "broken".to_string(),
                        value: "false".to_string()
                    },
                    Trait {
                        display_type: None,
                        trait_type: "rewards".to_string(),
                        value: "0".to_string()
                    },
                ]),
                background_color: None,
                animation_url: None,
                youtube_url: None
            }
        }
    );
}

#[test]
fn mint_invalid() {
    let mut deps = mock_dependencies();
    setup_contract(deps.as_mut());
    mint(deps.as_mut(), "1");

    // Mint with the same token id
    execute(deps.as_mut(), mock_env(), mock_info("minter", &[]), ExecuteMsg::Mint(MintMsg {
        owner: "owner".to_string(),
        token_id: "1".to_string(),
        token_uri: None,
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
    })).unwrap_err();

    // Mint with the wrong minter
    execute(deps.as_mut(), mock_env(), mock_info("wrong_minter", &[]), ExecuteMsg::Mint(MintMsg {
        owner: "owner".to_string(),
        token_id: "2".to_string(),
        token_uri: None,
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
    })).unwrap_err();
}

#[test]
fn break_nft_without_rewards() {
    let mut deps = mock_dependencies();
    setup_contract(deps.as_mut());

    mint(deps.as_mut(), "1");

    let res = break_nft(deps.as_mut(), "1");
    assert_eq!(
        res,
        Response::default().add_attributes(vec![
            ("action", "break_nft"),
            ("token_id", "1"),
            ("rewards", "0"),
        ])
    );

    let nft = query_nft(deps.as_ref(), "1");
    assert_eq!(
        nft,
        NftInfoResponse {
            token_uri: None,
            extension: Extension {
                image: Some("image".to_string()),
                image_data: None,
                external_url: None,
                description: None,
                name: None,
                attributes: Some(vec![
                    Trait {
                        display_type: None,
                        trait_type: "trait_type".to_string(),
                        value: "value".to_string()
                    },
                    Trait {
                        display_type: None,
                        trait_type: "broken".to_string(),
                        value: "true".to_string()
                    },
                    Trait {
                        display_type: None,
                        trait_type: "rewards".to_string(),
                        value: "0".to_string()
                    },
                ]),
                background_color: None,
                animation_url: None,
                youtube_url: None
            }
        }
    );
}

#[test]
fn break_nft_with_rewards() {
    let mut deps = mock_dependencies_with_balance(&[Coin::new(1_000_000_000, "uluna")]);
    setup_contract(deps.as_mut());
    mint(deps.as_mut(), "1");
    mint(deps.as_mut(), "2");
    claim_alliance_emissions(deps.as_mut(), Uint128::new(500_000_000));

    let nft = query_nft(deps.as_ref(), "1");
    assert_eq!(
        nft,
        NftInfoResponse {
            token_uri: None,
            extension: Extension {
                image: Some("image".to_string()),
                image_data: None,
                external_url: None,
                description: None,
                name: None,
                attributes: Some(vec![
                    Trait {
                        display_type: None,
                        trait_type: "trait_type".to_string(),
                        value: "value".to_string()
                    },
                    Trait {
                        display_type: None,
                        trait_type: "broken".to_string(),
                        value: "false".to_string()
                    },
                    Trait {
                        display_type: None,
                        trait_type: "rewards".to_string(),
                        value: "250000000".to_string()
                    },
                ]),
                background_color: None,
                animation_url: None,
                youtube_url: None
            }
        }
    );

    let res = break_nft(deps.as_mut(), "1");
    assert_eq!(
        res,
        Response::default()
            .add_message(CosmosMsg::Bank(BankMsg::Send {
                amount: vec![Coin::new(250_000_000, "uluna")],
                to_address: "owner".to_string(),
            }))
            .add_attributes(vec![
                ("action", "break_nft"),
                ("token_id", "1"),
                ("rewards", "250000000"),
            ])
    );

    let nft = query_nft(deps.as_ref(), "1");
    assert_eq!(
        nft,
        NftInfoResponse {
            token_uri: None,
            extension: Extension {
                image: Some("image".to_string()),
                image_data: None,
                external_url: None,
                description: None,
                name: None,
                attributes: Some(vec![
                    Trait {
                        display_type: None,
                        trait_type: "trait_type".to_string(),
                        value: "value".to_string()
                    },
                    Trait {
                        display_type: None,
                        trait_type: "broken".to_string(),
                        value: "true".to_string()
                    },
                    Trait {
                        display_type: None,
                        trait_type: "rewards".to_string(),
                        value: "0".to_string()
                    },
                ]),
                background_color: None,
                animation_url: None,
                youtube_url: None
            }
        }
    );

    // Claim more rewards from alliance module. All rewards should go to remaining NFTs
    claim_alliance_emissions(deps.as_mut(), Uint128::new(500_000_000));
    let nft = query_nft(deps.as_ref(), "1");
    assert_eq!(
        nft,
        NftInfoResponse {
            token_uri: None,
            extension: Extension {
                image: Some("image".to_string()),
                image_data: None,
                external_url: None,
                description: None,
                name: None,
                attributes: Some(vec![
                    Trait {
                        display_type: None,
                        trait_type: "trait_type".to_string(),
                        value: "value".to_string()
                    },
                    Trait {
                        display_type: None,
                        trait_type: "broken".to_string(),
                        value: "true".to_string()
                    },
                    Trait {
                        display_type: None,
                        trait_type: "rewards".to_string(),
                        value: "0".to_string()
                    },
                ]),
                background_color: None,
                animation_url: None,
                youtube_url: None
            }
        }
    );

    let nft = query_nft(deps.as_ref(), "2");
    assert_eq!(
        nft,
        NftInfoResponse {
            token_uri: None,
            extension: Extension {
                image: Some("image".to_string()),
                image_data: None,
                external_url: None,
                description: None,
                name: None,
                attributes: Some(vec![
                    Trait {
                        display_type: None,
                        trait_type: "trait_type".to_string(),
                        value: "value".to_string()
                    },
                    Trait {
                        display_type: None,
                        trait_type: "broken".to_string(),
                        value: "false".to_string()
                    },
                    Trait {
                        display_type: None,
                        trait_type: "rewards".to_string(),
                        value: "750000000".to_string()
                    },
                ]),
                background_color: None,
                animation_url: None,
                youtube_url: None
            }
        }
    );
}

#[test]
fn break_nft_invalid() {
    let mut deps = mock_dependencies_with_balance(&[Coin::new(1_000_000_000, "uluna")]);
    setup_contract(deps.as_mut());
    mint(deps.as_mut(), "1");

    // Cannot break as a different owner
    execute(deps.as_mut(), mock_env(), mock_info("owner2", &[]), ExecuteMsg::BreakNft("1".to_string())).unwrap_err();
    break_nft(deps.as_mut(), "1");

    // Cannot break a broken NFT
    execute(deps.as_mut(), mock_env(), mock_info("owner", &[]), ExecuteMsg::BreakNft("1".to_string())).unwrap_err();
}