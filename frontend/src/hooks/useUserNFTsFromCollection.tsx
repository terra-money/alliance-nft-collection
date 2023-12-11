import { useQuery } from "@tanstack/react-query"
import { TokensResponse } from "types/AllianceNftCollection"
import { useAppContext } from "contexts"

const useUserNFTsFromCollection = (userAddress: string | undefined) => {
  const { contractAddresses, chainId, lcd } = useAppContext()

  return useQuery<TokensResponse, Error>({
    queryKey: ["user_nfts", userAddress, chainId],
    queryFn: () => {
      return lcd.wasm
        .contractQuery<TokensResponse>(contractAddresses.collection, {
          tokens: {
            owner: userAddress,
          },
        })
        .then((res) => res)
    },
  })
}

export default useUserNFTsFromCollection
