import { createContext, useState, useEffect, ReactNode, useMemo } from "react"
import { useConnectedWallet } from "@terra-money/wallet-kit"
import { SupportedNetwork, contracts, AllianceContractConfig } from "config"
import { LCDClient } from "@terra-money/feather.js"

interface IAppState {
  walletAddress: string | undefined
  chainId: SupportedNetwork
  lcd: LCDClient
  contractAddresses: AllianceContractConfig
}

export const AppContext = createContext<IAppState>({} as IAppState)

const AppStateProvider = ({
  children,
  defaultNetwork = "pisco-1",
}: {
  children: ReactNode
  defaultNetwork: SupportedNetwork
}) => {
  const [walletAddress, setWalletAddress] = useState<string | undefined>()
  const [chainId, setChainId] = useState<SupportedNetwork>(defaultNetwork)
  const [contractAddresses, setContractAddresses] =
    useState<AllianceContractConfig>(contracts[defaultNetwork])
  const [lcd, setLCD] = useState<LCDClient>(
    LCDClient.fromDefaultConfig(
      defaultNetwork === "pisco-1" ? "testnet" : "mainnet"
    )
  )

  const connectedWallet = useConnectedWallet()

  const getChainIdFromNetwork = (network: "mainnet" | "testnet") =>
    network === "mainnet" ? "phoenix-1" : "pisco-1"

  useEffect(() => {
    if (connectedWallet) {
      const chainIdFromNetwork = getChainIdFromNetwork(
        connectedWallet.network as "testnet" | "mainnet"
      )

      setWalletAddress(connectedWallet.addresses?.[chainIdFromNetwork])
      setContractAddresses(contracts[chainIdFromNetwork])
      setChainId(chainIdFromNetwork)
      setLCD(
        LCDClient.fromDefaultConfig(
          connectedWallet.network as "testnet" | "mainnet"
        )
      )
    }
  }, [connectedWallet])

  const contextValue = useMemo(
    () => ({
      walletAddress,
      chainId,
      lcd,
      contractAddresses,
    }),
    [walletAddress, chainId, lcd, contractAddresses]
  )

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}

export default AppStateProvider
