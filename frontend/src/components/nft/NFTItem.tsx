import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import LoadingCircular from 'components/loading/circular';
import styles from './NFTItem.module.scss';

const cx = classNames.bind(styles);

type NFTCardProps = {
  id: number;
  imageUrl: string;
  title?: string;
};

const NFTItem = ({ id, imageUrl, title }: NFTCardProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <NavLink to={`/nft/${id}`} className={styles.card}>
      <div className={styles.image__wrapper}>
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
      </div>
      {title && <h3># {title}</h3>}
    </NavLink>
  );
};

export default NFTItem;
