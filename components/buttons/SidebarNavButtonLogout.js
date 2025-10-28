import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { HiMiniArrowTurnDownRight } from "react-icons/hi2";


export const SidebarNavButton = ({
  icon: Icon,
  iconPosition = "left",
  onClick,
  pushLeft = true,
  children,
  sidebarOpen,
  path,
  label,
  subItems = [],
  expanded,
  setExpanded,
}) => {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (pathname?.includes(path)) {
      setIsActive(true);
    }
  }, [path, pathname]);

  const handleClick = () => {
    if (subItems.length > 0) {
      if (sidebarOpen) {
        if (onClick) onClick();
      } else {
        setExpanded((prev) => !prev);
      }
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div className="relative w-full group">
      <button
        onClick={handleClick}
        className={`
          inline-flex items-center text-sm relative ${
            !sidebarOpen
              ? "px-3 h-9"
              : "px-3 lg:px-0 flex items-center lg:justify-center h-9"
          } hover:text-black hover:dark:text-white hover:bg-stone-200 ${
          isActive
            ? "dark:bg-stone-800 bg-stone-200 hover:bg-stone-200"
            : "bg-transparent"
        } hover:dark:bg-stone-700 text-black dark:text-stone-300 w-full ${
          pushLeft ? "justify-start" : "justify-center"
        } rounded-lg dm-sans-light transition-all duration-300 ease-in-out
        `}
      >
        {Icon && iconPosition === "left" && (
          <Icon
            className={`${!sidebarOpen ? "mr-2 w-3.5 h-auto" : "w-3.5 h-auto"}`}
          />
        )}
        <p className="hidden lg:flex">{!sidebarOpen && label}</p>
        <p className="lg:hidden flex ml-2 text-base">{label}</p>
        {subItems.length > 0 &&
          !sidebarOpen &&
          (expanded ? (
            <ChevronUp className="ml-auto w-4 h-4" />
          ) : (
            <ChevronDown className="ml-auto w-4 h-4" />
          ))}
      </button>

      {sidebarOpen && (
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-stone-800 text-white text-xs dm-sans-regular rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          {label}
        </span>
      )}

      <AnimatePresence initial={false}>
        {!sidebarOpen && expanded && subItems.length > 0 && (
          <motion.div
            key="submenu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="mt-2 bg-transparent rounded-md space-y-2 overflow-hidden"
          >
            {subItems.map((subItem, index) => (
              <div className="ml-6" key={subItem.path || index}>
                <button
                  onClick={subItem.onClick}
                  className={`
        inline-flex items-center text-xs relative ${
          !sidebarOpen
            ? "px-2 h-7"
            : "px-0 flex items-center justify-center h-7"
        } hover:text-black hover:dark:text-white hover:bg-stone-200 ${
                    pathname?.includes(subItem.path)
                      ? "dark:bg-stone-800 bg-stone-200 hover:bg-stone-200"
                      : "bg-transparent"
                  } hover:dark:bg-stone-700 text-black dark:text-stone-300 w-full ${
                    pushLeft ? "justify-start" : "justify-center"
                  } rounded-lg dm-sans-regular transition-all duration-300 ease-in-out
      `}
                >
                  {subItem.Icon && iconPosition === "left" && (
                    <subItem.Icon
                      className={`${
                        !sidebarOpen ? "mr-2 w-3 h-auto" : "w-3 h-auto"
                      }`}
                    />
                  )}
                  {subItem.label}
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
