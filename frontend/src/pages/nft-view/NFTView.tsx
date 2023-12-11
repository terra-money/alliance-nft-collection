/* eslint-disable @typescript-eslint/no-explicit-any */
import { mockNFTs } from "fakeData/mockNFTs"
import { useParams } from "react-router-dom"
import styles from "./NFTView.module.scss"
import { useMediaQuery } from "usehooks-ts"
import { NFTViewMobile } from "./NFTViewMobile"
// import StarMap from "components/starmap"
import { useNFTFromCollection } from "hooks"

type NFTDetail = Record<string, string>

export const NFTView = () => {
  const { id } = useParams()
  const { data: nftInfo } = useNFTFromCollection(id)

  const ipfsUrl = "https://ipfs.io/ipfs/{id}"

  const details: NFTDetail = {}

  if (nftInfo?.info?.extension?.attributes) {
    nftInfo?.info?.extension?.attributes.map((attr) => {
      if (attr.trait_type !== "broken" && attr.trait_type !== "rewards") {
        details[attr.trait_type] = attr.value
      }
    })
  }

  const allNFTs = mockNFTs
  const nft = allNFTs[Number(id)]

  const isMobile = useMediaQuery("(max-width: 976px)")

  if (!id) {
    return <div>NFT Not Found</div>
  }

  if (isMobile) {
    return <NFTViewMobile nft={nft} />
  }

  return (
    <div className={styles.nft__view}>
      <div className={styles.nft__image__container}>
        <img
          className={styles.image}
          src={
            nftInfo?.info.extension.image
              ? ipfsUrl.replace(
                  "{id}",
                  nftInfo?.info.extension.image.split("ipfs://")[1]
                )
              : "" // stick filler image src if query fails.
          }
          alt="NFT"
        />
      </div>

      <div className={styles.nft__details__container}>
        <div className={styles.header}>
          <div className={styles.collection__title}>Alliance DAO NFT</div>
          <div className={styles.nft__number}>#{id}</div>
        </div>
        <div className={styles.nft__attributes__container}>
          <div className={styles.attributes}>
            <div className={styles.row}>
              <div className={styles.attribute__title}>Unique ID</div>
              <div className={styles.attribute__value}>{id}</div>
            </div>
            {Object.entries(details).map((entry, i) => {
              return (
                <div key={"detail_entry" + i} className={styles.row}>
                  <div className={styles.attribute__title}>{entry[0]}</div>
                  <div className={styles.attribute__value}>{entry[1]}</div>
                </div>
              )
            })}
          </div>

          {/* <div className={styles.star__map}>
            <StarMap planet={nft.biome} />
          </div> */}
        </div>

        {/* <button className={styles.button}>Break NFT & Claim Rewards</button> */}
      </div>
    </div>
  )
}
