use std::collections::HashMap;

use crate::contract::execute::execute;
use alliance_nft_packages::{
    errors::ContractError,
    execute::ExecuteMinterMsg,
    state::{MinterExtension, Trait},
    Extension,
};
use cosmwasm_std::Response;
use cosmwasm_std::{
    testing::{mock_env, mock_info},
    DepsMut,
};

pub fn append_nft_metadata_execution(
    deps: DepsMut,
    sender_address: &str,
    appended_address: String,
) -> Result<Response, ContractError> {
    let info = mock_info(sender_address, &[]);
    let env = mock_env();
    let mut msg: HashMap<String, MinterExtension> = HashMap::new();
    msg.insert(
        appended_address,
        MinterExtension {
            token_id: String::from("1"),
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
        },
    );

    execute(
        deps,
        env.clone(),
        info,
        ExecuteMinterMsg::AppendNftMetadata(msg),
    )
}
