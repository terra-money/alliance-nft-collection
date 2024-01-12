import classNames from "classnames/bind"
import { NavLink, useLocation } from "react-router-dom"
import { useWallet } from "@terra-money/wallet-kit"
import { ReactComponent as Logo } from "assets/AllianceDAOLogo.svg"
import { ReactComponent as HamburgerIcon } from "assets/hamburger.svg"
import { ReactComponent as CloseIcon } from "assets/close.svg"
import { ReactComponent as CheckIcon } from "assets/check.svg"
import { ReactComponent as ExternalLinkIcon } from "assets/ExternalLink.svg"
import { useAppContext } from "contexts"
import { useNav } from "config/routes"
import styles from "./MobileNav.module.scss"
import { Socials } from "../socials"

const cx = classNames.bind(styles)

const MobileNav = ({
  isMobileNavOpen,
  setMobileNavOpen,
}: {
  isMobileNavOpen: boolean
  setMobileNavOpen: (isMobileNavOpen: boolean) => void
}) => {
  const wallet = useWallet()
  const { walletAddress } = useAppContext()
  const { pathname } = useLocation()
  const { menu } = useNav()

  const toggleMobileNav = () => {
    setMobileNavOpen(!isMobileNavOpen)
  }

  const handleConnectClick = () => {
    if (walletAddress) {
      wallet.disconnect()
    } else {
      wallet.connect()
    }
  }

  return (
    <>
      <nav className={styles.navigation}>
        <a href="/nft-gallery">
          <Logo className={styles.logo} />
        </a>

        <div className={styles.hamburger} onClick={toggleMobileNav}>
          <HamburgerIcon
            stroke="var(--token-dark-500)"
            height={24}
            width={24}
          />
        </div>
      </nav>
      <div
        className={cx(styles.cover, { [styles.open]: isMobileNavOpen })}
      ></div>
      <div
        className={`${styles.mobile__nav} ${
          isMobileNavOpen ? styles.open : ""
        }`}
      >
        <div
          className={styles.close__icon}
          onClick={() => setMobileNavOpen(false)}
        >
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
              <li
                key={path}
                className={cx({ [styles.active]: pathname === path })}
              >
                <NavLink to={path} onClick={toggleMobileNav}>
                  {name}
                </NavLink>
              </li>
            )
          })}
        </ul>
        <div className={styles.bottom}>
          <button onClick={handleConnectClick} className={styles.nav__button}>
            {walletAddress ? (
              <>
                <CheckIcon />
                Connected
              </>
            ) : (
              <>Connect Wallet</>
            )}
          </button>
          <Socials size={20} gap={24} iconColor="white" />
        </div>
      </div>
    </>
  )
}

export default MobileNav
