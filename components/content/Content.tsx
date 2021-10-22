import { ReactNode } from "react";

import styles from "./Content.module.scss";
import { MovieTools } from "components/movieTools";

type ContentProps = {
  children: ReactNode;
  current: string;
};

export function Content({ children, current }: ContentProps) {
  return (
    <div id={styles.container}>
      {current === "unwatched" && (
        <div id={styles.tools}>
          <MovieTools />
        </div>
      )}
      <div id={styles.content}>{children}</div>
    </div>
  );
}
