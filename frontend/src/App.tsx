import { useState } from "react"
import { useConnectedWallet } from "@terra-money/wallet-kit"
import classNames from "classnames/bind"
import Navigation from "./components/navigations/Navigation"
import { useNav } from "./config/routes"
import styles from "./App.module.scss"

const cx = classNames.bind(styles)

const App = () => {
  const connectedWallet = useConnectedWallet()
  const { element: routes } = useNav()
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div
      className={cx(styles.main__container, {
        [styles.mobile__nav__open]: isMobileNavOpen,
      })}
    >
      <Navigation
        isMobileNavOpen={isMobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />
      {connectedWallet && connectedWallet.network === "classic" ? (
        <>
          Classic is not supported. Please switch to "Mainnet" within Station
          Wallet.
        </>
      ) : (
        routes
      )}
    </div>
  )
}

export default App
