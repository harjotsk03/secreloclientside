"use client";
import { useContext, useEffect, useState } from "react";
import Nav from "../nav/Nav";
import { AlertContext } from "../../context/alertContext";

export default function AuthLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // ✅ consistent default
  const [showSideNav, setShowSideNav] = useState(false);
  const { showAlert } = useContext(AlertContext);

  // Load from localStorage only on client
  useEffect(() => {
    const storedSidebar = localStorage.getItem("sidebarOpen");
    if (storedSidebar !== null) {
      setSidebarOpen(storedSidebar === "true");
    }
  }, []);

  // Save to localStorage when sidebarOpen changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen.toString());
  }, [sidebarOpen]);

  return (
    <div>
      <Nav
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showSideNav={showSideNav}
        setShowSideNav={setShowSideNav}
      />
      <main
        className={`transition-all min-h-screen duration-300 flex-1 fade-in-down px-4 pb-6 lg:pb-6 lg:px-0 lg:mr-8${
          sidebarOpen
            ? `ml-0 ${showSideNav ? "lg:ml-20" : "lg:ml-4"}  lg:pl-2`
            : "ml-0 lg:ml-80 pl-4 lg:pl-8"
        }`}
      >
        <div className="pt-16 lg:pr-6 lg:mt-0 lg:pt-20">{children}</div>
      </main>
    </div>
  );
}
