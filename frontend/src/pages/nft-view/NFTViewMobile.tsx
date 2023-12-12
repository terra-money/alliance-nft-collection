import { useState } from 'react';
import classNames from 'classnames/bind';
import StarMap from 'components/starmap';
import LoadingCircular from 'components/loading/circular';
import styles from './NFTViewMobile.module.scss';

const cx = classNames.bind(styles);

interface NFTViewProps {
  nft: {
    id: number;
    planet: string;
    inhabitant: string;
    object: string;
    rarity: number;
    light: string;
    weather: string;
  }
  image: string;
}

export const NFTViewMobile = ({ nft, image }: NFTViewProps) => {
  const [loading, setLoading] = useState(true);

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
          src={image}
          alt="NFT"
          onLoad={() => setLoading(false)}
        />
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