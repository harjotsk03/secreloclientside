import { useState } from "react";
import { X } from "lucide-react";

export const TagInput = ({
  label,
  tags = [],
  onChange = () => {},
  placeholder = "Add tags...",
  disabled = false,
  error = "",
  required = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      onChange([...tags, tag.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-1.5 w-full h-max">
      <div className="flex flex-row justify-between items-end">
        {label && (
          <label
            className={`block text-xs lg:text-sm poppins-regular ${
              disabled
                ? "text-black/50 dark:text-white/50"
                : "text-black dark:text-white"
            }`}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        {error && <p className="text-xs poppins-light text-red-600">{error}</p>}
      </div>
      <div
        className={`
        flex flex-wrap gap-2 ${
          tags.length == 0 ? "px-3" : "px-2"
        }  w-full py-2 h-10 text-sm rounded-lg dm-sans-regular text-black bg-white dark:bg-darkBG3 dark:text-white transition-colors border border-stone-200 dark:border-stone-800 focus:border-black focus:dark:border-stone-500 focus:ring-transparent focus:outline-none focus:ring-0
        ${error ? "border-red-500" : ""}
      `}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs dm-sans-regular bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300`}
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className={`ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(inputValue)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm"
        />
      </div>
    </div>
  );
};
