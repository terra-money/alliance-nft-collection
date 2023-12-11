import { PostResponse, useWallet } from "@terra-money/wallet-kit"
import { MsgExecuteContract } from "@terra-money/feather.js"
import { contracts } from "config"
import { useAppContext } from "contexts"

/**
 * useAllianceContracts Interface
 * requires: useWallet
 */
interface IUseContracts {
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
  const { chainId } = useAppContext()
  const wallet = useWallet()

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

      //   const instantiateResult = await post(postMessage);
      // const txHash = instantiateResult?.result.txhash;

      // if (!txHash) {
      //   throw new Error('No txHash');
      // }

      // // poll for block result
      // let txResult: any = await pollForTxInclusion(txHash);
      // console.log('txResult', txResult);

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
    mintNFT,
    breakNFT,
  }
}

export default useAllianceContracts
