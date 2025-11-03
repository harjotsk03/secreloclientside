import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "../buttons/Button";

export const ToggleButton = ({
  label = "Enable Feature",
  value = false,
  onChange = () => {},
  activeLabel,
  inactiveLabel,
}) => {
  const isActive = value;

  const toggle = () => {
    onChange(!isActive);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex items-center justify-between w-full p-2 rounded-lg border transition-colors ${
        isActive
          ? "border-green-600 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
          : "border-stone-300 dark:border-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-all duration-300 ease-in-out"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 flex items-center justify-center rounded border border-white dark:border-stone-300 ${
            isActive ? "bg-green-600 text-white" : "border-stone-300"
          }`}
        >
          {isActive && <Check className="w-4 h-4" />}
        </div>
        <span className="text-sm text-left">
          {isActive ? activeLabel || label : inactiveLabel || label}
        </span>
      </div>
    </button>
  );
};
