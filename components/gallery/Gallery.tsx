import { useState, useEffect, ChangeEvent } from "react";

import styles from "./Gallery.module.scss";
import { Poster } from "components/poster";

export function Gallery({ title, creator, movieList }) {
  const [value, setValue] = useState("");
  const [galleryList, setGalleryList] = useState(movieList);

  useEffect(() => {
    if (value.length === 0) {
      setGalleryList(movieList);
    } else {
      let tempList = [];
      movieList.forEach((movie) => {
        if (movie.title.toLowerCase().includes(value.toLowerCase()))
          tempList = [...tempList, movie];
      });
      setGalleryList(tempList);
    }
  }, [value, movieList]);

  const handleValue = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  return (
    <div id={styles.container}>
      <input
        id={styles.searchInput}
        type="text"
        placeholder="Search within list"
        value={value}
        onChange={(e) => handleValue(e)}
      />
      <div id={styles.content}>
        {galleryList.map((movie) => (
          <Poster key={movie.imdbID} {...{ movie, creator }} list={title} />
        ))}
      </div>
    </div>
  );
}
