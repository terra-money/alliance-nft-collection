use cosmwasm_std::testing::{BankQuerier, MOCK_CONTRACT_ADDR};
use cosmwasm_std::{
    coin, from_json, Coin, Empty, Querier, QuerierResult, QueryRequest, SystemError, SystemResult,
    WasmQuery,
};
use cw20::Cw20QueryMsg;
use std::collections::HashMap;

use super::cw20_querier::Cw20Querier;

#[derive(Default)]
pub(super) struct CustomQuerier {
    pub cw20_querier: Cw20Querier,
    pub bank_querier: BankQuerier,
}

impl Querier for CustomQuerier {
    fn raw_query(&self, bin_request: &[u8]) -> QuerierResult {
        let request: QueryRequest<_> = match from_json(bin_request) {
            Ok(v) => v,
            Err(e) => {
                return Err(SystemError::InvalidRequest {
                    error: format!("Parsing query request: {}", e),
                    request: bin_request.into(),
                })
                .into()
            }
        };
        self.handle_query(&request)
    }
}

impl CustomQuerier {
    #[allow(dead_code)]
    pub fn set_cw20_balance(&mut self, token: &str, user: &str, balance: u128) {
        match self.cw20_querier.balances.get_mut(token) {
            Some(contract_balances) => {
                contract_balances.insert(user.to_string(), balance);
            }
            None => {
                let mut contract_balances: HashMap<String, u128> = HashMap::default();
                contract_balances.insert(user.to_string(), balance);
                self.cw20_querier
                    .balances
                    .insert(token.to_string(), contract_balances);
            }
        };
    }

    #[allow(dead_code)]
    pub fn get_cw20_balance(&mut self, token: &str, user: &str) -> u128 {
        match self.cw20_querier.balances.get_mut(token) {
            Some(contract_balances) => contract_balances.get(user).copied().unwrap_or_default(),
            None => 0u128,
        }
    }

    #[allow(dead_code)]
    pub fn set_cw20_total_supply(&mut self, token: &str, total_supply: u128) {
        self.cw20_querier
            .total_supplies
            .insert(token.to_string(), total_supply);
    }

    #[allow(dead_code)]
    pub fn set_bank_balances(&mut self, balances: &[Coin]) {
        self.bank_querier = BankQuerier::new(&[(MOCK_CONTRACT_ADDR, balances)])
    }

    #[allow(dead_code)]
    pub(crate) fn set_bank_balance(&mut self, amount: u128) {
        self.set_bank_balances(&[coin(amount, "utoken")]);
    }

    pub fn handle_query(&self, request: &QueryRequest<Empty>) -> QuerierResult {
        match request {
            QueryRequest::Wasm(WasmQuery::Smart { contract_addr, msg }) => {
                if let Ok(query) = from_json::<Cw20QueryMsg>(msg) {
                    return self.cw20_querier.handle_query(contract_addr, query);
                }

                err_unsupported_query(msg)
            }

            QueryRequest::Bank(query) => self.bank_querier.query(query),

            _ => err_unsupported_query(request),
        }
    }
}

pub(super) fn err_unsupported_query<T: std::fmt::Debug>(request: T) -> QuerierResult {
    SystemResult::Err(SystemError::InvalidRequest {
        error: format!("[mock] unsupported query: {:?}", request),
        request: Default::default(),
    })
}
