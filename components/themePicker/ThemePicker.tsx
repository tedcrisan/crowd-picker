import styles from "./ThemePicker.module.scss";
import { useData } from "state/data-context";
import { ChangeEvent, useState } from "react";

export type Themes =
  | "light"
  | "dark"
  | "solarized_dark"
  | "carbon"
  | "monokai"
  | "dracula"
  | "terminal";

export function ThemePicker() {
  const { theme, chooseTheme } = useData();
  const [themesList] = useState<Themes[]>([
    "light",
    "dark",
    "solarized_dark",
    "carbon",
    "monokai",
    "dracula",
    "terminal",
  ]);

  return (
    <div id={styles.container}>
      <select
        id={styles.selectBar}
        value={theme}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => chooseTheme(e.target.value as Themes)}
      >
        {themesList.map((name) => (
          <option key={name} className={styles.optionBar} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
