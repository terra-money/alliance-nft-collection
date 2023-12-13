import { useQuery } from "@tanstack/react-query"
import { TokensResponse } from "types/AllianceNftCollection"
import { useAppContext } from "contexts"

const useAllMintedNFTsFromCollection = () => {
  const { lcd, contractAddresses, chainId } = useAppContext()

  return useQuery<TokensResponse, Error>({
    queryKey: ["all_nft_ids", chainId],
    queryFn: () => {
      return lcd.wasm
        .contractQuery<TokensResponse>(contractAddresses.collection, {
          all_tokens: {
            limit: 999,
          },
        })
        .then((res) => res)
    },
  })
}

export default useAllMintedNFTsFromCollection
