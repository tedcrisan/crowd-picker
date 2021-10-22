import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";

import styles from "styles/List.module.scss";
import { Header } from "components/header";
import { Sidebar } from "components/sidebar";
import { Content } from "components/content";
import { Gallery } from "components/gallery/Gallery";
import { fetchList } from "utils/fetchList";
import { useData } from "state/data-context";
import { Themes } from "components/themePicker/ThemePicker";

export default function List({ id }) {
  const [session, loading] = useSession();
  const [creator, setCreator] = useState(false);
  const {
    chooseId,
    theme,
    chooseTheme,
    unwatched,
    setUnwatchedList,
    watched,
    setWatchedList,
    current,
    chooseCurrent,
  } = useData();

  useEffect(() => {
    //Set list id
    chooseId(id);

    if (id) {
      fetchList(id).then((list) => {
        if (list) {
          setCreator(list.creator);
          setUnwatchedList(list.unwatched);
          setWatchedList(list.watched);
        }
      });
    }
  }, []);

  useEffect(() => {
    //Check for theme selection
    const temp = localStorage.getItem("theme");
    if (temp) chooseTheme(temp === "light" ? "light" : (temp as Themes));
  }, []);

  return (
    <div id={styles.container} className={theme}>
      <Header />
      <Sidebar current={current} chooseCurrent={chooseCurrent} />
      <Content current={current}>
        {current === "unwatched" && (
          <Gallery title="unwatched" movieList={unwatched} {...{ creator }} />
        )}
        {current === "watched" && <Gallery title="watched" movieList={watched} {...{ creator }} />}
      </Content>
    </div>
  );
}

export function getServerSideProps(context) {
  return {
    props: { id: context.params.id },
  };
}
