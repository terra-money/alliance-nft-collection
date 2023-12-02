import { useState } from "react"
import classNames from "classnames/bind"
import Navigation from "./components/navigations/Navigation"
import { useNav } from "./config/routes"
import styles from "./App.module.scss"
import { useLocation } from "react-router-dom"

const cx = classNames.bind(styles)

function App() {
  const { pathname } = useLocation()
  const { element: routes } = useNav()
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div
      className={cx(styles.main__container, {
        [styles.mobile__nav__open]: isMobileNavOpen,
      })}
    >
      {pathname !== "/connect-wallet" &&
        pathname !== "/claim" &&
        pathname !== "/not-eligible" && (
          <Navigation
            isMobileNavOpen={isMobileNavOpen}
            setMobileNavOpen={setMobileNavOpen}
          />
        )}
      {routes}
    </div>
  )
}

export default App
