/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import classNames from "classnames/bind"
import Papa from "papaparse"
import NFTItem from "components/nft/NFTItem"
import { ReactComponent as FilterIcon } from "assets/Filter.svg"
import { NFT_PREVIEW_URL } from "config"

import {
  useAllMintedNFTsFromCollection,
  useUserNFTsFromCollection,
  useUserNFTsFromStaking,
} from "hooks"
import { useAppContext } from "contexts"
import styles from "./NFTs.module.scss"
import { filterNFTs } from "components/filters/helpers"
import { FilterDropdowns } from "components/filters/dropdowns"

const cx = classNames.bind(styles)

export interface GalleryFiltersProps {
  planetNumber: number | null
  planetNames: string[]
  planetInhabitants: string[]
  nftObjects: string[]
}

export interface CSVItem {
  id: string;
  attributes: Record<string, string>;
}

export const NFTsPage = () => {
  /* Get user address from app store */
  const { walletAddress } = useAppContext()

  /* Query All Minted NFTs from Collection */
  const { data: allNfts, isLoading: areNftsLoading } = useAllMintedNFTsFromCollection()
  /* Query User NFTs from Collection */
  const { data: userNftsFromCollection } = useUserNFTsFromCollection(walletAddress)
  /* Query User NFTs from Staking contract */
  const { data: userStakedNfts } = useUserNFTsFromStaking(walletAddress)

  /* Merge User NFTs from Collection and Staking */
  const userNfts: { id: string; staked?: boolean }[] = [
    ...(userNftsFromCollection?.tokens.map((nft) => ({ id: nft })) || []),
    ...(userStakedNfts?.tokens.map((nft) => ({ id: nft, staked: true })) || []),
  ]

  const [activeTab, setActiveTab] = useState("all")
  const [showFilterRow, setShowFilterRow] = useState(false)
  const [galleryFilters, setGalleryFilters] = useState<GalleryFiltersProps>({
    planetNumber: null,
    planetNames: [],
    planetInhabitants: [],
    nftObjects: [],
  });

  const [displayedNFTs, setDisplayedNFTs] = useState(allNfts)
  const [csvData, setCsvData] = useState<CSVItem[]>([])

  useEffect(() => {
    const parseCSV = () => {
      // const csvFilePath = "/preview-small.csv"
      const csvFilePath = "/mtd__full.csv"

      Papa.parse(csvFilePath, {
        download: true,
        complete: (results) => {
          const parsedData = (results.data as string[][]).map(row => {
            const nftObject = { id: row[0], attributes: {} as Record<string, string> }
            for (let i = 1; i < row.length; i += 2) {
              nftObject.attributes[row[i]] = row[i + 1]
            }
            return nftObject
          });

          setCsvData(parsedData)
        },
        error: (error) => {
          console.error("Error parsing CSV: ", error.message)
        }
      })
    }

    parseCSV()
  }, [])

  useEffect(() => {
    if (
      !galleryFilters.planetNames.length &&
      !galleryFilters.planetInhabitants.length &&
      !galleryFilters.nftObjects.length
    ) {
      setDisplayedNFTs(filterNFTs(csvData, allNfts || [], galleryFilters))
      return
    }

    const filtered = filterNFTs(csvData, allNfts || [], galleryFilters)
    setDisplayedNFTs(filtered)
  }, [galleryFilters, allNfts, csvData])

  const handleSwitch = (tab: string) => {
    if (tab === "all" && activeTab === "all") {
      return
    } else if (tab === "my" && activeTab === "my") {
      return
    }

    if (tab === "all") {
      setActiveTab("all")
      setShowFilterRow(false)
    } else {
      setActiveTab("my")
      setShowFilterRow(false)
    }
  }

  return (
    <main className={styles.main}>
      <section className={styles.main__content}>
        <div className={styles.buttons}>
          {activeTab === "all" && (
            <button
              className={styles.filter__toggle}
              onClick={() => setShowFilterRow(!showFilterRow)}
            >
              <FilterIcon
                fill={"var(--token-dark-700)"}
                height={16}
                width={16}
              />
            </button>
          )}
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

        {activeTab === "all" && showFilterRow && (
          <>
            <FilterDropdowns galleryFilters={galleryFilters} setGalleryFilters={setGalleryFilters} />
          </>
        )}

        {activeTab === "all" ? (
          !areNftsLoading &&
          allNfts && (
            <div className={styles.grid}>
              {displayedNFTs?.map((nft) => {
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
