import { useState, useEffect } from "react";
import axios from "axios";
import { useDebouncedCallback } from "use-debounce";

export default function useFetchBySearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const debounced = useDebouncedCallback((value) => {
    setDebouncedQuery(value);
  }, 800);
  const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

  const searchOMDB = (term) => {
    axios
      .get(`https://www.omdbapi.com/?s=${term}&type=movie&apikey=${API_KEY}`)
      .then(({ data }) => {
        if (data.Error) {
          setError(true);
        } else {
          setData(data.Search);
          setError(false);
        }
      })
      .catch(() => setError(true));
  };

  useEffect(() => {
    //Prevent request on initial page render
    if (!debouncedQuery) return;
    if (debouncedQuery.length < 3) return;
    searchOMDB(debouncedQuery);
  }, [debouncedQuery]);

  const search = (term) => {
    debounced(term);
    setQuery(term);
  };

  const reset = () => {
    setData([]);
    setQuery("");
  };

  return { query, debouncedQuery, search, data, reset };
}
