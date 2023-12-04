import { createContext, useState, useEffect, ReactNode } from "react"
import { useWallet, useConnectedWallet } from "@terra-money/wallet-kit"

interface IAppState {
  walletAddress: string | undefined
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

  const wallet = useWallet()
  const connectedWallet = useConnectedWallet()

  useEffect(() => {
    if (wallet.status === "connected" && connectedWallet) {
      setWalletAddress(connectedWallet.addresses[0])
    }
  }, [connectedWallet, wallet.status])

  return (
    <AppContext.Provider value={{ walletAddress }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppStateProvider
