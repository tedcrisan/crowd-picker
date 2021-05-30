import styled from "styled-components";

export function Results({ children }) {
  return <Container>{children}</Container>;
}

const Container = styled.div`
  position: absolute;
  top: 4em;
  left: 0;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 10;
`;
