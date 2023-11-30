import { ReactComponent as Logo } from 'assets/AllianceDAOLogo.svg'
import { ReactComponent as HamburgerIcon } from 'assets/hamburger.svg'
import { ReactComponent as CloseIcon } from 'assets/close.svg'
import { ReactComponent as CheckIcon } from 'assets/check.svg'
import styles from './MobileNav.module.scss';

const MobileNav = ({
  isMobileNavOpen,
  setMobileNavOpen,
}: {
  isMobileNavOpen: boolean,
  setMobileNavOpen: (isMobileNavOpen: boolean) => void
}) => {

  const toggleMobileNav = () => {
    setMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <>
      <nav className={styles.navigation}>
        <a href='/'>
          <Logo className={styles.logo} />
        </a>

        {/* Hamburger icon */}
        <div className={styles.hamburger} onClick={toggleMobileNav}>
          <HamburgerIcon stroke="var(--token-dark-500)" height={24} width={24} />
        </div>
      </nav>
      <div className={`${styles.cover} ${isMobileNavOpen ? styles.open : ''}`}></div>
      <div className={`${styles.mobile__nav} ${isMobileNavOpen ? styles.open : ''}`}>
        <div className={styles.close__icon} onClick={() => setMobileNavOpen(false)}>
          <CloseIcon stroke="var(--token-light-500)" height={24} width={24} />
        </div>
        <ul className={styles.link__container}>
          <li>
            <a href='/'>NFT Gallery</a>
          </li>
          <li>
            <a href='/'>How It Works</a>
          </li>
          <li>
            <a href='/'>The Story</a>
          </li>
          <li>
            <a href='/'>Alliance DAO Staking</a>
          </li>
        </ul>
        <button
          className={styles.nav__button}
        >
          <CheckIcon />
          Connect Wallet
        </button>
      </div>
    </>
  );
};

export default MobileNav;
