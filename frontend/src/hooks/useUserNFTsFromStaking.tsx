import { useQuery } from "@tanstack/react-query"
import { TokensResponse } from "types/AllianceNftCollection"
import { useAppContext } from "contexts"

const useUserNFTsFromStaking = (userAddress: string | undefined) => {
  const { contractAddresses, chainId, lcd } = useAppContext()

  return useQuery<TokensResponse, Error>({
    queryKey: ["user_staked_nfts", userAddress, chainId],
    queryFn: () => {
      return lcd.wasm
        .contractQuery<TokensResponse>(contractAddresses.daoStaking, {
          user_stake: {
            user: userAddress,
            limit: 100,
          },
        })
        .then((res) => res)
    },
  })
}

export default useUserNFTsFromStaking
