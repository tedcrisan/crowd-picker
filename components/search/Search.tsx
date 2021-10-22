import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import axios from "axios";

import styles from "./Search.module.scss";
import { SearchBar } from "./searchBar/SearchBar";
import { Results } from "./results/Results";
import { ResultRow } from "./results/ResultRow";
import useClickOutside from "utils/useClickOutside";
import useFetchBySearch from "utils/useFetchBySearch";
import { useData } from "state/data-context";

export function Search() {
  const [session, loading] = useSession();
  const { listId, unwatched, setUnwatchedList, watched } = useData();
  const { query, search, data, reset } = useFetchBySearch();
  const [ref, isVisible, setIsVisible] = useClickOutside(false);
  const [movieIDs, setMovieIDs] = useState([]);

  useEffect(() => {
    //create an array of imdb ids so search can see if movie is already in list
    const unwatchedIDs = unwatched.map((movie) => {
      return movie.imdbID;
    });
    const watchedIDs = watched.map((movie) => {
      return movie.imdbID;
    });
    setMovieIDs([...unwatchedIDs, ...watchedIDs]);
  }, [unwatched, watched]);

  const addMovie = (movie) => {
    axios
      .post(`/api/list/${listId}`, {
        imdbID: movie.imdbID,
        movie_data: {
          title: movie.Title,
          image: movie.Poster,
          year: movie.Year,
        },
      })
      .then(({ data }) => setUnwatchedList((prev) => [...unwatched, data.payload]))
      .catch((err) => console.log(err));
  };

  return (
    <div id={styles.container} ref={ref} onClick={() => setIsVisible(true)}>
      <SearchBar {...{ query, search }} />
      {isVisible && (
        <Results>
          {data.map((movie) => (
            <ResultRow key={movie.imdbID} {...{ movie, addMovie, movieIDs, session, reset }} />
          ))}
        </Results>
      )}
    </div>
  );
}
