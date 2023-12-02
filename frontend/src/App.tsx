import { NavLink } from "react-router-dom"
import { useNav } from "./config/routes"

function Menu() {
  const { menu } = useNav()
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {menu.map(({ path, name, isExternal }) => {
        if (isExternal) {
          return (
            <a href={path} key={path} target="_blank" rel="noopener noreferrer">
              {name}
            </a>
          )
        }
        return (
          <NavLink to={path} key={path}>
            {name}
          </NavLink>
        )
      })}
    </div>
  )
}

function App() {
  const { element: routes } = useNav()
  return (
    <div>
      <Menu />
      {routes}
    </div>
  )
}

export default App
