import { useQuery } from "@tanstack/react-query"
import { TokensResponse } from "types/AllianceNftCollection"
import { contracts } from "config"
import { useAppContext } from "contexts"

const useAllMintedNFTsFromCollection = () => {
  const { chainId, lcd } = useAppContext()

  return useQuery<TokensResponse, Error>({
    queryKey: ["all_nft_ids"],
    queryFn: () => {
      return lcd.wasm
        .contractQuery<TokensResponse>(contracts[chainId].collection, {
          all_tokens: {},
        })
        .then((res) => res)
    },
  })
}

export default useAllMintedNFTsFromCollection
