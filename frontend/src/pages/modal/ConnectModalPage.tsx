import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useWallet, useConnectedWallet } from "@terra-money/wallet-kit";
import { ReactComponent as Logo } from "assets/AllianceDAOLogo.svg";
import { AnimatedBackground } from "components/background/AnimatedBackground";
import styles from "./ModalPage.module.scss";

export const ConnectModalPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const connectedWallet = useConnectedWallet();
  const wallet = useWallet();

  const handleConnectClicked = () => {
    wallet.connect("station-extension");
    setLoading(true);
  }

  useEffect(() => {
    if (connectedWallet) {
      setLoading(false);

      const address = connectedWallet?.addresses["phoenix-1"];

      // Check if address has NFTs to claim
      const hasNFTsToClaim = (address: string) => {
        console.log("🚀 ~ file: ConnectModalPage.tsx:26 ~ hasNFTsToClaim ~ address:", address)
        return true;
      }

      // Check if address not eligible
      const notEligible = (address: string) => {
        console.log("🚀 ~ file: ConnectModalPage.tsx:30 ~ notEligible ~ address:", address)
        return false;
      }

      if (hasNFTsToClaim(address)) {
        navigate("/");
      } else if (notEligible(address)) {
        navigate("/not-eligible");
      } else {
        navigate("/nft-gallery");
      }
    }
  }, [connectedWallet, loading, navigate]);

  return (
    <div className={styles.full__page}>
      <AnimatedBackground />
      <div className={styles.modal}>
        <div className={styles.logo__wrapper}>
          <Logo className={styles.logo} />
        </div>
        <div className={styles.text}>
          <div className={styles.text}>
            You have 2 claimable Alliance DAO NFTs, click below to claim them
          </div>
        </div>
        <div className={styles.button__wrapper}>
          <button
            className={styles.primary__button}
            onClick={handleConnectClicked}
          >
            Connect with Station
          </button>
          <Link to="/nft-gallery">
            <button className={styles.secondary__button}>
              Cancel
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
