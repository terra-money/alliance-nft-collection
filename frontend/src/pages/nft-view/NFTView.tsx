/* eslint-disable @typescript-eslint/no-explicit-any */
import { mockNFTs } from 'fakeData/mockNFTs';
import { useParams } from 'react-router-dom';
import styles from './NFTView.module.scss';
import { useMediaQuery } from 'usehooks-ts';
import { NFTViewMobile } from './NFTViewMobile';
import StarMap from 'components/starmap';

export const NFTView = () => {
  const { id } = useParams();
  const allNFTs = mockNFTs;
  const nft = allNFTs[Number(id)];

  const isMobile = useMediaQuery('(max-width: 976px)');

  if (!id) {
    return (
      <div>
        NFT Not Found
      </div>
    )
  }

  if (isMobile) {
    return (
      <NFTViewMobile nft={nft} />
    )
  }

  return (
    <div className={styles.nft__view}>
      <div className={styles.nft__image__container}>
        <img className={styles.image} src={nft.image} alt="NFT" />
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
            <StarMap planet={nft.biome} />
          </div>
        </div>

        <button className={styles.button}>Break NFT & Claim Rewards</button>
      </div>
    </div>
  );
};
