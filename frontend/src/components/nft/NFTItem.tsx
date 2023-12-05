import { NavLink } from 'react-router-dom';
import styles from './NFTItem.module.scss';

type NFTCardProps = {
  id: number;
  imageUrl: string;
  title?: string;
};

const NFTItem = ({ id, imageUrl, title }: NFTCardProps) => {
  return (
    <NavLink to={`/nft/${id}`} className={styles.card}>
      <div className={styles.image__wrapper}>
        <img src={imageUrl} alt={title || `NFT ${id}`} />
      </div>
      {title && <h3># {title}</h3>}
    </NavLink>
  );
};

export default NFTItem;
