import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { useSession } from "next-auth/client";
import useFetchBySearch from "../../src/utils/useFetchBySearch";
import { Search } from "../../src/components/search";
import { Movies } from "../../src/components/movies";
import { Gallery } from "../../src/components/movies/Gallery";
import { Poster } from "../../src/components/movies/Poster";
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

  return (
    <Container>
      <Search {...{ query, search, data, reset, addMovie, movieIDs }} />
      <Movies>
        <Gallery title="watched">
          {watched.map((movie) => (
            <Poster
              key={movie.imdbID}
              {...{ movie, creator, switchList, removeMovie }}
              list={"watched"}
            />
          ))}
        </Gallery>
        <Gallery title="unwatched">
          {unwatched.map((movie) => (
            <Poster
              key={movie.imdbID}
              {...{ movie, creator, removeMovie, switchList, toggleLike }}
              list={"unwatched"}
            />
          ))}
        </Gallery>
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
