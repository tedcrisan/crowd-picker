import { useState } from "react";
import { BsSortAlphaDown, BsSortNumericDownAlt } from "react-icons/bs";
import { IoEyeOffOutline, IoCalendarClearOutline } from "react-icons/io5";

import styles from "./MovieTools.module.scss";
import { useData } from "state/data-context";
import { SortButton } from "./sortButton/SortButton";

export type Sort = "likes" | "watched" | "alphabetically" | "date";

export function MovieTools() {
  const { unwatched, setUnwatchedList, watched, setWatchedList } = useData();
  const [selected, setSelected] = useState(null);

  const sortBy = (type: Sort) => {
    const tempUnwatched = [...unwatched];
    const tempWatched = [...watched];
    let sortedUnwatched, sortedWatched;

    switch (type) {
      case "likes":
        sortedUnwatched = tempUnwatched.sort(
          (first, second) => second.total_likes - first.total_likes
        );
        sortedWatched = tempWatched.sort((first, second) => second.total_likes - first.total_likes);
        break;
      case "watched":
        sortedUnwatched = tempUnwatched.sort(
          (first, second) => second.total_nevers - first.total_nevers
        );
        sortedWatched = tempWatched.sort(
          (first, second) => second.total_nevers - first.total_nevers
        );
        break;
      case "alphabetically":
        sortedUnwatched = tempUnwatched.sort((first, second) => {
          if (first.title < second.title) return -1;
          if (first.title > second.title) return 1;
          return 0;
        });
        sortedWatched = tempWatched.sort((first, second) => {
          if (first.title < second.title) return -1;
          if (first.title > second.title) return 1;
          return 0;
        });
        break;
      default:
        //date
        sortedUnwatched = tempUnwatched.sort(
          (first, second) => new Date(second.date).valueOf() - new Date(first.date).valueOf()
        );
        sortedWatched = tempWatched.sort(
          (first, second) => new Date(second.date).valueOf() - new Date(first.date).valueOf()
        );
    }

    setUnwatchedList(sortedUnwatched);
    setWatchedList(sortedWatched);
  };

  const selectSort = (typeOfSort: Sort) => {
    sortBy(typeOfSort);
    setSelected(typeOfSort);
  };

  return (
    <div id={styles.container}>
      <div id={styles.listHeader}>
        <SortButton selected={selected} sortName="watched" selectSort={selectSort}>
          <IoEyeOffOutline size="24px" title="Sort by never watched" />
        </SortButton>
        <SortButton selected={selected} sortName="date" selectSort={selectSort}>
          <IoCalendarClearOutline size="24px" title="Sort by most recent" />
        </SortButton>
        <SortButton selected={selected} sortName="alphabetically" selectSort={selectSort}>
          <BsSortAlphaDown size="24px" title="Sort Alphabetically" />
        </SortButton>
        <SortButton selected={selected} sortName="likes" selectSort={selectSort}>
          <BsSortNumericDownAlt size="24px" title="Sort by likes" />
        </SortButton>
      </div>
    </div>
  );
}
