import { ReactNode, useState } from "react";
import { IoEyeOffOutline, IoEyeOutline, IoStatsChart, IoSettingsOutline } from "react-icons/io5";
import { useChannel } from "../vote/AblyReactEffect";

import styles from "./Sidebar.module.scss";

type SidebarProps = {
  current: string;
  chooseCurrent: (a: string) => void;
};

export default function Sidebar({ current, chooseCurrent }: SidebarProps) {
  const [notification, setNotification] = useState("");
  const [channel, ably] = useChannel("sidebar", (message) => {
    console.log(message);
    setNotification(message.data);
  });

  const checkIfInVote = (): boolean => {
    //Don't show notification if user is already at vote component
    if (notification === "vote" && current !== "vote") return true;
    return false;
  };

  return (
    <div id={styles.container}>
      <div id={styles.main}>
        <button
          className={`${styles.item} ${current === "unwatched" ? styles.active : null}`}
          onClick={() => chooseCurrent("unwatched")}
        >
          <IoEyeOffOutline size="26px" />
          <span className={styles.text}>Unwatched</span>
        </button>
        <button
          className={`${styles.item} ${current === "watched" ? styles.active : null}`}
          onClick={() => chooseCurrent("watched")}
        >
          <IoEyeOutline size="26px" />
          <span className={styles.text}>Watched</span>
        </button>
        <button
          className={`${styles.item} ${current === "vote" ? styles.active : null}`}
          onClick={() => {
            chooseCurrent("vote");
            setNotification("");
          }}
        >
          <div className={styles.icon}>
            <IoStatsChart size="26px" />
            {checkIfInVote() ? <span className={styles.notification}></span> : null}
          </div>
          <span className={styles.text}>Vote</span>
        </button>
      </div>
      <div id={styles.settings}>
        <button
          className={`${styles.item} ${current === "settings" ? styles.active : null}`}
          onClick={() => chooseCurrent("settings")}
        >
          <IoSettingsOutline size="26px" />
          <span className={styles.text}>Settings</span>
        </button>
      </div>
    </div>
  );
}
