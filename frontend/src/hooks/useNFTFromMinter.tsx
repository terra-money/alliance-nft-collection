import { useQuery } from "@tanstack/react-query"
import { MinterExtension } from "types/AllianceNftMinter"
import { useAppContext } from "contexts"

const useNFTInfoFromMinter = (address: string | undefined) => {
  const { contractAddresses, lcd, chainId } = useAppContext()

  return useQuery<MinterExtension, Error>({
    queryKey: ["unminted_nft", address, chainId],
    queryFn: () => {
      return lcd.wasm
        .contractQuery<MinterExtension>(contractAddresses.minter, {
          nft_data: address,
        })
        .then((res) => res)
    },
    enabled: !!address,
  })
}

export default useNFTInfoFromMinter
