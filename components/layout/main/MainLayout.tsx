import styles from "./MainLayout.module.scss";
import { Header } from "components/header";

export function MainLayout({ children }) {
  return (
    <div id={styles.container}>
      <Header />
      <div id={styles.content}>{children}</div>
    </div>
  );
}
