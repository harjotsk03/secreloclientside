import { useState } from "react";
import Nav from "../nav/Nav";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSideNav, setShowSideNav] = useState(false);
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
            ? `ml-0 ${showSideNav ? "lg:ml-20" : "lg:ml-4"}  lg:pl-2`
            : "ml-0 lg:ml-80 pl-0 lg:pl-6"
        }`}
      >
        <div className="pt-16 lg:pr-6 lg:mt-0 lg:pt-20">{children}</div>
      </main>
    </div>
  );
}
