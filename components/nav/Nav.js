"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "../general/ThemeToggle";
import ToggleSideButton from "./ToggleSideButton";
import { Button } from "../buttons/Button";
import { BookCheck, Building2, HamIcon, Home, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { ProfileDropDown } from "../modals/ProfileDropDown";
import { SidebarNav } from "./SidebarNav";
import { useAuth } from "../../context/AuthContext";

export default function Nav({
  sidebarOpen,
  setSidebarOpen,
  showSideNav,
  setShowSideNav,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const toggleDrawer = () => setMenuOpen(!menuOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleOpenProfileModal = () => setOpenProfileModal(!openProfileModal);
  const { user } = useAuth(); // get user

  // deterministic colors based on first letter
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

  useEffect(() => {
    if (pathname?.includes("/app")) {
      setShowSideNav(true);
    }
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {openProfileModal && (
          <motion.div
            className="w-56 h-max overflow-hidden fixed top-16 mt-2 right-2 z-40 rounded-lg bg-lightBG2 dark:bg-darkBG flex flex-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ProfileDropDown setOpenProfileModal={setOpenProfileModal} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full h-14 lg:h-16 fixed top-0 left-0 flex justify-between items-center px-3 lg:px-5 bg-lightBG dark:bg-darkBG z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDrawer}
            className="lg:hidden px-2 py-2 z-50 rounded-md text-black dark:text-white bg-darkBG/5 dark:bg-lightBG/5 transition-all"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <button className="hidden lg:flex" onClick={() => router.push("/")}>
            <p className="dm-sans-medium text-sm lg:text-lg text-emerald-600 dark:text-white">
              secrelo<span className="text-black">.</span>
            </p>
          </button>
        </div>

        <div className="flex items-center gap-2">
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

      {showSideNav && (
        <div
          className={`hidden lg:block bg-lightBG dark:bg-darkBG lg:fixed top-0 px-2 pt-28 left-0 h-full z-30 transform transition-all duration-300 ${
            sidebarOpen ? "w-14" : "w-80"
          }`}
        >
          <div className="flex flex-col gap-1"></div>
          <ToggleSideButton
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <SidebarNav sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
      )}

      <div
        className={`fixed lg:hidden top-0 left-0 h-full w-64 bg-lightBG dark:bg-darkBG z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-full flex flex-row items-center justify-between px-4 mt-3">
          <button
            className="flex"
            onClick={() => {
              setMenuOpen(false);
              setTimeout(() => {
                router.push("/");
              }, 300);
            }}
          >
            <p className="dm-sans-medium text-xl text-emerald-600 dark:text-white">
              secrelo<span className="text-black">.</span>
            </p>
          </button>
          <button
            onClick={toggleDrawer}
            className="lg:hidden px-2 py-2 z-50 rounded-md text-black dark:text-white bg-darkBG/5 dark:bg-lightBG/5 transition-all"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <div className=" p-4 flex flex-col gap-4">
          <SidebarNav sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          {/* <div className="flex flex-col gap-4">
            <Button icon={Home} size="lg" variant="primary">
              Home
            </Button>
            <Button icon={Building2} size="lg" variant="invisible">
              Organization
            </Button>
            <Button icon={BookCheck} size="lg" variant="invisible">
              Tickets
            </Button>
          </div> */}
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed lg:hidden inset-0 bg-black bg-opacity-60 z-40"
          onClick={toggleDrawer}
        />
      )}
    </>
  );
}
