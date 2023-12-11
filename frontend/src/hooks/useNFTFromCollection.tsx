import { useQuery } from "@tanstack/react-query"
import { AllNftInfoResponseForMetadata } from "types/AllianceNftCollection"
import { contracts } from "config"
import { useAppContext } from "contexts"

const useNFTFromCollection = (token_id: string | number | undefined) => {
  const { chainId, lcd } = useAppContext()

  const token = token_id ? token_id.toString() : ""

  return useQuery<AllNftInfoResponseForMetadata, Error>({
    queryKey: ["nft_info", token_id],
    queryFn: () => {
      return lcd.wasm
        .contractQuery<AllNftInfoResponseForMetadata>(
          contracts[chainId].collection,
          {
            all_nft_info: {
              token_id: token,
            },
          }
        )
        .then((res) => res)
    },
  })
}

export default useNFTFromCollection
