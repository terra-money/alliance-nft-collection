import { Link } from "react-router-dom";
import { ReactComponent as XIcon } from "assets/X.svg";
import { AnimatedBackground } from "components";
import styles from "./ModalPage.module.scss";

export const NotEligibleModalPage = () => {
  return (
    <div className={styles.full__page}>
      <AnimatedBackground />
      <div className={styles.modal}>
        <div className={styles.logo__wrapper}>
          <XIcon className={styles.check__icon} />
        </div>
        <div className={styles.text}>
          <div className={styles.text}>
            This wallet is not eligible for the Game Of Alliance airdrop. Follow <a href="https://twitter.com/The_AllianceDAO">@The_AllianceDAO</a> for opportunities to purchase an Alliance NFT.
          </div>
        </div>
        <div className={styles.button__wrapper}>
          <Link to="/nft-gallery" style={{ width: "100%" }}>
            <button className={styles.secondary__button}>
              View Full NFT Gallery
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
