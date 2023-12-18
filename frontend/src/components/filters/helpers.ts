import { GalleryFiltersProps, CSVItem } from 'pages/nft/NFTs';

export const filterNFTs = (
  csvData: CSVItem[],
  nfts: string[],
  filters: GalleryFiltersProps
) => {
  const filteredNFTs = nfts.filter((nft) => {
    let match = true;

    // Filter by planetNumber, if it's set
    if (filters.planetNumber !== null) {
      // match = match && nft.id === filters.planetNumber;
    }

    if (filters.planetNames.length !== 0) {
      const nftPlanet = csvData[parseInt(nft)].attributes['Planet'];
      match = match && filters.planetNames.includes(nftPlanet);
    }

    // Filter by planetInhabitants, if it's set
    if (filters.planetInhabitants.length !== 0) {
      const nftInhabitants = csvData[parseInt(nft)].attributes['Inhabitant'];
      match = match && filters.planetInhabitants.includes(nftInhabitants);
    }

    // Filter by planetObjects, if it's set
    if (filters.nftObjects.length !== 0) {
      const nftObjects = csvData[parseInt(nft)].attributes['Object'];
      match = match && filters.nftObjects.includes(nftObjects);
    }

    return match;
  });

  return filteredNFTs;
}