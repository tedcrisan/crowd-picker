import { useState, useContext, createContext, ReactNode } from "react";
import { Themes } from "components/themePicker/ThemePicker";

type Current = "unwatched" | "watched" | "vote" | "settings";
type DataProviderProps = { children: ReactNode };
type State = {
  listId: string;
  chooseId: (a: string) => void;
  theme: Themes;
  chooseTheme: (a: Themes) => void;
  search: string;
  current: Current;
  chooseCurrent: (a: Current) => void;
  unwatched: any[];
  setUnwatchedList: (a: any) => void;
  watched: any[];
  setWatchedList: (a: any) => void;
};

const DataContext = createContext<State | undefined>(undefined);

function DataProvider({ children }: DataProviderProps) {
  const [listId, setListId] = useState("");
  const [theme, setTheme] = useState<Themes>("light");
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState<Current>("unwatched");
  const [unwatched, setUnwatched] = useState([]);
  const [watched, setWatched] = useState([]);

  const chooseCurrent = (name: Current) => setCurrent(name);
  const chooseId = (id: string) => setListId(id);
  const chooseTheme = (name: Themes) => {
    localStorage.setItem("theme", name);
    setTheme(name);
  };
  const setUnwatchedList = (list) => setUnwatched(list);
  const setWatchedList = (list) => setWatched(list);

  const value = {
    listId,
    chooseId,
    theme,
    chooseTheme,
    search,
    current,
    chooseCurrent,
    unwatched,
    setUnwatchedList,
    watched,
    setWatchedList,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

export { DataProvider, useData };
