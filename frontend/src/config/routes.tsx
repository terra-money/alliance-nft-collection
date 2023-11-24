import { useRoutes } from "react-router-dom"
import {
  LandingPage,
  NftGallery,
  NftView,
  HowItWorks,
  TheStory,
  NotFound,
} from "../pages"

export const useNav = () => {
  const menu = [
    { path: "/", element: <LandingPage />, name: "Home", isExternal: false },
    {
      path: "/nft-gallery",
      element: <NftGallery />,
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
      path: "https://dao.enterprise.money/daos",
      name: "Alliance DAO",
      isExternal: true,
    },
  ]

  const routes = [
    ...menu,
    {
      path: "/nft/:id",
      element: <NftView />,
      name: "NFT View",
      isExternal: false,
      isDynamic: true,
    },
    {
      path: "/planet/:planet_name",
      element: <NftView />,
      name: "Planet View",
      isExternal: false,
      isDynamic: true,
    },
    { path: "*", element: <NotFound /> },
  ]

  return { menu, element: useRoutes(routes) }
}
