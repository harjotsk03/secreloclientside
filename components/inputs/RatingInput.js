import { useState } from "react";

export const RatingInput = ({ label, required=false, max = 5, value = 0, onChange }) => {
  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-end">
        {label && (
          <label className={`block text-xs lg:text-sm dm-sans-regular mb-1.5`}>
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
      </div>
      <div
        className={`w-full border rounded-lg px-4 py-4 flex flex-col gap-3 transition-colors
          border-stone-300 dark:border-stone-700
          bg-transparent
        `}
      >
        <div className="flex items-center justify-between text-sm dm-sans-regular text-black dark:text-white">
          <span>0</span>
          <span>{max}</span>
        </div>

        <div className="relative">
          <input
            type="range"
            min={0}
            max={max}
            step={1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none bg-stone-300 dark:bg-stone-700 cursor-pointer focus:outline-none range-thumb"
          />

          {/* Tooltip label above slider thumb */}
          <div
            className="absolute -top-8 left-0 transform -translate-x-1/2 transition-all duration-200 ease-in-out"
            style={{ left: `${(value / max) * 100}%` }}
          >
            <div className="bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs dm-sans-medium px-2 py-1 rounded-lg">
              {value} / {max}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
