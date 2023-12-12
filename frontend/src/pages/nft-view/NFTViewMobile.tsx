import StarMap from 'components/starmap';
import styles from './NFTViewMobile.module.scss';

interface NFTViewProps {
  nft: {
    id: number;
    planet: string;
    character: string;
    object: string;
    rarity: number;
    mood: string;
  }
  image: string;
}

export const NFTViewMobile = ({ nft, image }: NFTViewProps) => {
  return (
    <div className={styles.nft__view}>
      <div className={styles.nft__image__container}>
        <img className={styles.image} src={image} alt="NFT" />
      </div>

      <div className={styles.nft__details__container}>
        <div className={styles.header}>
          <div className={styles.collection__title}>Alliance DAO NFT</div>
          <div className={styles.nft__number}>#{nft.id}</div>
        </div>
        <div className={styles.nft__attributes__container}>
          <div className={styles.attributes}>
            {Object.entries(nft).map((entry, i) => {
              return (
                <div key={"detail_entry" + i} className={styles.row}>
                  <div className={styles.attribute__title}>{entry[0]}</div>
                  <div className={styles.attribute__value}>{entry[1] ? entry[1] : ""}</div>
                </div>
              )
            })}
          </div>

          <div className={styles.star__map}>
            <StarMap planet={nft.planet} />
          </div>
        </div>

        {/* <button className={styles.button}>Break NFT & Claim Rewards</button> */}
      </div>
    </div>
  )
}