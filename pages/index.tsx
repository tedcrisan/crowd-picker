import styles from "styles/Home.module.scss";
import { MainLayout } from "components/layout";
import { Selection } from "components/Selection";

export default function Home() {
  return (
    <MainLayout>
      <div id={styles.container}>
        <Selection />
      </div>
    </MainLayout>
  );
}
