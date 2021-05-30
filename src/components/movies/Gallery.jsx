import { useState } from "react";
import styled from "styled-components";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export function Gallery({ title, children }) {
  const [hide, setHide] = useState(false);

  const toggleHide = () => setHide((prev) => !prev);

  return (
    <Container>
      <Header>
        <Title>{title}</Title>
        <VisibilityButton onClick={toggleHide}>
          {hide ? <FiChevronUp size="24px" /> : <FiChevronDown size="24px" />}
        </VisibilityButton>
      </Header>
      {!hide && <Content className={hide ? "hide" : ""}>{children}</Content>}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
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
