import { useState } from "react";
import styled from "styled-components";
import { HiThumbUp, HiOutlineThumbUp, HiOutlineEyeOff, HiEyeOff } from "react-icons/hi";
import { SiImdb } from "react-icons/si";

export function Poster({
  movie,
  creator,
  removeMovie,
  switchList,
  list,
  toggleLike,
  toggleNeverWatched,
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Container>
      <Image src={movie.image} alt={movie.imdbID} />
      <Details>
        <div>{movie.title}</div>
        <div>{movie.year}</div>
        <ImdbButton
          onClick={() =>
            window.open(
              `https://www.imdb.com/title/${movie.imdbID}`,
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          <SiImdb size="24px" />
        </ImdbButton>
        {creator && (
          <>
            <RemoveContainer onClick={() => removeMovie(movie.imdbID, list === "watched")}>
              Remove
            </RemoveContainer>
            <SwitchContainer onClick={() => switchList(movie.imdbID)}>
              {movie.watched ? "Unwatch" : "Watched"}
            </SwitchContainer>
          </>
        )}
      </Details>
      {!movie.watched && (
        <BottomContainer>
          <NeverWatchedContainer onClick={() => toggleNeverWatched(movie.imdbID)}>
            <Likes>{movie.total_nevers}</Likes>
            {movie.user_never_watched ? <HiEyeOff size="18px" /> : <HiOutlineEyeOff size="18px" />}
          </NeverWatchedContainer>
          <LikesContainer onClick={() => toggleLike(movie.imdbID)}>
            <Likes>{movie.total_likes}</Likes>
            {movie.user_liked ? <HiThumbUp size="18px" /> : <HiOutlineThumbUp size="18px" />}
          </LikesContainer>
        </BottomContainer>
      )}
      {movie.watched && <WatchedContainer>Watched</WatchedContainer>}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  background: black;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
`;

const Image = styled.img`
  width: 100%;
  display: block;
`;

const Details = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 2;
  opacity: 0;
  padding: 0.5em;
  color: white;
  background: rgba(0, 0, 0, 0.8);
  font-size: 1em;

  &:hover {
    opacity: 1;
  }
`;

const ImdbButton = styled.button`
  width: min-content;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f5c518;
  background: transparent;
  padding: 0.4em;
  border: none;
  cursor: pointer;
`;

const SpanContainer = styled.span`
  width: min-content;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8em;
  margin: 0.5em;
  padding: 0.1em 0.9em 0.2em 0.9em;
  border-radius: 3em;
  cursor: pointer;
`;

const BottomContainer = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 3;
  padding: 1em;
`;

const LikesContainer = styled(SpanContainer)`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 4;
  color: hsl(168, 80%, 23%);
  background: hsl(154, 75%, 87%);

  &:hover {
    background: hsl(158, 58%, 62%);
  }
`;

const NeverWatchedContainer = styled(SpanContainer)`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 4;
  color: hsl(43, 77%, 27%);
  background: hsl(45, 86%, 81%);

  &:hover {
    background: hsl(43, 89%, 70%);
  }
`;

const WatchedContainer = styled(SpanContainer)`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 3;
  color: hsl(360, 85%, 25%);
  background: hsl(360, 82%, 89%);
`;

const RemoveContainer = styled(SpanContainer)`
  color: hsl(360, 85%, 25%);
  background: hsl(360, 82%, 89%);

  &:hover {
    background: hsl(360, 77%, 78%);
  }
`;

const SwitchContainer = styled(SpanContainer)`
  color: hsl(168, 80%, 23%);
  background: hsl(154, 75%, 87%);

  &:hover {
    background: hsl(158, 58%, 62%);
  }
`;

const Likes = styled.div`
  margin-right: 0.2em;
`;
