import { PlanetFilter } from "./PlanetFilter";
import { InhabitantFilter } from "./InhabitantFilter";
import { ObjectFilter } from "./ObjectFilter";
import { GalleryFiltersProps } from "pages/nft/NFTs";
import styles from "./FilterDropdown.module.scss";

export const FilterDropdowns = ({
  galleryFilters,
  setGalleryFilters,
}: {
  galleryFilters: GalleryFiltersProps
  setGalleryFilters: ({
    planetNumber,
    planetNames,
    planetInhabitants,
    nftObjects
  }: GalleryFiltersProps) => void,
}) => {
  return (
    <div className={styles.filter__row}>
      <PlanetFilter
        setGalleryFilters={setGalleryFilters}
        galleryFilters={galleryFilters}
      />
      <InhabitantFilter
        setGalleryFilters={setGalleryFilters}
        galleryFilters={galleryFilters}
      />
      <ObjectFilter
        setGalleryFilters={setGalleryFilters}
        galleryFilters={galleryFilters}
      />
    </div>
  );
};
