import classNames from "classnames/bind"
import { NavLink, useLocation } from "react-router-dom"
import { useWallet } from "@terra-money/wallet-kit"
import { ReactComponent as Logo } from "assets/AllianceDAOLogo.svg"
import { ReactComponent as ExternalLinkIcon } from "assets/ExternalLink.svg"
import { ReactComponent as CheckIcon } from "assets/check.svg"
import { useAppContext } from "contexts"
import { useNav } from "../../../config/routes"
import { Socials } from '../socials'
import styles from "./DesktopNav.module.scss"

const cx = classNames.bind(styles)

const DesktopNav = () => {
  const wallet = useWallet()
  const { walletAddress } = useAppContext()
  const { pathname } = useLocation()
  const { menu } = useNav()

  const handleConnectClick = () => {
    if (walletAddress) {
      wallet.disconnect()
    } else {
      wallet.connect()
    }
  }

  return (
    <nav className={styles.navigation}>
      <a href="/nft-gallery">
        <Logo className={styles.logo} />
      </a>
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
              <NavLink to={path}>{name}</NavLink>
            </li>
          )
        })}
      </ul>
      <div className={styles.button__container}>
        <span
          className={cx({ [styles.active]: pathname === "/" })}
        >
          <NavLink to={"/"}>Claim</NavLink>
        </span>
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
        <Socials />
      </div>
    </nav>
  )
}

export default DesktopNav
