import { useCallback } from "react"
import { PostResponse, useLcdClient, useWallet } from "@terra-money/wallet-kit"
import { MsgExecuteContract } from "@terra-money/feather.js"
import { MinterExtension } from "types/AllianceNftMinter"
import {
  AllNftInfoResponseForMetadata,
  TokensResponse,
} from "types/AllianceNftCollection"
import { contracts } from "config"
import { useAppContext } from "contexts"

/**
 * useAllianceContracts Interface
 */
interface IUseContracts {
  getNFTDataFromMinter: () => Promise<MinterExtension | undefined>
  queryNFTFromCollection: (
    token_id: string
  ) => Promise<AllNftInfoResponseForMetadata | undefined>
  queryAllNFTIDsFromCollection: () => Promise<TokensResponse | undefined>
  isNFTBroken: (token: AllNftInfoResponseForMetadata) => boolean
  mintNFT: () => Promise<PostResponse | undefined>
  breakNFT: (token_id: string) => Promise<PostResponse | undefined>
}

/**
 * useContract hook
 * @param address - wallet address of connected wallet
 * @returns {IUseContracts}
 */
const useAllianceContracts: (address?: string) => IUseContracts = (
  address?: string
) => {
  const lcd = useLcdClient()
  const { chainId } = useAppContext()
  const wallet = useWallet()

  /**
   * Get NFT data from minter contract
   * If user is not connected, return undefined
   * If user has already minted or doesn't have one, this returns an error.
   * @returns {MinterExtension | undefined}
   */
  const getNFTDataFromMinter = useCallback(async (): Promise<
    MinterExtension | undefined
  > => {
    if (!address) return undefined

    try {
      const result = await lcd.wasm.contractQuery<MinterExtension>(
        contracts[chainId].minter,
        {
          nft_data: address,
        }
      )

      return result
    } catch (error) {
      return undefined
    }
  }, [address, chainId, lcd.wasm])

  /**
   * query NFT data from collection contract.
   * use all nft info query
   *
   * @param token_id id of token to query
   * @returns NFT Response from collection contract
   */
  const queryNFTFromCollection = useCallback(
    async (
      token_id: string
    ): Promise<AllNftInfoResponseForMetadata | undefined> => {
      try {
        const result =
          await lcd.wasm.contractQuery<AllNftInfoResponseForMetadata>(
            contracts[chainId].collection,
            {
              all_nft_info: {
                token_id: token_id.toString(),
              },
            }
          )

        return result
      } catch (error) {
        return undefined
      }
    },
    [chainId, lcd.wasm]
  )

  /**
   * Query all tokens that have been minted.
   *
   * @returns {TokensResponse | undefined}
   */
  const queryAllNFTIDsFromCollection = useCallback(async (): Promise<
    TokensResponse | undefined
  > => {
    try {
      const result = await lcd.wasm.contractQuery<TokensResponse>(
        contracts[chainId].collection,
        {
          all_tokens: {},
        }
      )

      return result
    } catch (error) {
      return undefined
    }
  }, [chainId, lcd.wasm])

  /**
   * Check if NFT is broken
   *
   * @param token NFT to check, uses queryNFTFromCollection return
   * @returns {boolean}
   */
  const isNFTBroken = (token: AllNftInfoResponseForMetadata) => {
    if (token.info.extension.attributes) {
      const isBroken = token.info.extension.attributes.find((attribute) => {
        if (attribute.trait_type === "broken" && attribute.value === "true") {
          return true
        } else {
          return false
        }
      })

      return isBroken ? true : false
    }

    return false
  }

  /**
   * Create mint message and posts it to the wallet
   * TODO:  - import transaction handling context and handle errors.
   *        - simulate tx for more accurate fees.
   * @returns
   */
  const mintNFT = async () => {
    if (!address) return undefined

    try {
      const msg = new MsgExecuteContract(address, contracts[chainId].minter, {
        mint: {},
      })

      const postedTx = await wallet.post({
        msgs: [msg],
        chainID: chainId,
        gasAdjustment: 1.4,
        feeDenoms: ["uluna"],
      })

      return postedTx
    } catch (error) {
      console.log("Error minting NFT:")
      return undefined
    }
  }

  /**
   * Create break NFT message and post to wallet.  Will only be successful if user can break.
   *
   * TODO: simulate tx first for gas fees.
   *
   * @param token_id id of token to be broken
   * @returns void
   */
  const breakNFT = async (token_id: string) => {
    if (!address) return undefined
    try {
      const msg = new MsgExecuteContract(
        address,
        contracts[chainId].collection,
        {
          break_nft: token_id,
        }
      )

      const postedTx = await wallet.post({
        msgs: [msg],
        chainID: chainId,
        gasAdjustment: 1.4,
        feeDenoms: ["uluna"],
      })

      return postedTx
    } catch (error) {
      console.log("Error breaking NFT:")
      return undefined
    }
  }

  return {
    getNFTDataFromMinter,
    queryNFTFromCollection,
    queryAllNFTIDsFromCollection,
    isNFTBroken,
    mintNFT,
    breakNFT,
  }
}

export default useAllianceContracts
