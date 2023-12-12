import { AllNftInfoResponseForMetadata } from "../types/AllianceNftCollection"
import { LCDClient, TxInfo } from "@terra-money/feather.js"

/**
 * Check if NFT is broken
 *
 * @param tokenWithNFTInfo NFT to check
 * @returns {boolean}
 */
export const isNFTBroken = (
  tokenWithNFTInfo: AllNftInfoResponseForMetadata
) => {
  return !!tokenWithNFTInfo.info.extension.attributes?.some(
    (attribute) =>
      attribute.trait_type === "broken" && attribute.value === "true"
  )
}

export async function checkTxIsConfirmed(
  lcd: LCDClient,
  chainId: string,
  txHash: string
): Promise<TxInfo> {
  return await lcd.tx.txInfo(txHash, chainId)
}
