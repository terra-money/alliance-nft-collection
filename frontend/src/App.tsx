import { useNav } from "./config/routes"
import HowItWorks from "./content/HowItWorks.mdx"

function App() {
  const { element: routes } = useNav()
  return (
    <div>
      allroutes:{routes}
      <div
        style={{
          margin: "0 auto",
          width: 800,
          border: "2px solid grey",
          padding: 8,
        }}
      >
        <HowItWorks />
      </div>
    </div>
  )
}

export default App
