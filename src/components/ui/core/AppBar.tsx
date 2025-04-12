"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Accept a prop for the Megrim font class
interface AppBarProps {
  megrimFont: string;
}

export default function AppBar({ megrimFont }: AppBarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const syncLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    };

    syncLoginStatus(); // initial load
    window.addEventListener("loginStatusChanged", syncLoginStatus);
    return () => window.removeEventListener("loginStatusChanged", syncLoginStatus);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("loginStatusChanged"));
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-gray-900 shadow-md font-sans">
      {/* Removed container mx-auto so that the nav spans full width */}
      <nav className="flex items-center justify-between w-full py-4 px-6 rounded-b-xl">
        <div className={`text-3xl font-extrabold tracking-wide text-white drop-shadow-sm ${megrimFont}`}>
          Megrim
        </div>
        <ul className="flex space-x-6 text-lg font-medium text-white">
          <li>
            <Link href="/" className="hover:text-orange-400 transition duration-200">
              Home
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link href="/menu" className="hover:text-orange-400 transition duration-200">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-orange-400 transition duration-200">
                  Analytics
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-red-400 transition duration-200"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className="hover:text-orange-400 transition duration-200">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-orange-400 transition duration-200">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}