import { useQuery } from "@tanstack/react-query"
import { AllNftInfoResponseForMetadata } from "types/AllianceNftCollection"
import { useAppContext } from "contexts"

const useNFTFromCollection = (token_id: string | number | undefined) => {
  const { lcd, contractAddresses } = useAppContext()

  const token = token_id ? token_id.toString() : ""

  return useQuery<AllNftInfoResponseForMetadata, Error>({
    queryKey: ["nft_info", token_id],
    queryFn: () => {
      return lcd.wasm
        .contractQuery<AllNftInfoResponseForMetadata>(
          contractAddresses.collection,
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
