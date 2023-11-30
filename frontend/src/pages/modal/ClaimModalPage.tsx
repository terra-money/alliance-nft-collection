import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfettiExplosion from 'react-confetti-explosion';
import { ReactComponent as Logo } from 'assets/AllianceDAOLogo.svg';
import { ReactComponent as CheckIcon } from 'assets/check.svg'
import { AnimatedBackground } from 'components/background/AnimatedBackground';
import styles from './ConnectModalPage.module.scss';

export const ClaimModalPage = () => {
  const [claimStatus, setClaimStatus] = useState<'notClaimed' | 'claimed' | 'error'>('notClaimed');

  if (claimStatus === 'claimed') {
    return (
      <div className={styles.full__page}>
        <AnimatedBackground />
        <ConfettiExplosion
          force={0.85}
          duration={2500}
          particleCount={80}
          width={1200}
          height={1200}
          colors={[
            '#3AB44C',
            '#EC5B25',
            '#E9AD5F',
            '#03AEEE',
            '#06E2D2',
            '#2F3288',
            '#912A8F',
            '#D7DE26',
            '#D91F5E',
          ]}
          className={styles.confetti}
        />
        <div className={styles.modal}>
          <div className={styles.logo__wrapper}>
            <CheckIcon className={styles.check__icon} fill='var(--token-primary-500)' />
          </div>
          <div className={styles.text}>
            <div className={styles.text}>
              You claimed 2 Alliance DAO NFTs!
            </div>
          </div>
          <div className={styles.button__wrapper}>
            <Link to='/' style={{ width: "100%" }}>
              <button className={styles.primary__button}>Done</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleClaimClicked = () => {
    setTimeout(() => {
      setClaimStatus('claimed');
    }, 1000);
  }

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
            onClick={handleClaimClicked}
          >
            Claim NFTs
          </button>

          <Link to='/' style={{ width: "100%" }}>
            <button
              className={styles.secondary__button}
            >
              Cancel
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};