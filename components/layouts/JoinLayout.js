"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Nav from "../nav/Nav";
import { AlertContext } from "../../context/alertContext";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../general/ThemeToggle";
import { Button } from "../buttons/Button";

export default function JoinLayout({ children }) {
  const redirecting = useRef(false);
  const { showAlert } = useContext(AlertContext);
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

const redirectToLogin = (msg) => {
  const params = new URLSearchParams();
  if (msg) params.set("msg", msg);
  const currentPath = pathname || window.location.pathname; // ✅ fallback
  params.set("from", currentPath);
  router.push(`/login?${params.toString()}`);
};


  useEffect(() => {
    if (loading) return;

    if (!user && !redirecting.current) {
      redirecting.current = true;
      redirectToLogin("Log in first to join the repo!");
      return;
    }

  }, [user, loading, router, logout]);

    const colors = [
      "bg-red-500",
      "bg-indigo-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-blue-500",
    ];
    const getColorFromLetter = (letter) => {
      if (!letter) return colors[0];
      const code = letter.toUpperCase().charCodeAt(0);
      return colors[code % colors.length];
    };

    const profileLetter = user?.profile?.full_name?.[0] || "?";
    const profileColor = getColorFromLetter(profileLetter);

  return (
    <div className="transition-all duration-300 ease-in-out">
      <div className="w-full fixed top-0 h-20 flex flex-row px-6 justify-between items-center">
        <button className="flex" onClick={() => router.push("/")}>
          <p className="dm-sans-medium text-lg text-emerald-600 dark:text-white">
            secrelo<span className="text-black">.</span>
          </p>
        </button>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!user && (
            <Button onClick={() => router.push("/login")}>Log In</Button>
          )}
          {user?.profile && (
            <button
              onClick={() => router.push("/app/profile")}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-white font-medium text-sm ${profileColor}`}
            >
              {profileLetter.toUpperCase()}
            </button>
          )}
        </div>
      </div>
      <main className={`h-screen w-screen`}>
        <div>{children}</div>
      </main>
    </div>
  );
}
