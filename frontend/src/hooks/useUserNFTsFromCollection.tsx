import { useQuery } from "@tanstack/react-query"
import { TokensResponse } from "types/AllianceNftCollection"
import { contracts } from "config"
import { useAppContext } from "contexts"

const useUserNFTsFromCollection = (userAddress: string) => {
  const { chainId, lcd } = useAppContext()

  return useQuery<TokensResponse, Error>({
    queryKey: ["user_nfts", userAddress],
    queryFn: () => {
      return lcd.wasm
        .contractQuery<TokensResponse>(contracts[chainId].collection, {
          tokens: {
            owner: userAddress,
          },
        })
        .then((res) => res)
    },
  })
}

export default useUserNFTsFromCollection
