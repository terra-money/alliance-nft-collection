import { createContext, useState, useEffect, ReactNode } from "react"
import { useConnectedWallet } from "@terra-money/wallet-kit"
import { SupportedNetwork } from "config"

interface IAppState {
  walletAddress: string | undefined
  chainId: SupportedNetwork
}

export const AppContext = createContext<IAppState>({} as IAppState)

/**
 *  Holds overall app state and provides update functions through hooks.
 *  For now transaction, wallet connection, and basic nft info is stored here.
 *  If app grows in complexity, consider splitting into multiple contexts.
 *  Depends on:
 *    - WalletProvider from @terra-money/wallet-kit
 */
const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | undefined>()
  const [chainId, setChainId] = useState<SupportedNetwork>("pisco-1")

  const connectedWallet = useConnectedWallet()

  // set wallet address on connection
  useEffect(() => {
    if (connectedWallet) {
      setWalletAddress(
        connectedWallet.addresses[
          connectedWallet.network === "mainnet" ? "phoenix-1" : "pisco-1"
        ]
      )
    }
  }, [connectedWallet])

  // set network on connection
  useEffect(() => {
    if (connectedWallet) {
      setChainId(
        connectedWallet.network === "mainnet" ? "phoenix-1" : "pisco-1"
      )
    }
  }, [connectedWallet])

  return (
    <AppContext.Provider value={{ walletAddress, chainId }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppStateProvider
