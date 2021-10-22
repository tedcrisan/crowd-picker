import { ReactNode } from "react";
import styles from "./SortButton.module.scss";

import { Sort } from "../MovieTools";

type SortButtonProps = {
  children: ReactNode;
  selected: Sort;
  sortName: Sort;
  selectSort: (a: Sort) => void;
};

export function SortButton({ children, selected, sortName, selectSort }: SortButtonProps) {
  const checkIfSelected = (typeOfSort: Sort) => {
    if (typeOfSort === selected) return styles.active;
    return "";
  };

  return (
    <div
      className={`${styles.viewButton} ${checkIfSelected(sortName)}`}
      onClick={() => selectSort(sortName)}
    >
      {children}
    </div>
  );
}
