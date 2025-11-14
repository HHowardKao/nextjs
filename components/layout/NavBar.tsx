"use client";
import { MdNoteAlt } from "react-icons/md";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";
import SearchInput from "./SearchInput";
import Notifications from "./Notifications";
import UserBotton from "./UserButton";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Tags from "./Tags";

const NavBar = () => {
  const session = useSession();
  const isLoggedIn = session.status === "authenticated";
  const path = usePathname();
  const router = useRouter();

  const isFeedsPage = path.includes("/blog/feed");

  console.log("Session>>>", session);
  useEffect(() => {
    if (!isLoggedIn && path) {
      const updateSession = async () => {
        await session.update();
      };
      updateSession();
    }
  }, [isLoggedIn, path]);

  console.log(session);
  return (
    <nav className="sticky top-0 border-b z-50 bg-white dark:bg-slate-950">
      <Container>
        <div className="flex justify-between items-center gap-8">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.push("/blog/feed/1")}
          >
            <MdNoteAlt size={24} />
            <div className="font-bold text-xl">WEBDEV.blog</div>
          </div>
          {isFeedsPage && <SearchInput />}

          <div className="flex gap-5 sm:gap-8 items-center">
            <ThemeToggle />
            {isLoggedIn && <Notifications />}
            {isLoggedIn && <UserBotton />}
            {!isLoggedIn && (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </Container>
      <Tags />
    </nav>
  );
};

export default NavBar;
