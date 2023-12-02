/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.35.3.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

export type Addr = string;
export interface InstantiateMsg {
  minter: string;
  name: string;
  owner: Addr;
  symbol: string;
}
export type ExecuteMsg =
  | {
      alliance_delegate: AllianceDelegateMsg;
    }
  | {
      alliance_undelegate: AllianceUndelegateMsg;
    }
  | {
      alliance_redelegate: AllianceRedelegateMsg;
    }
  | {
      alliance_claim_rewards: object;
    }
  | {
      update_rewards_callback: object;
    }
  | {
      change_owner: string;
    }
  | {
      break_nft: string;
    }
  | {
      mint: MintMsg;
    }
  | {
      transfer_nft: {
        recipient: string;
        token_id: string;
      };
    }
  | {
      send_nft: {
        contract: string;
        msg: Binary;
        token_id: string;
      };
    }
  | {
      approve: {
        expires?: Expiration | null;
        spender: string;
        token_id: string;
      };
    }
  | {
      revoke: {
        spender: string;
        token_id: string;
      };
    }
  | {
      approve_all: {
        expires?: Expiration | null;
        operator: string;
      };
    }
  | {
      revoke_all: {
        operator: string;
      };
    };
export type Uint128 = string;
export type Binary = string;
export type Expiration =
  | {
      at_height: number;
    }
  | {
      at_time: Timestamp;
    }
  | {
      never: object;
    };
export type Timestamp = Uint64;
export type Uint64 = string;
export interface AllianceDelegateMsg {
  delegations: AllianceDelegation[];
}
export interface AllianceDelegation {
  amount: Uint128;
  validator: string;
}
export interface AllianceUndelegateMsg {
  undelegations: AllianceDelegation[];
}
export interface AllianceRedelegateMsg {
  redelegations: AllianceRedelegation[];
}
export interface AllianceRedelegation {
  amount: Uint128;
  dst_validator: string;
  src_validator: string;
}
export interface MintMsg {
  extension: Metadata;
  owner: string;
  token_id: string;
  token_uri?: string | null;
}
export interface Metadata {
  animation_url?: string | null;
  attributes?: Trait[] | null;
  background_color?: string | null;
  description?: string | null;
  external_url?: string | null;
  image?: string | null;
  image_data?: string | null;
  name?: string | null;
  youtube_url?: string | null;
}
export interface Trait {
  display_type?: string | null;
  trait_type: string;
  value: string;
}
export type QueryMsg =
  | {
      config: object;
    }
  | {
      nft_info: {
        token_id: string;
      };
    }
  | {
      all_nft_info: {
        include_expired?: boolean | null;
        token_id: string;
      };
    }
  | {
      owner_of: {
        include_expired?: boolean | null;
        token_id: string;
      };
    }
  | {
      approval: {
        include_expired?: boolean | null;
        spender: string;
        token_id: string;
      };
    }
  | {
      approvals: {
        include_expired?: boolean | null;
        token_id: string;
      };
    }
  | {
      all_operators: {
        include_expired?: boolean | null;
        limit?: number | null;
        owner: string;
        start_after?: string | null;
      };
    }
  | {
      num_tokens: object;
    }
  | {
      contract_info: object;
    }
  | {
      tokens: {
        limit?: number | null;
        owner: string;
        start_after?: string | null;
      };
    }
  | {
      all_tokens: {
        limit?: number | null;
        start_after?: string | null;
      };
    }
  | {
      minter: object;
    };
export interface AllNftInfoResponseForMetadata {
  access: OwnerOfResponse;
  info: NftInfoResponseForMetadata;
}
export interface OwnerOfResponse {
  approvals: Approval[];
  owner: string;
}
export interface Approval {
  expires: Expiration;
  spender: string;
}
export interface NftInfoResponseForMetadata {
  extension: Metadata;
  token_uri?: string | null;
}
export interface OperatorsResponse {
  operators: Approval[];
}
export interface TokensResponse {
  tokens: string[];
}
export interface ApprovalResponse {
  approval: Approval;
}
export interface ApprovalsResponse {
  approvals: Approval[];
}
export interface Config {
  asset_denom: string;
  owner: Addr;
}
export interface ContractInfoResponse {
  name: string;
  symbol: string;
}
export interface MinterResponse {
  minter: string;
}
export interface NumTokensResponse {
  count: number;
}
