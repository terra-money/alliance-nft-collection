import React, { useState } from "react";
import classNames from "classnames/bind";
import { ReactComponent as SearchIcon } from "assets/Search.svg"
import { LoadingCircular } from "components";
import styles from "./SearchByID.module.scss";

const cx = classNames.bind(styles);

export const SearchByID = ({
  setSearchValue,
  searchValue,
  isLoading,
}: {
  setSearchValue: (value: string) => void;
  searchValue: string;
  isLoading: boolean;
}) => {
  const [currentSearchValue, setCurrentSearchValue] = useState(searchValue);
  const [focused, setFocused] = useState(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^\d+$/.test(inputValue)) {
      const intValue = parseInt(inputValue);
      if (intValue >= 0 && intValue <= 10000) {
        setCurrentSearchValue(inputValue);
      } else {
        setCurrentSearchValue("");
      }
    } else if (inputValue === "") {
      setCurrentSearchValue(inputValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setSearchValue(currentSearchValue);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    setSearchValue(currentSearchValue);
  }

  return (
    <div className={styles.search__container}>
      <div className={cx(styles.search__wrapper, { [styles.focused]: focused })}>
        <input
          className={styles.search__input}
          type="number"
          placeholder="Search by ID"
          onChange={handleSearch}
          value={currentSearchValue}
          onKeyDown={handleKeyPress}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          min="1"
          max="10000"
        />
        <button
          className={styles.search__button}
          onClick={() => setSearchValue(currentSearchValue)}
        >
          <SearchIcon fill="var(--token-dark-700)" height={16} width={16} />
        </button>
      </div>
      {isLoading && (
        <div className={styles.loading}>
          <LoadingCircular />
        </div>
      )}
    </div>
  );
};
