import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { getInitialConfig, WalletProvider } from "@terra-money/wallet-kit"
import { AppProvider } from "contexts/index.ts"
import App from "./App.tsx"
import "styles/index.scss"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

getInitialConfig().then((defaultNetworks) => {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <WalletProvider defaultNetworks={defaultNetworks}>
          <QueryClientProvider client={new QueryClient()}>
            <AppProvider defaultNetwork="phoenix-1">
              <App />
            </AppProvider>
          </QueryClientProvider>
        </WalletProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
})
