import classNames from "classnames/bind"
import { NavLink, useLocation } from "react-router-dom"
import { useWallet } from "@terra-money/wallet-kit"
import { useAppContext } from "contexts"
import { ReactComponent as Logo } from "assets/AllianceDAOLogo.svg"
import { ReactComponent as CheckIcon } from "assets/check.svg"
import { useNav } from "../../../config/routes"
import styles from "./DesktopNav.module.scss"

const cx = classNames.bind(styles)

const DesktopNav = () => {
  const { walletAddress } = useAppContext()
  const wallet = useWallet()
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
      <a href="/">
        <Logo className={styles.logo} />
      </a>
      <ul className={styles.link__container}>
        {menu.map(({ path, name, isExternal }) => {
          if (isExternal) {
            return (
              <li key={path}>
                <a href={path} target="_blank" rel="noopener noreferrer">
                  {name}
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
      <button className={styles.nav__button} onClick={handleConnectClick}>
        {walletAddress ? (
          <>
            <CheckIcon />
            Wallet Connected
          </>
        ) : (
          <>Connect Wallet</>
        )}
      </button>
    </nav>
  )
}

export default DesktopNav
