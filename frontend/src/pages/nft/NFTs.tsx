import { useState } from "react"
import classNames from "classnames/bind"
import NFTItem from "components/nft/NFTItem"
import { NFT_PREVIEW_URL } from "config"

import { useUserNFTsFromCollection, useUserNFTsFromStaking } from "hooks"

import { allNfts } from "fakeData/allNFTs"
import { useAppContext } from "contexts"
import styles from "./NFTs.module.scss"

const cx = classNames.bind(styles)

export interface GalleryFiltersProps {
  planetNumber: number | null
  planetNames: string[]
  planetInhabitants: string[]
  nftObjects: string[]
}

const PaginationControls = ({
  offset,
  limit,
  setOffset,
  setLimit,
  totalItems,
}: {
  offset: number
  limit: number
  setOffset: React.Dispatch<React.SetStateAction<number>>
  setLimit: React.Dispatch<React.SetStateAction<number>>
  totalItems: number
}) => {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(totalItems / limit)

  const goToPage = (page: number) => {
    setOffset((page - 1) * limit)
  }

  const goToPreviousPage = () => goToPage(currentPage - 1)
  const goToNextPage = () => goToPage(currentPage + 1)

  const skipPages = (percentage: number) => {
    const pagesToSkip = Math.round(totalPages * percentage)
    goToPage(Math.min(Math.max(1, currentPage + pagesToSkip), totalPages))
  }

  return (
    <div className={styles.pagination}>
      <div className={styles.pagination__limit}>
        <label htmlFor="limit">Limit</label>
        <select
          name="limit"
          id="limit"
          value={limit}
          onChange={(e) => {
            setLimit(parseInt(e.target.value))
            setOffset(0) // Reset offset when limit changes
          }}
        >
          <option value="1">1</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      <div className={styles.pagination__controls}>
        <button onClick={() => goToPage(1)} disabled={currentPage === 1}>
          Start
        </button>
        <button onClick={() => skipPages(-0.1)} disabled={currentPage <= 1}>
          Rewind {Math.round(totalPages * 0.1)}
        </button>
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
        <button
          onClick={() => skipPages(0.1)}
          disabled={currentPage >= totalPages}
        >
          Fast Forward {Math.round(totalPages * 0.1)}
        </button>
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          End
        </button>
      </div>
    </div>
  )
}

export const NFTsPage = () => {
  /* Get user address from app store */
  const { walletAddress } = useAppContext()

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
  const [nftOffset, setNftOffset] = useState(0)
  const [nftLimit, setNftLimit] = useState(10)

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
          allNfts && (
            <div>
              <div>
                <PaginationControls
                  offset={nftOffset}
                  limit={nftLimit}
                  setOffset={setNftOffset}
                  setLimit={setNftLimit}
                  totalItems={allNfts.length}
                />
              </div>
              <div className={styles.grid}>
                {allNfts.slice(nftOffset, nftOffset + nftLimit).map((nft) => {
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
