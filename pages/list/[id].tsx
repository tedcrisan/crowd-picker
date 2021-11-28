import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import styles from "styles/List.module.scss";
import { Header } from "components/header";
import { Content } from "components/content";
import { Gallery } from "components/gallery/Gallery";
import { fetchList } from "utils/fetchList";
import { useData } from "state/data-context";
import { Themes } from "components/themePicker/ThemePicker";
const Sidebar = dynamic(() => import("components/sidebar/Sidebar"), { ssr: false });
const Vote = dynamic(() => import("components/vote/Vote"), { ssr: false });

export default function List({ id }) {
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
          setNumberOfSkeletons(list.unwatched.length, list.watched.length);
        }
      });
    }
  }, []);

  useEffect(() => {
    //Check for theme selection
    const temp = localStorage.getItem("theme");
    if (temp) chooseTheme(temp === "light" ? "light" : (temp as Themes));
  }, []);

  const setNumberOfSkeletons = (unwatchedSkeletons: number, watchedSkeletons: number) => {
    localStorage.setItem("unwatchedSkeletons", unwatchedSkeletons.toString());
    localStorage.setItem("watchedSkeletons", watchedSkeletons.toString());
  };

  return (
    <div id={styles.container} className={theme}>
      <Header />
      <Sidebar current={current} chooseCurrent={chooseCurrent} />
      <Content current={current}>
        {current === "unwatched" && (
          <Gallery title="unwatched" movieList={unwatched} {...{ creator }} />
        )}
        {current === "watched" && <Gallery title="watched" movieList={watched} {...{ creator }} />}
        {current === "vote" && <Vote creator={creator} />}
      </Content>
    </div>
  );
}

export function getServerSideProps(context) {
  return {
    props: { id: context.params.id },
  };
}
