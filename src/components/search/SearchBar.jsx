import styled from "styled-components";

export function SearchBar({ query, search }) {
  const handleChange = (e) => search(e.target.value);

  return (
    <Container>
      <Input
        type="text"
        placeholder="Search by movie title"
        value={query}
        onChange={handleChange}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  font-size: 1.3em;
  padding: 0.6em 1em;
  border: none;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
`;
