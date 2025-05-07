"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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
    <header
      className="bg-gradient-to-r from-black via-gray-900 to-gray-700 shadow-md font-sans border-b-2 border-solid"
      style={{ borderImage: "linear-gradient(to right, rgba(255,255,255,0.2), rgba(100,100,100,0.5), rgba(0,0,0,1)) 1" }}
    >
      <nav className="flex items-center justify-between w-full py-4 px-6 rounded-b-xl">
        <div className={`text-2xl font-extrabold tracking-wide text-white drop-shadow-sm ${megrimFont}`}>
          Megrim
        </div>
        <ul className="flex space-x-6 text-lg font-medium text-white">
          {/* Conditionally render Home link only if not logged in */}
          {!isLoggedIn && (
            <li>
              <Link href="/" className="hover:text-gray-300 transition duration-200">
                Home
              </Link>
            </li>
          )}
          {isLoggedIn ? (
              <>
                <li>
                  <Link href="/inventory" className="hover:text-gray-300 transition duration-200">
                    Inventory
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="hover:text-gray-300 transition duration-200">
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/configurations" className="hover:text-gray-300 transition duration-200">
                    Configurations
                  </Link>
                </li>
                <li>
                  <button
                      onClick={handleLogout}
                      className="hover:text-gray-300 transition duration-200"
                  >
                    Logout
                  </button>
                </li>
              </>
          ) : (

              <>
              <li>
                <Link href="/login" className="hover:text-gray-300 transition duration-200">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-gray-300 transition duration-200">
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