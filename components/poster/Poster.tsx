import axios from "axios";
import { useSession } from "next-auth/client";
import { toast } from "react-toastify";
import { HiThumbUp, HiOutlineThumbUp } from "react-icons/hi";
import { IoEyeOffOutline, IoEyeOffSharp } from "react-icons/io5";
import { FaImdb } from "react-icons/fa";

import styles from "./Poster.module.scss";
import { useData } from "state/data-context";

type Movie = {
  date: string;
  image: string;
  imdbID: string;
  title: string;
  total_likes: number;
  total_nevers: number;
  user_liked: boolean;
  user_never_watched: boolean;
  watched: boolean;
  year: string;
};

type PosterProps = {
  movie: Movie;
  creator: string;
  list: string;
};

export function Poster({ movie, creator, list }: PosterProps) {
  const [session, loading] = useSession();
  const { listId, unwatched, setUnwatchedList, watched, setWatchedList } = useData();

  const removeMovie = (movieID, movieWatched) => {
    axios
      .delete(`/api/list/${listId}/${movieID}`)
      .then(({ data }) => {
        movieWatched
          ? setWatchedList((prev) => prev.filter(({ imdbID }) => imdbID !== movieID))
          : setUnwatchedList((prev) => prev.filter(({ imdbID }) => imdbID !== movieID));
      })
      .catch((err) => console.log(err));
  };

  const switchList = (movieID: string) => {
    axios
      .patch(`/api/list/${listId}/${movieID}`, { action: "switch" })
      .then(({ data }) => {
        if (data.watched) {
          let movie = unwatched.find(({ imdbID }) => imdbID === movieID);
          movie.watched = data.watched;
          setUnwatchedList((prev) => prev.filter(({ imdbID }) => imdbID !== movieID));
          setWatchedList((prev) => [...prev, movie]);
        } else {
          const movie = watched.find(({ imdbID }) => imdbID === movieID);
          movie.watched = data.watched;
          setWatchedList((prev) => prev.filter(({ imdbID }) => imdbID !== movieID));
          setUnwatchedList((prev) => [...prev, movie]);
        }
      })
      .catch((err) => console.log(err));
  };

  const toggleLike = (movieID: string) => {
    //Only allow logged in users to like movie
    if (session) {
      axios
        .patch(`/api/list/${listId}/${movieID}`, { action: "like" })
        .then(({ data }) => {
          const newUnwatched = unwatched.map((movie) => {
            if (movie.imdbID === movieID) {
              return {
                ...movie,
                total_likes: data.payload.total_likes,
                user_liked: data.payload.user_liked,
              };
            } else {
              return movie;
            }
          });

          setUnwatchedList(newUnwatched);
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("You need to be logged in to like a movie");
    }
  };

  const toggleNeverWatched = (movieID: string) => {
    //Only allow logged in users to mark movie never watched
    if (session) {
      axios
        .patch(`/api/list/${listId}/${movieID}`, { action: "never_watched" })
        .then(({ data }) => {
          const newUnwatched = unwatched.map((movie) => {
            if (movie.imdbID === movieID) {
              return {
                ...movie,
                total_nevers: data.payload.total_nevers,
                user_never_watched: data.payload.user_never_watched,
              };
            } else {
              return movie;
            }
          });

          setUnwatchedList(newUnwatched);
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("You need to be logged in to like a movie");
    }
  };

  return (
    <div className={styles.container}>
      <img className={styles.moviePoster} src={movie.image} alt={movie.imdbID} />
      <div className={styles.details}>
        <div>{movie.title}</div>
        <div>{movie.year}</div>
        <button
          className={styles.imdbButton}
          onClick={() =>
            window.open(
              `https://www.imdb.com/title/${movie.imdbID}`,
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          <FaImdb size="24px" />
        </button>
        {creator && (
          <>
            <span
              className={styles.removeContainer}
              onClick={() => removeMovie(movie.imdbID, list === "watched")}
            >
              Remove
            </span>
            <span className={styles.switchContainer} onClick={() => switchList(movie.imdbID)}>
              {movie.watched ? "Unwatch" : "Watched"}
            </span>
          </>
        )}
      </div>
      {!movie.watched && (
        <div className={styles.bottomContainer}>
          <span
            className={styles.neverWatchedContainer}
            onClick={() => toggleNeverWatched(movie.imdbID)}
          >
            <span className={styles.votes}>{movie.total_nevers}</span>
            {movie.user_never_watched ? (
              <IoEyeOffSharp size="18px" />
            ) : (
              <IoEyeOffOutline size="18px" />
            )}
          </span>
          <span className={styles.likesContainer} onClick={() => toggleLike(movie.imdbID)}>
            <span className={styles.votes}>{movie.total_likes}</span>
            {movie.user_liked ? <HiThumbUp size="18px" /> : <HiOutlineThumbUp size="18px" />}
          </span>
        </div>
      )}
      {movie.watched && <span className={styles.watchedContainer}>Watched</span>}
    </div>
  );
}
