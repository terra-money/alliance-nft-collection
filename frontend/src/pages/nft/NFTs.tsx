import { useState } from "react"
import classNames from "classnames/bind"
import NFTItem from "components/nft/NFTItem"
import { NFT_PREVIEW_URL } from "config"

import {
  useAllMintedNFTsFromCollection,
  useUserNFTsFromCollection,
  useUserNFTsFromStaking,
} from "hooks"
import { useAppContext } from "contexts"
import styles from "./NFTs.module.scss"

const cx = classNames.bind(styles)

export interface GalleryFiltersProps {
  planetNumber: number | null
  planetNames: string[]
  planetInhabitants: string[]
  nftObjects: string[]
}

export const NFTsPage = () => {
  /* Get user address from app store */
  const { walletAddress } = useAppContext()

  /* Query All Minted NFTs from Collection */
  const { data: allNfts, isLoading: areNftsLoading } =
    useAllMintedNFTsFromCollection()

  /* Query User NFTs from Collection */
  const { data: userNftsFromCollection } =
    useUserNFTsFromCollection(walletAddress)

  /* Query User NFTs from Staking contract */
  const { data: userStakedNfts } = useUserNFTsFromStaking(walletAddress)

  /* Merge User NFTs from Collection and Staking */
  const userNfts: { id: string; staked?: boolean }[] = [
    ...(userNftsFromCollection?.tokens.map((nft) => ({ id: nft })) || []),
    ...(userStakedNfts?.tokens.map((nft) => ({ id: nft, staked: true })) || []),
  ]

  const [activeTab, setActiveTab] = useState("all")

  const handleSwitch = (tab: string) => {
    if (tab === "all" && activeTab === "all") {
      return
    } else if (tab === "my" && activeTab === "my") {
      return
    }

    if (tab === "all") {
      setActiveTab("all")
    } else {
      setActiveTab("my")
    }
  }

  return (
    <main className={styles.main}>
      <section className={styles.main__content}>
        <div className={styles.buttons}>
          <button
            className={cx(styles.button, {
              [styles.button__selected]: activeTab === "all",
            })}
            onClick={() => handleSwitch("all")}
          >
            All NFTs
          </button>
          {walletAddress && (
            <button
              className={cx(styles.button, {
                [styles.button__selected]: activeTab === "my",
              })}
              onClick={() => handleSwitch("my")}
            >
              My NFTs
              <span className={styles.button__count}>{userNfts.length}</span>
            </button>
          )}
        </div>

        {activeTab === "all" ? (
          !areNftsLoading &&
          allNfts && (
            <div className={styles.grid}>
              {allNfts?.map((nft) => {
                return (
                  <NFTItem
                    key={nft}
                    id={parseInt(nft)}
                    imageUrl={NFT_PREVIEW_URL.replace("{id}", nft)}
                    title={nft.toString()}
                  />
                )
              })}
            </div>
          )
        ) : (
          <div className={styles.grid}>
            {userNfts.map((nft) => (
              <NFTItem
                key={nft.id}
                id={parseInt(nft.id)}
                imageUrl={NFT_PREVIEW_URL.replace("{id}", nft.id)}
                title={nft.id.toString()}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
