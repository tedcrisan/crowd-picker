import { useState } from "react";
import styled from "styled-components";
import { FiList, FiGrid } from "react-icons/fi";
import { useSession } from "next-auth/client";

export function Movies({ children }) {
  const [session, loading] = useSession();
  const [viewMode, setViewMode] = useState("gallery");

  const toggleView = () => (viewMode === "gallery" ? setViewMode("list") : setViewMode("gallery"));

  return (
    <Container>
      <ListHeader>
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
  padding: 0.3em 0 1em 0;
`;

const ViewButton = styled.button`
  background: white;
  border: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
  cursor: pointer;

  &:hover {
    background: lightgray;
  }
`;
