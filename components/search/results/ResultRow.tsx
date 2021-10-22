import { FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

import styles from "./ResultRow.module.scss";

export function ResultRow({ movie, addMovie, movieIDs, session, reset }) {
  const inList = movieIDs.includes(movie.imdbID);
  const handleClick = () => {
    if (session) {
      addMovie(movie);
      reset();
    } else {
      toast.error("You need to be logged in to add to the list");
    }
  };

  return (
    <div className={styles.container}>
      <p>
        {movie.Title} ({movie.Year})
      </p>
      {inList ? (
        <button className={styles.alreadyInList}>
          <FiCheck size="24px" />
        </button>
      ) : (
        <button className={styles.add} onClick={handleClick}>
          <FiX size="24px" />
        </button>
      )}
    </div>
  );
}
