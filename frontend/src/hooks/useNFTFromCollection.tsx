import { useQuery } from "@tanstack/react-query"
import { AllNftInfoResponseForMetadata } from "types/AllianceNftCollection"
import { contracts } from "config"
import { useAppContext } from "contexts"

const useNFTFromCollection = (token_id: string | number) => {
  const { chainId, lcd } = useAppContext()

  return useQuery<AllNftInfoResponseForMetadata, Error>({
    queryKey: ["nft_info", token_id],
    queryFn: () => {
      return lcd.wasm
        .contractQuery<AllNftInfoResponseForMetadata>(
          contracts[chainId].collection,
          {
            all_nft_info: {
              token_id: token_id.toString(),
            },
          }
        )
        .then((res) => res)
    },
  })
}

export default useNFTFromCollection
