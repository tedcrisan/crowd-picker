import { useState, useEffect } from "react";
import styled from "styled-components";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Poster } from "../movies/Poster";

export function Gallery({
  title,
  creator,
  removeMovie,
  switchList,
  toggleLike,
  toggleNeverWatched,
  movieList,
  initialHide = false,
}) {
  const [hide, setHide] = useState(initialHide);
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

  const toggleHide = () => setHide((prev) => !prev);
  const handleValue = (e) => setValue(e.target.value);

  return (
    <Container>
      <Header>
        <Title>{title}</Title>
        <VisibilityButton onClick={toggleHide}>
          {hide ? <FiChevronUp size="24px" /> : <FiChevronDown size="24px" />}
        </VisibilityButton>
      </Header>
      {!hide && (
        <>
          <SearchInput
            type="text"
            placeholder={`Search ${title}`}
            value={value}
            onChange={handleValue}
          />
          <Content className={hide ? "hide" : ""}>
            {galleryList.map((movie) => (
              <Poster
                key={movie.imdbID}
                {...{ movie, creator, removeMovie, switchList, toggleLike, toggleNeverWatched }}
                list={title}
              />
            ))}
          </Content>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1em;
  overflow-y: hidden;
`;

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1em 0;
  padding: 0.2em 1em;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
  background: white;
  z-index: 2;
`;

const Title = styled.h2`
  text-transform: capitalize;
  margin: 0;
`;

const Content = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
  gap: 1em;
`;

const SearchInput = styled.input`
  max-width: 20em;
  padding: 0.6em 1em;
  border: none;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
`;

const VisibilityButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.4em;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: lightgray;
  }
`;
