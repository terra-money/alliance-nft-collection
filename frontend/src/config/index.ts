import { AccAddress } from "@terra-money/feather.js"

export const supportedNetworks = ["phoenix-1", "pisco-1"] as const
export type SupportedNetwork = (typeof supportedNetworks)[number]

export const NFT_PREVIEW_URL =
  "https://alliancedao.mypinata.cloud/ipfs/bafybeiek4cv2w6ot767nriveyzagejnvzpw3qr2b7iyc6ccddid6jj77za/{id}.png"

export const IPFS_NFT_URL =
  "https://ipfs.io/ipfs/bafybeiaxgi4be5krl72hxlaqwafz4xmnint3il3sptcrehrizsiuqh6r7q/{id}.png"

  // "https://ipfs.io/ipfs/bafybeiaxgi4be5krl72hxlaqwafz4xmnint3il3sptcrehrizsiuqh6r7q/{id}.png"


export type AllianceContractConfig = {
  minter: AccAddress
  collection: AccAddress
  dao: AccAddress
}

export const contracts: Record<SupportedNetwork, AllianceContractConfig> = {
  "phoenix-1": {
    minter: "terra1m3ye6dl6s25el4xd8adg9lnquz88az9lur2ujztj9pfmzdyfz3xsm699r3",
    collection:
      "terra1phr9fngjv7a8an4dhmhd0u0f98wazxfnzccqtyheq4zqrrp4fpuqw3apw9",
    dao: "terra1g0mfrpswewteaf9ky4rlj09wh5njp6u9xxk94uszplw4qz2f9mzq3k27fm",
  },
  "pisco-1": {
    minter: "terra1a78x4w8da7ycdfj3dryrelvwa2p8t7vxk8t0tfvtuduf00aw5y5qnurwru",
    collection:
      "terra1herk30j8sgn3dlth4g0haw6n3j2nwxfn6d4vwucaf48qwzsfe5wqa7h8f4",
    dao: "terra1tay6vaymstcg95z4lwpaxujhzsnqylu39hl3328556y5edzsf8ysuzrtnq",
  },
}
