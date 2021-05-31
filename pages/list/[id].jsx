import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { useSession } from "next-auth/client";
import useFetchBySearch from "../../src/utils/useFetchBySearch";
import { Search } from "../../src/components/search";
import { Movies } from "../../src/components/movies";
import { Gallery } from "../../src/components/movies/Gallery";
import { fetchList } from "../../src/utils/fetchList";

export default function List({ id }) {
  const [session, loading] = useSession();
  const [creator, setCreator] = useState(false);
  const [unwatched, setUnwatched] = useState([]);
  const [watched, setWatched] = useState([]);
  const [movieIDs, setMovieIDs] = useState([]);
  const { query, search, data, reset } = useFetchBySearch();

  useEffect(() => {
    if (id) {
      fetchList(id).then((list) => {
        if (list) {
          setCreator(list.creator);
          setUnwatched(list.unwatched);
          setWatched(list.watched);
        }
      });
    }
  }, []);

  useEffect(() => {
    //need to create array so search can see if movie is already in list
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
      .post(`/api/list/${id}`, {
        imdbID: movie.imdbID,
        movie_data: {
          title: movie.Title,
          image: movie.Poster,
          year: movie.Year,
        },
      })
      .then(({ data }) => setUnwatched((prev) => [...unwatched, data.payload]))
      .catch((err) => console.log(err));
  };

  const removeMovie = (movieID, movieWatched) => {
    axios
      .delete(`/api/list/${id}/${movieID}`)
      .then(({ data }) => {
        movieWatched
          ? setWatched((prev) => prev.filter(({ imdbID }) => imdbID !== movieID))
          : setUnwatched((prev) => prev.filter(({ imdbID }) => imdbID !== movieID));
      })
      .catch((err) => console.log(err));
  };

  const switchList = (movieID) => {
    axios
      .patch(`/api/list/${id}/${movieID}`, { action: "switch" })
      .then(({ data }) => {
        if (data.watched) {
          let movie = unwatched.find(({ imdbID }) => imdbID === movieID);
          movie.watched = data.watched;
          setUnwatched((prev) => prev.filter(({ imdbID }) => imdbID !== movieID));
          setWatched((prev) => [...prev, movie]);
        } else {
          const movie = watched.find(({ imdbID }) => imdbID === movieID);
          movie.watched = data.watched;
          setWatched((prev) => prev.filter(({ imdbID }) => imdbID !== movieID));
          setUnwatched((prev) => [...prev, movie]);
        }
      })
      .catch((err) => console.log(err));
  };

  const toggleLike = (movieID) => {
    //Only allow logged in users to like movie
    if (session) {
      axios
        .patch(`/api/list/${id}/${movieID}`, { action: "like" })
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

          setUnwatched(newUnwatched);
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("You need to be logged in to like a movie");
    }
  };

  const toggleNeverWatched = (movieID) => {
    //Only allow logged in users to mark movie never watched
    if (session) {
      axios
        .patch(`/api/list/${id}/${movieID}`, { action: "never_watched" })
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

          setUnwatched(newUnwatched);
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("You need to be logged in to like a movie");
    }
  };

  const sortByLikes = () => {
    const tempUnwatched = [...unwatched];
    const tempWatched = [...watched];
    const sortedUnwatched = tempUnwatched.sort(
      (first, second) => second.total_likes - first.total_likes
    );
    const sortedWatched = tempWatched.sort(
      (first, second) => second.total_likes - first.total_likes
    );
    setUnwatched(sortedUnwatched);
    setWatched(sortedWatched);
  };

  const sortByNeverWatched = () => {
    const tempUnwatched = [...unwatched];
    const tempWatched = [...watched];
    const sortedUnwatched = tempUnwatched.sort(
      (first, second) => second.total_nevers - first.total_nevers
    );
    const sortedWatched = tempWatched.sort(
      (first, second) => second.total_nevers - first.total_nevers
    );
    setUnwatched(sortedUnwatched);
    setWatched(sortedWatched);
  };

  const sortAlphabetically = () => {
    const tempUnwatched = [...unwatched];
    const tempWatched = [...watched];
    const sortedUnwatched = tempUnwatched.sort((first, second) => {
      if (first.title < second.title) return -1;
      if (first.title > second.title) return 1;
      return 0;
    });
    const sortedWatched = tempWatched.sort((first, second) => {
      if (first.title < second.title) return -1;
      if (first.title > second.title) return 1;
      return 0;
    });
    setUnwatched(sortedUnwatched);
    setWatched(sortedWatched);
  };

  const sortByDate = () => {
    const tempUnwatched = [...unwatched];
    const tempWatched = [...watched];
    const sortedUnwatched = tempUnwatched.sort(
      (first, second) => new Date(second.date) - new Date(first.date)
    );
    const sortedWatched = tempWatched.sort(
      (first, second) => new Date(second.date) - new Date(first.date)
    );
    setUnwatched(sortedUnwatched);
    setWatched(sortedWatched);
  };

  return (
    <Container>
      <Search {...{ query, search, data, reset, addMovie, movieIDs }} />
      <p>List ID: {id}</p>
      <Movies {...{ sortAlphabetically, sortByLikes, sortByDate, sortByNeverWatched }}>
        <Gallery
          title="unwatched"
          movieList={unwatched}
          {...{ creator, removeMovie, switchList, toggleLike, toggleNeverWatched }}
        />
        <Gallery
          title="watched"
          movieList={watched}
          initialHide={true}
          {...{ creator, removeMovie, switchList, toggleLike, toggleNeverWatched }}
        />
      </Movies>
    </Container>
  );
}

export function getServerSideProps(context) {
  return {
    props: { id: context.params.id },
  };
}

const Container = styled.div`
  padding: 6em 0;
`;
