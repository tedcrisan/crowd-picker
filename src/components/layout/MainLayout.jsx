import styled from "styled-components";
import { Header } from "../Header";

export function MainLayout({ children }) {
  return (
    <Container>
      <Header />
      <Content>{children}</Content>
    </Container>
  );
}

const Container = styled.div`
  max-width: 1400px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 0 1em;
`;

const Content = styled.div`
  flex: 1;
`;
