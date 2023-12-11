import { useRoutes } from "react-router-dom"
import { useAppContext } from "contexts"
import { contracts } from "config"
import {
  NFTsPage,
  NFTView,
  HowItWorks,
  TheStory,
  NotFound,
  PlanetView,
  ConnectModalPage,
  ClaimModalPage,
  NotEligibleModalPage,
} from "../pages"

export const useNav = () => {
  const { chainId } = useAppContext()
  const menu = [
    {
      path: "/",
      element: <ClaimModalPage />,
      name: "Claim",
      isExternal: false,
      isDynamic: false,
    },
    {
      path: "/nft-gallery",
      element: <NFTsPage />,
      name: "NFT Gallery",
      isExternal: false,
    },
    {
      path: "/how-it-works",
      element: <HowItWorks />,
      name: "How It Works",
      isExternal: false,
    },
    {
      path: "/the-story",
      element: <TheStory />,
      name: "The Story",
      isExternal: false,
    },
    {
      path: `https://dao.enterprise.money/dao/staking?address=${contracts[chainId].dao}`,
      name: "Staking",
      isExternal: true,
    },
  ]

  const routes = [
    ...menu,
    {
      path: "/nft/:id",
      element: <NFTView />,
      name: "NFT View",
      isExternal: false,
      isDynamic: true,
    },
    {
      path: "/planet/:id",
      element: <PlanetView />,
      name: "Planet View",
      isExternal: false,
      isDynamic: true,
    },
    {
      path: "/connect-wallet",
      element: <ConnectModalPage />,
      name: "Connect Wallet",
      isExternal: false,
      isDynamic: false,
    },
    {
      path: "/not-eligible",
      element: <NotEligibleModalPage />,
      name: "Not Eligible",
      isExternal: false,
      isDynamic: false,
    },
    { path: "*", element: <NotFound /> },
  ]

  return { menu, element: useRoutes(routes) }
}
