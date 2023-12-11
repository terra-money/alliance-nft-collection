import { NFTType } from "fakeData/mockNFTs";
import { GalleryFiltersProps } from "pages/nft/NFTs";

export const filterNFTs = (
  nfts: NFTType[],
  filters: GalleryFiltersProps
) => {
  return nfts.filter((nft) => {
    let match = true;

    // Filter by planetNumber, if it's set
    if (filters.planetNumber !== null) {
      match = match && nft.id === filters.planetNumber;
    }

    if (filters.planetNames.length !== 0) {
      match = match && filters.planetNames.includes(nft.planet);
    }

    // Filter by planetInhabitants, if it's set
    if (filters.planetInhabitants.length !== 0) {
      match = match && filters.planetInhabitants.includes(nft.character);
    }

    // Filter by planetObjects, if it's set
    if (filters.nftObjects.length !== 0) {
      match = match && filters.nftObjects.includes(nft.object);
    }

    return match;
  });
}