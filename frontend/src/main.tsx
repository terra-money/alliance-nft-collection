import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { getInitialConfig, WalletProvider } from "@terra-money/wallet-kit"
import App from "./App.tsx"
import "styles/index.scss"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

getInitialConfig().then((defaultNetworks) => {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <WalletProvider defaultNetworks={defaultNetworks}>
          <App />
        </WalletProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
})
