import { useState } from "react"
import classNames from "classnames/bind"
import Navigation from "./components/navigations/Navigation"
import { useNav } from "./config/routes"
import styles from "./App.module.scss"

const cx = classNames.bind(styles)

const App = () => {
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
      {routes}
    </div>
  )
}

export default App
