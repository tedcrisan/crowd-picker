import styled from "styled-components";
import { Header } from "components/header";

export function MainLayout({ children }) {
  return (
    <Container>
      <Header />
      <Content>{children}</Content>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const Content = styled.div`
  flex: 1;
`;
