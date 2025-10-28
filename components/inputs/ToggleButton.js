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
          ? "border-green-600 bg-green-50 text-green-700"
          : "border-stone-300 hover:bg-stone-100 text-stone-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 flex items-center justify-center rounded border ${
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
