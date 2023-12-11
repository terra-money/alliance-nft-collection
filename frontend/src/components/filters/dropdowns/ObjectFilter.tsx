import { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import { objectOptions } from "../options";
import { GalleryFiltersProps } from "pages/nft/NFTs";
import { ReactComponent as DropdownArrowIcon } from "assets/DropdownArrow.svg";
import { ReactComponent as CircleClearIcon } from "assets/CircleClear.svg";
import { Checkbox } from "components";
import styles from "./FilterDropdown.module.scss";

const cx = classNames.bind(styles);

export const ObjectFilter = ({
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

  const [selectedObjects, setSelectedObjects] = useState<string[]>(galleryFilters.nftObjects || []);
  const objectDropdownValue =
    selectedObjects.length ?
      selectedObjects.length === 1 ?
        selectedObjects[0] : `${selectedObjects.length} objects selected`
      : "Select an object";

  useEffect(() => {
    setGalleryFilters({
      ...galleryFilters,
      nftObjects: selectedObjects,
    });
  }, [selectedObjects]);

  const handleObjectClick = (objectName: string) => {
    if (selectedObjects?.includes(objectName)) {
      setSelectedObjects(selectedObjects.filter(name => name !== objectName));
    } else {
      setSelectedObjects(selectedObjects ? [...selectedObjects, objectName] : [objectName]);
    }
  }

  const clearObjectFilters = () => {
    setGalleryFilters({
      ...galleryFilters,
      nftObjects: [],
    });
    setSelectedObjects([]);
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
            <span>{objectDropdownValue}</span>
          </span>
          <DropdownArrowIcon className={styles.caret} fill="var(--token-dark-500)" />
        </button>
        {selectedObjects.length > 0 && (
          <div className={styles.clear__wrapper}>
            <button
              className={styles.clear}
              onClick={clearObjectFilters}
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
            {objectOptions.map(nftObject => (
              <Checkbox
                key={nftObject}
                label={nftObject}
                checked={selectedObjects?.includes(nftObject)}
                onClick={() => handleObjectClick(nftObject)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
