import styles from "./Results.module.scss";

export function Results({ children }) {
  return <div id={styles.container}>{children}</div>;
}
