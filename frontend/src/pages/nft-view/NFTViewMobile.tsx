import StarMap from 'components/starmap';
import styles from './NFTViewMobile.module.scss';

interface NFTViewProps {
  nft: {
    id: number;
    background_color: string;
    image: string;
    biome: string;
    character: string;
    object: string;
    rarityScore: number;
    rewards: number;
    claimed: string;
  }
}

export const NFTViewMobile = ({ nft }: NFTViewProps) => {
  return (
    <div className={styles.nft__view}>
      <div className={styles.nft__image__container}>
        <img className={styles.image} src={nft.image} alt="NFT" />
      </div>

      <div className={styles.nft__details__container}>
        <div className={styles.header}>
          <div className={styles.collection__title}>Alliance DAO NFT</div>
          <div className={styles.nft__number}>#{nft.id}</div>
        </div>
        <div className={styles.nft__attributes__container}>
          <div className={styles.attributes}>
            <div className={styles.row}>
              <div className={styles.attribute__title}>Unique ID</div>
              <div className={styles.attribute__value}>{nft.id}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.attribute__title}>Biome</div>
              <div className={styles.attribute__value}>{nft.biome}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.attribute__title}>Character</div>
              <div className={styles.attribute__value}>{nft.character}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.attribute__title}>Object</div>
              <div className={styles.attribute__value}>{nft.object}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.attribute__title}>Rarity Score</div>
              <div className={styles.attribute__value}>{nft.rarityScore}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.attribute__title}>Rewards Accrued</div>
              <div className={styles.attribute__value}>{nft.rewards}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.attribute__title}>Claimed</div>
              {/* <div className={styles.attribute__value}>{nft.claimed}</div> */}
              <div className={styles.attribute__value}>24 Dec 2023</div>
            </div>
          </div>

          <div className={styles.star__map}>
            <StarMap planet={"fire"} />
          </div>
        </div>

        <button className={styles.button}>Break NFT & Claim Rewards</button>
      </div>
    </div>
  )
}