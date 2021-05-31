import { useState } from "react";
import styled from "styled-components";
import { FaSortAlphaDown, FaSortNumericDownAlt } from "react-icons/fa";
import { FiList, FiGrid, FiCalendar } from "react-icons/fi";
import { HiOutlineEyeOff } from "react-icons/hi";

export function Movies({
  children,
  sortAlphabetically,
  sortByLikes,
  sortByDate,
  sortByNeverWatched,
}) {
  const [viewMode, setViewMode] = useState("gallery");

  const toggleView = () => (viewMode === "gallery" ? setViewMode("list") : setViewMode("gallery"));

  return (
    <Container>
      <ListHeader>
        <ViewButton onClick={sortByNeverWatched}>
          <HiOutlineEyeOff size="24px" title="Sort by never watched" />
        </ViewButton>
        <ViewButton onClick={sortByDate}>
          <FiCalendar size="24px" title="Sort by most recent" />
        </ViewButton>
        <ViewButton onClick={sortAlphabetically}>
          <FaSortAlphaDown size="24px" title="Sort Alphabetically" />
        </ViewButton>
        <ViewButton onClick={sortByLikes}>
          <FaSortNumericDownAlt size="24px" title="Sort by likes" />
        </ViewButton>
        <ViewButton onClick={toggleView}>
          {viewMode === "gallery" ? <FiList size="24px" /> : <FiGrid size="24px" />}
        </ViewButton>
      </ListHeader>
      {children}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const ListHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 1em;
  padding: 0.3em 0 1em 0;
`;

const ViewButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  padding: 0.6em;
  border: none;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
  cursor: pointer;

  &:hover {
    background: lightgray;
  }
`;
