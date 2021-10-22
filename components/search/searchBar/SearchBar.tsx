import { ChangeEvent } from "react";
import { FiSearch } from "react-icons/fi";

import styles from "./SearchBar.module.scss";

export function SearchBar({ query, search }) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => search(e.target.value);

  return (
    <div id={styles.container}>
      <span id={styles.searchIcon}>
        <FiSearch size="18px" />
      </span>
      <input
        id={styles.input}
        type="text"
        placeholder="Search movie title"
        value={query}
        onChange={handleChange}
      />
    </div>
  );
}
