import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { planetOptions } from '../options';
import { GalleryFiltersProps } from 'pages/nft/NFTs';
import { ReactComponent as DropdownArrowIcon } from "assets/DropdownArrow.svg";
import { ReactComponent as CircleClearIcon } from "assets/CircleClear.svg";
import Checkbox from 'components/checkbox/checkbox';
import styles from './FilterDropdown.module.scss';

const cx = classNames.bind(styles);

export const PlanetFilter = ({
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
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpen(false)
    }
  }

  const [selectedPlanets, setSelectedPlanets] = useState<string[]>(galleryFilters.planetNames || []);
  const planetDropdownValue =
    selectedPlanets.length ?
      selectedPlanets.length === 1 ?
        selectedPlanets[0] : `${selectedPlanets.length} planets selected`
      : "Select a planet";

  useEffect(() => {
    setGalleryFilters({
      ...galleryFilters,
      planetNames: selectedPlanets,
    });
  }, [selectedPlanets]);

  const handlePlanetClick = (planetName: string) => {
    if (selectedPlanets?.includes(planetName)) {
      setSelectedPlanets(selectedPlanets.filter(name => name !== planetName));
    } else {
      setSelectedPlanets(selectedPlanets ? [...selectedPlanets, planetName] : [planetName]);
    }
  }

  const clearPlanetFilters = () => {
    setGalleryFilters({
      ...galleryFilters,
      planetNames: [],
    });
    setSelectedPlanets([]);
  }

  return (
    <div className={styles.filter__dropdown__container} ref={ref}>
      <div className={styles.selector__wrapper}>
        <button
          type="button"
          className={cx(styles.selector, { open })}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpen((o) => !o)
          }}
        >
          <span className={styles.selected__wrapper}>
            <span>{planetDropdownValue}</span>
          </span>
          <DropdownArrowIcon className={styles.caret} fill="var(--token-dark-500)" />
        </button>
        {selectedPlanets.length > 0 && (
          <div className={styles.clear__wrapper}>
            <button
              className={styles.clear}
              onClick={clearPlanetFilters}
            >
              <CircleClearIcon
                fill={"transparent"}
                stroke={"var(--token-dark-500)"}
                width={18}
                height={18}
              />
            </button>
          </div>
        )}
      </div>
      {open && (
        <div className={cx(styles.options)}>
          <div className={cx(styles.options__container)}>
            {planetOptions.map(planet => (
              <Checkbox
                key={planet}
                label={planet}
                checked={selectedPlanets?.includes(planet)}
                onClick={() => handlePlanetClick(planet)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
