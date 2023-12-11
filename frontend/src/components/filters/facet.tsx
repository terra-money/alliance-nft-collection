/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react';
import styles from './facet.module.scss';
import { planetOptions, inhabitantOptions, objectOptions } from './options';
import { GalleryFiltersProps } from 'pages/nft/NFTs';

export const Facet = ({
  galleryFilters,
  setGalleryFilters,
  displayFacet,
}: {
  galleryFilters: GalleryFiltersProps
  setGalleryFilters: ({
    planetNumber,
    planetNames,
    planetInhabitants,
    nftObjects
  }: GalleryFiltersProps) => void,
  displayFacet: boolean,
}) => {
  const [selectedPlanets, setSelectedPlanets] = useState<string[]>([]);
  const [selectedInhabitants, setSelectedInhabitants] = useState<string[]>([]);
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);

  useEffect(() => {
    setGalleryFilters({
      ...galleryFilters,
      planetNames: selectedPlanets,
      planetInhabitants: selectedInhabitants,
      nftObjects: selectedObjects,
    });
  }, [selectedPlanets, selectedInhabitants, selectedObjects]);

  const clearFilters = () => {
    setGalleryFilters({
      planetNumber: null,
      planetNames: [],
      planetInhabitants: [],
      nftObjects: [],
    });
    setSelectedPlanets([]);
    setSelectedInhabitants([]);
    setSelectedObjects([]);
  };

  const handlePlanetClick = (planetName: string) => {
    if (selectedPlanets?.includes(planetName)) {
      setSelectedPlanets(selectedPlanets.filter(name => name !== planetName));
    } else {
      setSelectedPlanets(selectedPlanets ? [...selectedPlanets, planetName] : [planetName]);
    }
  }

  const handleInhabitantClick = (inhabitant: string) => {
    if (selectedInhabitants?.includes(inhabitant)) {
      setSelectedInhabitants(selectedInhabitants.filter(name => name !== inhabitant));
    } else {
      setSelectedInhabitants(selectedInhabitants ? [...selectedInhabitants, inhabitant] : [inhabitant]);
    }
  }

  const handleObjectClick = (object: string) => {
    if (selectedObjects?.includes(object)) {
      setSelectedObjects(selectedObjects.filter(name => name !== object));
    } else {
      setSelectedObjects(selectedObjects ? [...selectedObjects, object] : [object]);
    }
  }

  return (
    <div className={`${styles.facet} ${displayFacet ? styles.open : styles.closed}`}>
      <div className={styles.facet__header}>
        <div className={styles.facet__title}>
          <h3>Gallery Filters</h3>
        </div>
        <div className={styles.facet__clear}>
          <button className={styles.clear__button} onClick={clearFilters}>Clear</button>
        </div>
      </div>
      <div className={styles.facet__body}>
        <div className={styles.filter__section}>
          <div className={styles.filter__section__header}>
            <h4>Planet Type</h4>
          </div>
          <div className={styles.filter__section__body}>
            {planetOptions.map(planet => (
              <div className={styles.facet__item}>
                {/* <div className={styles.facet__item__checkbox}> */}
                  <input
                    type="checkbox"
                    onClick={() => handlePlanetClick(planet)}
                    checked={selectedPlanets?.includes(planet)}
                  />
                {/* </div> */}
                <div className={styles.facet__item__name}>
                  <span>{planet}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.filter__section}>
          <div className={styles.filter__section__header}>
            <h4>Inhabitants</h4>
          </div>
          <div className={styles.filter__section__body}>
            {inhabitantOptions.map(inhabitant => (
              <div className={styles.facet__item}>
                <div className={styles.facet__item__checkbox}>
                  <input
                    type="checkbox"
                    onClick={() => handleInhabitantClick(inhabitant)}
                    checked={selectedInhabitants?.includes(inhabitant)}
                  />
                </div>
                <div className={styles.facet__item__name}>
                  <span>{inhabitant}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.filter__section}>
          <div className={styles.filter__section__header}>
            <h4>Objects</h4>
          </div>
          <div className={styles.filter__section__body}>
            {objectOptions.map(nftObject => (
              <div className={styles.facet__item}>
                <div className={styles.facet__item__checkbox}>
                  <input
                    type="checkbox"
                    onClick={() => handleObjectClick(nftObject)}
                    checked={selectedObjects?.includes(nftObject)}
                  />
                </div>
                <div className={styles.facet__item__name}>
                  <span>{nftObject}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
