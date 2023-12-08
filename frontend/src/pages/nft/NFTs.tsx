import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import NFTItem from 'components/nft/NFTItem';
import styles from './NFTs.module.scss';
import { mockNFTs, signedInUserData } from 'fakeData/mockNFTs';
import { Facet } from 'components/filters/facet';
import { filterNFTs } from 'components/filters/helpers';

const cx = classNames.bind(styles);

export interface GalleryFiltersProps {
  planetNumber: number | null
  planetNames: string[]
  planetInhabitants: string[]
  nftObjects: string[]
}

export const NFTsPage = () => {
  const [isMyNFTSelected, setIsMyNFTSelected] = useState(false);
  const [galleryFilters, setGalleryFilters] = useState<GalleryFiltersProps>({
    planetNumber: null,
    planetNames: [],
    planetInhabitants: [],
    nftObjects: [],
  });

  const [displayedNFTs, setDisplayedNFTs] = useState(mockNFTs);

  useEffect(() => {
    if (!galleryFilters.planetNames.length && !galleryFilters.planetInhabitants.length && !galleryFilters.nftObjects.length) {
      setDisplayedNFTs(mockNFTs);
      return;
    }

    const filtered = filterNFTs(mockNFTs, galleryFilters);
    setDisplayedNFTs(filtered);
  }, [galleryFilters]);

  return (
    <main className={styles.main}>
      <Facet setGalleryFilters={setGalleryFilters} galleryFilters={galleryFilters} />
      <section className={styles.main__content}>
        <div className={styles.buttons}>
          <button
            className={cx(styles.button, { [styles.button__selected]: !isMyNFTSelected })}
            onClick={() => setIsMyNFTSelected(false)}
          >
            All NFTs
          </button>
          <button
            className={cx(styles.button, { [styles.button__selected]: isMyNFTSelected })}
            onClick={() => setIsMyNFTSelected(true)}
          >
            My NFTs
            <span className={styles.button__count}>{signedInUserData.nftIDs.length}</span>
          </button>
        </div>
        {!isMyNFTSelected ? (
          <div className={styles.grid}>
            {displayedNFTs.map(nft => (
              <NFTItem key={nft.id} id={nft.id} imageUrl={nft.image} title={nft.id.toString()} />
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {signedInUserData.nftIDs.map(nft => (
              <NFTItem
                key={mockNFTs[nft].id}
                id={mockNFTs[nft].id}
                imageUrl={mockNFTs[nft].image}
                title={mockNFTs[nft].id.toString()}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
