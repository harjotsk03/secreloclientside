"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Nav from "../nav/Nav";
import { AlertContext } from "../../context/alertContext";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout({ children }) {
  const redirecting = useRef(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSideNav, setShowSideNav] = useState(false);
  const { showAlert } = useContext(AlertContext);
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const redirectToLogin = (msg) => {
    const params = new URLSearchParams();
    if (msg) params.set("msg", msg);
    params.set("from", pathname); // save current page
    router.push(`/login?${params.toString()}`);
  };

  useEffect(() => {
    if (loading) return; // <-- wait for localStorage to load

    if (!user?.token && !redirecting.current) {
      redirecting.current = true;
      redirectToLogin("Please log in to continue");
      return;
    }

    if (user?.token && !redirecting.current) {
      try {
        const payload = JSON.parse(atob(user.token.split(".")[1]));
        const now = Date.now() / 1000;
        if (payload.exp && payload.exp < now) {
          redirecting.current = true;
          logout();
          redirectToLogin("Session expired. Please log in again.");
        }
      } catch (err) {
        console.error("Invalid token", err);
        redirecting.current = true;
        logout();
        redirectToLogin();
      }
    }
  }, [user, loading, router, logout]);

  // Sidebar localStorage logic
  useEffect(() => {
    const storedSidebar = localStorage.getItem("sidebarOpen");
    if (storedSidebar !== null) setSidebarOpen(storedSidebar === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen.toString());
  }, [sidebarOpen]);

  if (!user?.token) return null; // optional: show spinner while checking

  return (
    <div className="transition-all duration-300 ease-in-out">
      <Nav
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showSideNav={showSideNav}
        setShowSideNav={setShowSideNav}
      />
      <main
        className={`transition-all min-h-screen duration-300 flex-1 fade-in-down px-4 lg:px-0 lg:mr-8${
          sidebarOpen
            ? `ml-0 ${showSideNav ? "lg:ml-20" : "lg:ml-4"} lg:pl-2`
            : "ml-0 lg:ml-80 pl-0 lg:pl-6"
        }`}
      >
        <div className="pt-16 lg:pr-6 lg:mt-0 lg:pt-20">{children}</div>
      </main>
    </div>
  );
}
