import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useSession } from "next-auth/client";
import axios from "axios";

import styles from "./Selection.module.scss";

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
    <div id={styles.container}>
      <Image src="/found.svg" alt="Random" width="260" height="260" />
      <p>Already have a list ID?</p>
      <div>
        <input
          id={styles.input}
          type="text"
          placeholder="List ID"
          value={listID}
          onChange={handleChange}
        />
        <button id={styles.enter} onClick={enterList}>
          Enter
        </button>
      </div>
      <p>or</p>
      <p>Create a new list</p>
      <button id={styles.createButton} onClick={createList}>
        Create
      </button>
    </div>
  );
}
