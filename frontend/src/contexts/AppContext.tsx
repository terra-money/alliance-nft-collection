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

  const getChainIdFromNetwork = (network: string) =>
    network === "testnet" ? "pisco-1" : "phoenix-1"

  useEffect(() => {
    let network: "mainnet" | "testnet" = "mainnet"
    if (connectedWallet && connectedWallet.network) {
      network = connectedWallet.network === "mainnet" ? "mainnet" : "testnet"
      const chainIdFromNetwork = getChainIdFromNetwork(network)

      setWalletAddress(connectedWallet.addresses?.[chainIdFromNetwork])
      setContractAddresses(contracts[chainIdFromNetwork])
      setChainId(chainIdFromNetwork)
      setLCD(LCDClient.fromDefaultConfig(network))
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
