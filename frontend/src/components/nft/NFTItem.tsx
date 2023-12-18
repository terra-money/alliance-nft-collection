/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import LoadingCircular from 'components/loading/circular';
import styles from './NFTItem.module.scss';
import { useHover } from 'usehooks-ts';
import { useNFTFromCollection } from 'hooks';

const cx = classNames.bind(styles);

type NFTCardProps = {
  id: number;
  imageUrl: string;
  title?: string;
};

const NFTItem = ({ id, imageUrl, title }: NFTCardProps) => {
  const [loading, setLoading] = useState(true);
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);
  const { data: nftInfo } = useNFTFromCollection(id)
  const attributes = nftInfo?.info.extension.attributes;

  return (
    <NavLink to={`/nft/${id}`} className={styles.card}>
      <div className={styles.image__wrapper} ref={hoverRef}>
        {loading && (
          <div className={styles.loading__container}>
            <LoadingCircular />
          </div>
        )}
        <img
          className={cx(styles.image, { [styles.loaded]: !loading })}
          src={imageUrl}
          alt={title || `NFT ${id}`}
          onLoad={() => setLoading(false)}
        />
        {isHover && (
          <div className={styles.hover__container}>
            <div className={styles.hover__content}>
              <h3>#{id.toString().padStart(5, '0')}</h3>
              <div className={styles.rows}>
                {attributes?.map((attribute: any) => {
                  if (attribute.trait_type !== "rewards"  && attribute.trait_type !== "broken" && attribute.trait_type !== "staked") {
                    return (
                      <div className={styles.hover__content__inner}>
                        <div className={styles.hover__content__inner__title}>
                          {attribute.trait_type}
                        </div>
                        <div className={styles.hover__content__inner__subtitle}>
                          {attribute.value}
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      {title && <h3>#{title.toString().padStart(5, '0')}</h3>}
    </NavLink>
  );
};

export default NFTItem;
