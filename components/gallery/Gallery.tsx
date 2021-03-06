import { useState, useEffect, ChangeEvent } from "react";

import styles from "./Gallery.module.scss";
import { Poster, SkeletonPoster } from "components/poster";

export function Gallery({ title, creator, movieList }) {
  const [filterValue, setFilterValue] = useState("");
  const [galleryList, setGalleryList] = useState(movieList);
  const [skeletons, setSkeletons] = useState(0);

  useEffect(() => {
    setSkeletons(loadSkeletons());
  }, []);

  useEffect(() => {
    if (filterValue.length === 0) {
      setGalleryList(movieList);
    } else {
      let tempList = [];
      movieList.forEach((movie) => {
        if (movie.title.toLowerCase().includes(filterValue.toLowerCase()))
          tempList = [...tempList, movie];
      });
      setGalleryList(tempList);
    }
  }, [filterValue, movieList]);

  const handleValue = (e: ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value);

  //Load skeleton posters while fetching list
  const loadSkeletons = () => {
    const numberOfSkeletons = localStorage.getItem(`${title}Skeletons`);
    if (numberOfSkeletons) return parseInt(numberOfSkeletons);
    return 0;
  };

  const placeholders = (n: number) => {
    let tempArray = [];
    for (let i = 0; i < n; i++) {
      tempArray.push(<SkeletonPoster key={i} />);
    }
    return tempArray;
  };

  return (
    <div id={styles.container}>
      <input
        id={styles.searchInput}
        type="text"
        placeholder="Search within list"
        value={filterValue}
        onChange={(e) => handleValue(e)}
      />
      <div id={styles.content}>
        {movieList.length === 0 && placeholders(skeletons).map((dummy) => dummy)}
        {galleryList.map((movie) => (
          <Poster key={movie.imdbID} {...{ movie, creator }} list={title} />
        ))}
      </div>
    </div>
  );
}
