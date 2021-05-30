import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useSession } from "next-auth/client";
import axios from "axios";

export function Selection() {
  const router = useRouter();
  const [session, loading] = useSession();
  const [listID, setListID] = useState("");

  const handleChange = (e) => setListID(e.target.value);
  const enterList = () => router.push(`/list/${listID}`);
  const createList = () => {
    //only someone who is logged in can create a list
    if (session) {
      axios
        .post("/api/list", { creator: session.user.email })
        .then(({ data }) => router.push(`/list/${data.id}`))
        .catch((err) => console.log(err));
    } else {
      toast.error("You need to be logged in to create a list");
    }
  };

  return (
    <Container>
      <Image src="/found.svg" alt="Random" width="260" height="260" />
      <Text>Already have a list ID?</Text>
      <ListInput>
        <Input type="text" placeholder="List Code" value={listID} onChange={handleChange} />
        <Enter onClick={enterList}>Enter</Enter>
      </ListInput>
      <Text>or</Text>
      <Text>Create a new list</Text>
      <CreateButton onClick={createList}>Create</CreateButton>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ListInput = styled.div``;

const Input = styled.input`
  font-size: 1.2em;
  padding: 0.5em 1em;
  margin-right: 1em;
  border: none;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
`;

const Enter = styled.button`
  font-size: 1.2em;
  padding: 0.5em 1.2em;
  color: hsl(210, 36%, 96%);
  background: hsl(209, 34%, 30%);
  border: none;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
  cursor: pointer;

  &:hover {
    background: hsl(209, 61%, 16%);
  }
`;

const Text = styled.p``;

const CreateButton = styled.button`
  font-size: 1.3em;
  padding: 0.6em 2em;
  color: hsl(210, 36%, 96%);
  background: hsl(209, 34%, 30%);
  border: none;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
  cursor: pointer;

  &:hover {
    background: hsl(209, 61%, 16%);
  }
`;
