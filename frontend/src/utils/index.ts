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
