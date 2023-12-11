import classNames from 'classnames/bind';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ReactComponent as Logo } from 'assets/AllianceDAOLogo.svg';
import { ReactComponent as HamburgerIcon } from 'assets/hamburger.svg';
import { ReactComponent as CloseIcon } from 'assets/close.svg';
import { ReactComponent as CheckIcon } from 'assets/check.svg';
import { ReactComponent as ExternalLinkIcon } from 'assets/ExternalLink.svg';
import { ReactComponent as TwitterIcon } from 'assets/socials/Twitter.svg';
import { ReactComponent as MediumIcon } from 'assets/socials/Medium.svg';
import { ReactComponent as TelegramIcon } from 'assets/socials/Telegram.svg';
import { useNav } from 'config/routes';
import styles from './MobileNav.module.scss';

const cx = classNames.bind(styles);

const MobileNav = ({
  isMobileNavOpen,
  setMobileNavOpen,
}: {
  isMobileNavOpen: boolean,
  setMobileNavOpen: (isMobileNavOpen: boolean) => void
}) => {
  const socialSize = 20;

  const { pathname } = useLocation();
  const { menu } = useNav();

  const toggleMobileNav = () => {
    setMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <>
      <nav className={styles.navigation}>
        <a href='/nft-gallery'>
          <Logo className={styles.logo} />
        </a>

        <div className={styles.hamburger} onClick={toggleMobileNav}>
          <HamburgerIcon stroke="var(--token-dark-500)" height={24} width={24} />
        </div>
      </nav>
      <div className={cx(styles.cover, { [styles.open]: isMobileNavOpen })}></div>
      <div className={`${styles.mobile__nav} ${isMobileNavOpen ? styles.open : ''}`}>
        <div className={styles.close__icon} onClick={() => setMobileNavOpen(false)}>
          <CloseIcon stroke="var(--token-light-500)" height={24} width={24} />
        </div>
        <ul className={styles.link__container}>
          {menu.map(({ path, name, isExternal }) => {
            if (isExternal) {
              return (
                <li key={path}>
                  <a href={path} target="_blank" rel="noopener noreferrer">
                    {name}
                    <ExternalLinkIcon />
                  </a>
                </li>
              )
            }
            return (
              <li key={path} className={cx({ [styles.active]: pathname === path })}>
                <NavLink to={path} onClick={toggleMobileNav}>
                  {name}
                </NavLink>
              </li>
            )
          })}
        </ul>
        <div className={styles.bottom}>
          <Link to="/">
            <button className={styles.nav__button}>
              <CheckIcon />
              Connect Wallet
            </button>
          </Link>
          <div className={styles.socials}>
            <a href="https://twitter.com/AllianceDAO" target="_blank" rel="noopener noreferrer">
              <TwitterIcon fill='white' width={socialSize} height={socialSize} />
            </a>
            <a href="https://discord.gg/5QrSjPzY" target="_blank" rel="noopener noreferrer">
              <MediumIcon fill='white' width={socialSize + 1} height={socialSize + 1} />
            </a>
            <a href="https://t.me/alliancedao" target="_blank" rel="noopener noreferrer">
              <TelegramIcon fill='white' width={socialSize - 2} height={socialSize - 2} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
