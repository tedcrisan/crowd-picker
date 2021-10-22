import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import { FiLogOut } from "react-icons/fi";

import styles from "./Header.module.scss";
import { ThemePicker } from "components/themePicker";
import { Search } from "components/search";
import useClickOutside from "utils/useClickOutside";

export function Header() {
  const [session, loading] = useSession();
  const [ref, isVisible, setIsVisible] = useClickOutside(false);

  return (
    <header id={styles.container}>
      <div id={styles.innerContainer}>
        <div id={styles.left}>
          <span id={styles.logo}>
            <Link href="/">CROWD PICKER</Link>
          </span>
          <Search />
        </div>
        <div id={styles.right}>
          <ThemePicker />
          {!session && (
            <button id={styles.signIn} onClick={() => signIn("google")}>
              Sign in
            </button>
          )}
          {session && (
            <div id={styles.profile} ref={ref}>
              <img
                id={styles.avatar}
                src={session.user.image}
                alt={session.user.name}
                onClick={() => setIsVisible(!isVisible)}
              />
              {isVisible && (
                <div id={styles.menu}>
                  <div className={styles.menuItem} onClick={() => signOut()}>
                    <FiLogOut size="24px" /> Sign out
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
