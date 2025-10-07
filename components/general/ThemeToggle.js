import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Only render after client-side hydration
  }, []);

  if (!mounted) return null;

  const isActive = (value) => theme === value;

  return (
    <div className="flex gap-2 bg-lightBG dark:bg-darkBG2 w-max p-0.5 rounded-lg">
      <button
        className={clsx(
          "p-2 rounded-lg text-black dark:text-white hover:bg-lightBG3 dark:hover:bg-darkBG transition-all duration-500 ease-in-out group",
          { "dark:bg-darkBG": isActive("light") }
        )}
        onClick={() => setTheme("light")}
        aria-label="Light theme"
      >
        <Sun className="w-3.5 h-3.5 text-sm transition-all duration-500 ease-in-out" />
      </button>

      <button
        className={clsx(
          "p-2 rounded-lg text-black dark:text-white hover:bg-lightBG3 dark:hover:bg-darkBG transition-all duration-500 ease-in-out group",
          { "dark:bg-darkBG": isActive("dark") }
        )}
        onClick={() => setTheme("dark")}
        aria-label="Dark theme"
      >
        <Moon className="w-3.5 h-3.5 text-sm transition-all duration-500 ease-in-out" />
      </button>

      <button
        className={clsx(
          "p-2 rounded-lg text-black dark:text-white hover:bg-lightBG3 dark:hover:bg-darkBG transition-all duration-500 ease-in-out group",
          { "dark:bg-darkBG": isActive("system") }
        )}
        onClick={() => setTheme("system")}
        aria-label="System theme"
      >
        <Monitor className="w-3.5 h-3.5 text-sm transition-all duration-500 ease-in-out" />
      </button>
    </div>
  );
}
