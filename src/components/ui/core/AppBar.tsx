"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AppBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const syncLoginStatus = () => {
            const loggedIn = localStorage.getItem("isLoggedIn") === "true";
            setIsLoggedIn(loggedIn);
        };

        syncLoginStatus(); // initial load

        // Listen for login state changes
        window.addEventListener("loginStatusChanged", syncLoginStatus);
        return () => window.removeEventListener("loginStatusChanged", syncLoginStatus);
    }, [pathname]);


    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        localStorage.clear();
        window.dispatchEvent(new Event("loginStatusChanged"));

        router.push("/");
        router.refresh();
    };

    return (
        <header className="bg-black shadow-md font-sans">
            <nav className="container mx-auto flex items-center justify-between py-4 px-6 bg-gradient-to-r from-blue-800 to-blue-600 rounded-b-xl">
                <div className="text-3xl font-extrabold tracking-wide text-white drop-shadow-sm">
                    Barzzy
                </div>
                <ul className="flex space-x-6 text-lg font-medium text-white">
                    <li>
                        <Link href="/" className="hover:text-yellow-300 transition duration-200">
                            Home
                        </Link>
                    </li>
                    {isLoggedIn ? (
                        <>
                            <li>
                                <Link href="/menu" className="hover:text-yellow-300 transition duration-200">
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link href="/analytics" className="hover:text-yellow-300 transition duration-200">
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
                                <Link href="/login" className="hover:text-yellow-300 transition duration-200">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="hover:text-yellow-300 transition duration-200">
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
