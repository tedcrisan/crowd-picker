import Link from "next/link";
import styled from "styled-components";
import { signIn, signOut, useSession } from "next-auth/client";
import { FiLogOut } from "react-icons/fi";
import useClickOutside from "../utils/useClickOutside";

export function Header() {
  const [session, loading] = useSession();
  const [ref, isVisible, setIsVisible] = useClickOutside(false);

  return (
    <Container>
      <Logo>
        <Link href="/">CROWD PICKER</Link>
      </Logo>
      {!session && <SignInButton onClick={() => signIn("google")}>Sign in</SignInButton>}
      {session && (
        <Profile ref={ref}>
          <Avatar
            src={session.user.image}
            alt={session.user.name}
            onClick={() => setIsVisible(!isVisible)}
          />
          {isVisible && (
            <Menu>
              <MenuItem onClick={() => signOut()}>
                <FiLogOut size="24px" /> Sign out
              </MenuItem>
            </Menu>
          )}
        </Profile>
      )}
    </Container>
  );
}

const Container = styled.header`
  width: 100%;
  height: 4em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  a {
    text-decoration: none;
    font-size: 1.6em;
    font-weight: 500;
  }
`;

const SignInButton = styled.button`
  font-size: 1.3em;
  font-weight: 500;
  padding: 0.3em 1.3em;
  border: 1px solid black;
  border-radius: 5px;
  cursor: pointer;
`;

const Profile = styled.div`
  position: relative;
  cursor: pointer;
`;

const Avatar = styled.img`
  height: 3em;
  border-radius: 50%;
`;

const Menu = styled.div`
  position: absolute;
  top: 3.6em;
  right: 0;
  width: 10em;
  padding: 1em;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12);
  background: white;
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;
