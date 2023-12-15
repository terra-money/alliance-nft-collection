import { useQuery } from "@tanstack/react-query"
import { TokensResponse } from "types/AllianceNftCollection"
import { useAppContext } from "contexts"
import { LCDClient } from "@terra-money/feather.js"
import { AllianceContractConfig } from "config"

const fetchNFTs = async (
  lcd: LCDClient,
  contractAddresses: AllianceContractConfig,
  start_after: string
): Promise<TokensResponse> => {
  return lcd.wasm
    .contractQuery<TokensResponse>(contractAddresses.collection, {
      all_tokens: {
        start_after: start_after,
        limit: 100,
      },
    })
    .then((res) => res)
    .catch((err: unknown) => {
      console.log(err)
      return { tokens: [] } as TokensResponse
    })
}

const fetchAllNFTs = async (
  lcd: LCDClient,
  contractAddresses: AllianceContractConfig,
  startAfter: string = "",
  allNFTs: string[] = []
): Promise<string[]> => {
  const response = await fetchNFTs(lcd, contractAddresses, startAfter)
  const { tokens } = response

  allNFTs = [...allNFTs, ...tokens]

  if (tokens.length === 100) {
    const lastToken = tokens[tokens.length - 1]
    return fetchAllNFTs(lcd, contractAddresses, lastToken, allNFTs)
  }

  return allNFTs.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
}

const useAllMintedNFTsFromCollection = () => {
  const { lcd, contractAddresses, chainId } = useAppContext()

  return useQuery<string[], Error>({
    queryKey: ["all_nft_ids", chainId],
    queryFn: () => fetchAllNFTs(lcd, contractAddresses),
  })
}

export default useAllMintedNFTsFromCollection
