/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import classNames from 'classnames/bind'
import { useMediaQuery } from "usehooks-ts"
import { useNFTFromCollection } from "hooks"
import LoadingCircular from "components/loading/circular"
import StarMap from "components/starmap"
import { NFTViewMobile } from "./NFTViewMobile"
import styles from "./NFTView.module.scss"

const cx = classNames.bind(styles)

type NFTDetail = Record<string, string>

export const NFTView = () => {
  const [loading, setLoading] = useState(true);
  const [nftData, setNftData] = useState<Record<string, string>>({});

  const { id } = useParams()
  const { data: nftInfo } = useNFTFromCollection(id)

  useEffect(() => {
    const holderObject = {} as NFTDetail;

    if (nftInfo?.info?.extension?.attributes) {
      nftInfo?.info?.extension?.attributes.map((attr) => {
        if (attr.trait_type !== "broken" && attr.trait_type !== "rewards") {
          if (attr.trait_type === "Planet") {
            let planetNameValue = attr.value.toLowerCase().replace(" planet", "")
            if (planetNameValue.includes("south")) {
              planetNameValue = attr.value.toLowerCase().replace(" south", "")
            }
            if (planetNameValue.includes("north")) {
              planetNameValue = attr.value.toLowerCase().replace(" north", "")
            }

            holderObject[attr.trait_type.toLowerCase()] = planetNameValue
          } else
          holderObject[attr.trait_type.toLowerCase()] = attr.value.toLowerCase()
        }
      })

      setNftData({
        id: id || "",
        ...holderObject
      });
    }
  }, [id, nftInfo])

  const ipfsUrl = "https://ipfs.io/ipfs/{id}"

  // const details: NFTDetail = {}

  // if (nftInfo?.info?.extension?.attributes) {
  //   nftInfo?.info?.extension?.attributes.map((attr) => {
  //     if (attr.trait_type !== "broken" && attr.trait_type !== "rewards") {
  //       details[attr.trait_type] = attr.value
  //     }
  //   })
  // }

  // const allNFTs = mockNFTs
  // const nft = allNFTs[Number(id)]

  const isMobile = useMediaQuery("(max-width: 976px)")

  if (!id) {
    return <div>NFT Not Found</div>
  }

  if (isMobile) {
    return (
      <NFTViewMobile
        image={nftInfo?.info.extension.image
          ? ipfsUrl.replace(
              "{id}",
              nftInfo?.info.extension.image.split("ipfs://")[1]
            )
          : ""}
        nft={{
          id: parseInt(id),
          planet: nftData.planet || "",
          object: nftData.object || "",
          rarity: parseInt(nftData.rarity) || 0,
          inhabitant: nftData.inhabitant || nftData.character || "",
          light: nftData.light || nftData.mood || "",
          weather: nftData.weather || "",
        }}
      />
    )
  }

  return (
    <div className={styles.nft__view}>
      <div className={styles.nft__image__container}>
        {loading && (
          <div className={styles.loading__container}>
            <LoadingCircular size={40} />
          </div>
        )}
        <img
          className={cx(styles.image, {[styles.image__loading]: loading})}
          src={
            nftInfo?.info.extension.image
              ? ipfsUrl.replace(
                  "{id}",
                  nftInfo?.info.extension.image.split("ipfs://")[1]
                )
              : "" // stick filler image src if query fails.
          }
          alt="NFT"
          onLoad={() => setLoading(false)}
        />
      </div>

      <div className={styles.nft__details__container}>
        <div className={styles.header}>
          <div className={styles.collection__title}>Alliance DAO NFT</div>
          <div className={styles.nft__number}>#{id.toString().padStart(5, '0')}</div>
        </div>
        <div className={styles.nft__attributes__container}>
          <div className={styles.attributes}>
            {Object.entries(nftData).map((entry, i) => {
              return (
                <div key={"detail_entry" + i} className={styles.row}>
                  <div className={styles.attribute__title}>{entry[0]}</div>
                  <div className={styles.attribute__value}>{entry[1] ? entry[1] : ""}</div>
                </div>
              )
            })}
          </div>

          <div className={styles.star__map}>
            <StarMap planet={nftData?.planet || ""} />
          </div>
        </div>

        {/* <button className={styles.button}>Break NFT & Claim Rewards</button> */}
      </div>
    </div>
  )
}
