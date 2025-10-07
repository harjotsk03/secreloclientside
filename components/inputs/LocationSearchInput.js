import { Search } from "lucide-react";
import { useGeoapifySuggestions } from "../../hooks/useGeoapifySuggenstions";
import { SearchInput } from "./SearchInput";
import { useRef } from "react";

export const LocationSearchInput = ({
  value,
  onChange,
  onSelect,
  label,
  disabled,
  Icon,
}) => {
  const { suggestions, loading, clearSuggestions } =
    useGeoapifySuggestions(value);
  const justSelectedRef = useRef(false); // flag to prevent fetch after select

  const handleChange = (newValue) => {
    onChange(newValue);
    justSelectedRef.current = false; // allow suggestions again
  };

  const handleSelect = (suggestion) => {
    onSelect(suggestion);
    justSelectedRef.current = true;
    clearSuggestions(); // close dropdown
  };

  return (
    <div className="relative w-full">
      {label && (
        <label
          className={`block text-xs lg:text-sm poppins-regular mb-1.5 ${
            disabled
              ? "text-black/50 dark:text-white/50"
              : "text-black dark:text-white"
          }`}
        >
          {label}
        </label>
      )}
      <SearchInput
        icon={Icon}
        placeholder="Search for a location"
        value={value}
        onChange={handleChange}
        onSearch={() => {}}
        loading={!justSelectedRef.current && loading}
      />

      {suggestions.length > 0 && !justSelectedRef.current && (
        <ul className="absolute z-10 bg-white border rounded shadow mt-1 w-full max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
