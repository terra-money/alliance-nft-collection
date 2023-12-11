import { useState } from "react"
import classNames from "classnames/bind"
import NFTItem from "components/nft/NFTItem"
import styles from "./NFTs.module.scss"
import { useAllNftsFromCollection, useUserNFTsFromCollection } from "hooks"
import { useAppContext } from "contexts"
import { mockNFTs, signedInUserData } from "fakeData/mockNFTs"

const cx = classNames.bind(styles)

const UserNFTs = ({ walletAddress }: { walletAddress: string }) => {
  const {
    data: userNfts,
    isLoading,
    error,
  } = useUserNFTsFromCollection(walletAddress)
  if (!isLoading && !error) {
    console.log(
      "user nfts",
      userNfts?.tokens.sort((a, b) => {
        return parseInt(a) - parseInt(b)
      })
    )
  }
  return <></>
}

export const NFTsPage = () => {
  const { walletAddress } = useAppContext()
  const [isMyNFTSelected, setIsMyNFTSelected] = useState(false)
  const { data: allNfts } = useAllNftsFromCollection()

  // all nfts - sort them by number value
  if (allNfts) {
    console.log(
      "all nfts",
      allNfts.tokens.sort((a, b) => {
        return parseInt(a) - parseInt(b)
      })
    )
  }

  return (
    <main className={styles.main}>
      {walletAddress && <UserNFTs walletAddress={walletAddress} />}
      <div className={styles.buttons}>
        <button
          className={cx(styles.button, {
            [styles.button__selected]: !isMyNFTSelected,
          })}
          onClick={() => setIsMyNFTSelected(false)}
        >
          All NFTs
        </button>
        <button
          className={cx(styles.button, {
            [styles.button__selected]: isMyNFTSelected,
          })}
          onClick={() => setIsMyNFTSelected(true)}
        >
          My NFTs
          <span className={styles.button__count}>
            {signedInUserData.nftIDs.length}
          </span>
        </button>
      </div>
      {!isMyNFTSelected ? (
        <div className={styles.grid}>
          {mockNFTs.map((nft) => (
            <NFTItem
              key={nft.id}
              id={nft.id}
              imageUrl={nft.image}
              title={nft.id.toString()}
            />
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {signedInUserData.nftIDs.map((nft) => (
            <NFTItem
              key={mockNFTs[nft].id}
              id={mockNFTs[nft].id}
              imageUrl={mockNFTs[nft].image}
              title={mockNFTs[nft].id.toString()}
            />
          ))}
        </div>
      )}
    </main>
  )
}
