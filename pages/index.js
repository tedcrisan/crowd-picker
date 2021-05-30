import styled from "styled-components";
import { Selection } from "../src/components/Selection";

export default function Home() {
  return (
    <Container>
      <Selection />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
