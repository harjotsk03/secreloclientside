import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ToggleSideButton({ sidebarOpen, toggleSidebar }) {
  return (
    <button
      className={`flex fixed top-16 mt-2 items-center h-8 gap-2 w-8 rounded-md text-left text-sm poppins-regular transition-all duration-300
              ${
                sidebarOpen
                  ? "justify-center px-1.5 left-4 ml-0"
                  : "justify-center px-1.5 left-64 ml-6"
              }
              hover:bg-lightBG2 hover:dark:bg-darkBG2 text-black dark:text-white`}
      onClick={toggleSidebar}
    >
      {sidebarOpen ? <PanelLeftOpen /> : <PanelLeftClose />}
    </button>
  );
}
