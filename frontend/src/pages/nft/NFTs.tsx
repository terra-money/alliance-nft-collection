import { useState } from "react"
import classNames from "classnames/bind"
import NFTItem from "components/nft/NFTItem"
import { NFT_PREVIEW_URL } from "config"
import { ReactComponent as FilterIcon } from "assets/Filter.svg"
import styles from "./NFTs.module.scss"
import {
  useAllMintedNFTsFromCollection,
  useUserNFTsFromCollection,
} from "hooks"
import { useAppContext } from "contexts"

const cx = classNames.bind(styles)

export interface GalleryFiltersProps {
  planetNumber: number | null
  planetNames: string[]
  planetInhabitants: string[]
  nftObjects: string[]
}

export const NFTsPage = () => {
  const [showFilterRow, setShowFilterRow] = useState(false)
  // const [searchValue, setSearchValue] = useState("")
  // const [searchLoading, setSearchLoading] = useState(false)
  const { walletAddress } = useAppContext()
  const { data: allNfts, isLoading: areNftsLoading } =
    useAllMintedNFTsFromCollection()

  const { data: userNfts } = useUserNFTsFromCollection(walletAddress)

  const [activeTab, setActiveTab] = useState("all")

  // const [galleryFilters, setGalleryFilters] = useState<GalleryFiltersProps>({
  //   planetNumber: null,
  //   planetNames: [],
  //   planetInhabitants: [],
  //   nftObjects: [],
  // })

  // useEffect(() => {
  //   if (
  //     !galleryFilters.planetNames.length &&
  //     !galleryFilters.planetInhabitants.length &&
  //     !galleryFilters.nftObjects.length
  //   ) {
  //     setDisplayedNFTs(mockNFTs)
  //     return
  //   }

  //   const filtered = filterNFTs(mockNFTs, galleryFilters)
  //   setDisplayedNFTs(filtered)
  // }, [galleryFilters])

  // useEffect(() => {
  //   if (!searchValue) {
  //     setSearchLoading(false)
  //     setDisplayedNFTs(mockNFTs)
  //     return
  //   }

  //   setSearchLoading(true)
  //   setTimeout(() => {
  //     const filtered = mockNFTs.filter(
  //       (nft) => nft.id.toString() === searchValue
  //     )
  //     setDisplayedNFTs(filtered)
  //     setSearchLoading(false)
  //   }, 1000)
  // }, [searchValue])

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
              <span className={styles.button__count}>
                {userNfts?.tokens.length}
              </span>
            </button>
          )}
        </div>

        {/* {activeTab === "all" && showFilterRow && (
          <>
            <SearchByID
              setSearchValue={setSearchValue}
              searchValue={searchValue}
              isLoading={searchLoading}
            />
            <FilterDropdowns
              galleryFilters={galleryFilters}
              setGalleryFilters={setGalleryFilters}
            />
          </>
        )} */}

        {activeTab === "all" ? (
          !areNftsLoading &&
          allNfts && (
            <div className={styles.grid}>
              {allNfts.tokens?.map((nft) => (
                <NFTItem
                  key={nft}
                  id={parseInt(nft)}
                  imageUrl={NFT_PREVIEW_URL.replace("{id}", nft)}
                  title={nft.toString()}
                />
              ))}
            </div>
          )
        ) : (
          <div className={styles.grid}>
            {userNfts?.tokens.map((nft) => (
              <NFTItem
                key={nft}
                id={parseInt(nft)}
                imageUrl={NFT_PREVIEW_URL.replace("{id}", nft)}
                title={nft.toString()}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
