import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { inhabitantOptions } from '../options';
import { GalleryFiltersProps } from 'pages/nft/NFTs';
import { ReactComponent as DropdownArrowIcon } from "assets/DropdownArrow.svg";
import { ReactComponent as CircleClearIcon } from "assets/CircleClear.svg";
import Checkbox from 'components/checkbox/checkbox';
import styles from './FilterDropdown.module.scss';

const cx = classNames.bind(styles);

export const InhabitantFilter = ({
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

  const [selectedInhabitants, setSelectedInhabitants] = useState<string[]>(galleryFilters.planetInhabitants || []);
  const inhabitantDropdownValue =
    selectedInhabitants.length ?
      selectedInhabitants.length === 1 ?
        selectedInhabitants[0] : `${selectedInhabitants.length} inhabitant selected`
      : "Select an inhabitant";

  useEffect(() => {
    setGalleryFilters({
      ...galleryFilters,
      planetInhabitants: selectedInhabitants,
    });
  }, [selectedInhabitants]);

  const handleInhabitantClick = (inhabitantsName: string) => {
    if (selectedInhabitants?.includes(inhabitantsName)) {
      setSelectedInhabitants(selectedInhabitants.filter(name => name !== inhabitantsName));
    } else {
      setSelectedInhabitants(selectedInhabitants ? [...selectedInhabitants, inhabitantsName] : [inhabitantsName]);
    }
  }

  const clearInhabitantFilters = () => {
    setGalleryFilters({
      ...galleryFilters,
      planetInhabitants: [],
    });
    setSelectedInhabitants([]);
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
            <span>{inhabitantDropdownValue}</span>
          </span>
          <DropdownArrowIcon className={styles.caret} fill="var(--token-dark-500)" />
        </button>
        {selectedInhabitants.length > 0 && (
          <div className={styles.clear__wrapper}>
            <button
              className={styles.clear}
              onClick={clearInhabitantFilters}
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
            {inhabitantOptions.map(inhabitant => (
              <Checkbox
                key={inhabitant}
                label={inhabitant}
                checked={selectedInhabitants?.includes(inhabitant)}
                onClick={() => handleInhabitantClick(inhabitant)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
