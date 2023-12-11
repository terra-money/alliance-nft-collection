import { AllNftInfoResponseForMetadata } from "../types/AllianceNftCollection"

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

// export const pollForTxInclusion = async (
//   txHash: string,
//   timeout: number = 30000,
//   lcd: LCDClient,
//   chainId: string
// ): Promise<any> => {
//   let txResult: any = null
//   const startTime: number = new Date().getTime()
//   try {
//     txResult = await lcd.tx.txInfo(txHash, chainId)
//     return txResult
//   } catch (e) {
//     if (new Date().getTime() - startTime > timeout) {
//       return null
//     }
//     await delay(1000)
//     return await pollForTxInclusion(txHash, timeout, lcd, chainId)
//   }
// }

// const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))
