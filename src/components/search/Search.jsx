import styled from "styled-components";
import { useSession } from "next-auth/client";
import { SearchBar } from "./SearchBar";
import { Results } from "./Results";
import { ResultRow } from "./ResultRow";
import useClickOutside from "../../utils/useClickOutside";

export function Search({ query, search, data, reset, addMovie, movieIDs }) {
  const [session, loading] = useSession();
  const [ref, isVisible, setIsVisible] = useClickOutside(false);
  return (
    <Container ref={ref} onClick={() => setIsVisible(true)}>
      <SearchBar {...{ query, search }} />
      {isVisible && (
        <Results>
          {data.map((movie) => (
            <ResultRow key={movie.imdbID} {...{ movie, addMovie, movieIDs, session, reset }} />
          ))}
        </Results>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  max-width: 30em;
`;
