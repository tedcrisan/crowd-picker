import styled from "styled-components";
import { toast } from "react-toastify";

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
    <Container>
      <p>
        {movie.Title} ({movie.Year})
      </p>
      {inList ? <AlreadyInList>In List</AlreadyInList> : <Add onClick={handleClick}>Add</Add>}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4em 1em;
  border-bottom: 1px solid lightgray;
  background: white;
`;

const Add = styled.button`
  font-size: 1.1em;
  padding: 0.5em 2em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: hsl(152, 68%, 96%);
  background: hsl(168, 80%, 23%);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
`;

const AlreadyInList = styled.button`
  font-size: 1.1em;
  padding: 0.5em 2em;
  border: none;
  border-radius: 5px;
  color: hsl(168, 80%, 23%);
  background: hsl(152, 68%, 96%);
`;
