import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

export function CustomSelect({ value, options, onChange }) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white dark:bg-darkBG3 py-2 pl-3 pr-10 text-left border border-stone-300 dark:border-stone-600 text-black dark:text-white shadow-sm text-sm">
          <span>{value.toString().padStart(2, "0")}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-52 w-full scrollbar-hide overflow-auto rounded-md bg-white dark:bg-darkBG3 py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
          {options.map((option, idx) => (
            <Listbox.Option
              key={idx}
              value={option}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-6 ${
                  active
                    ? "bg-stone-100 dark:bg-stone-700 text-black dark:text-white"
                    : "text-gray-800 dark:text-gray-300"
                }`
              }
            >
              {option.toString().padStart(2, "0")}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
