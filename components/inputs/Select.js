import { useEffect, useState } from "react";
import {
  CheckCircle,
  ChevronDown,
  Pencil,
  Trash,
  Plus,
  Edit,
} from "lucide-react";
import { Button } from "../buttons/Button";

export const Select = ({
  label,
  options = [],
  value = "",
  disabled = false,
  onChange = () => {},
  setOptions = () => {},
  placeholder = "-",
  multiple = false,
  error = "",
  required = false,
  editing = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState(multiple ? [] : value);

  useEffect(() => {
    setSelectedValues(multiple ? value ?? [] : value ?? "");
  }, [value, multiple]);

  const handleSelect = (val) => {
    if (multiple) {
      const newValues = selectedValues.includes(val)
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val];
      setSelectedValues(newValues);
      onChange(newValues);
    } else {
      setSelectedValues(val);
      onChange(val);
      setIsOpen(false);
    }
  };

  const updateLabel = (index, newLabel) => {
    const updated = [...options];
    updated[index].label = newLabel;
    setOptions(updated);
  };

  const removeOption = (index) => {
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
  };

  const addOption = () => {
    const newOption = {
      label: "New Option",
      value: Date.now().toString(),
    };
    setOptions([...options, newOption]);
  };

  const displayText = multiple
    ? selectedValues.length
      ? `${selectedValues.length} selected`
      : placeholder
    : options.find((opt) => opt.value === selectedValues)?.label || placeholder;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs lg:text-sm dm-sans-regular text-black dark:text-white">
          {label} {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`${disabled ? "opacity-50 hover:cursor-not-allowed" : "opacity-100"} w-full px-5 pl-3 py-2 h-9 text-sm dm-sans-regular rounded-lg border bg-white dark:bg-darkBG3 text-black dark:text-white border-stone-300 dark:border-stone-700 flex items-center justify-between transition`}
        >
          <span
            className={
              selectedValues?.length
                ? "text-black dark:text-white"
                : "text-stone-500"
            }
          >
            {displayText}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-black dark:text-white transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-darkBG3 max-h-60 overflow-auto shadow-sm">
            {options.map((option, index) => {
              const isSelected = multiple
                ? selectedValues.includes(option.value)
                : selectedValues === option.value;

              return (
                <div
                  key={option.value}
                  className={`flex items-center justify-between gap-2 px-3 transition-all ease-in-out duration-500 py-2 text-sm ${
                    isSelected
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-700/20 dark:text-blue-400"
                      : "hover:bg-stone-200 dark:hover:bg-stone-200 dark:hover:text-black"
                  }`}
                >
                  {editing ? (
                    <input
                      value={option.label}
                      onChange={(e) => updateLabel(index, e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-sm cursor-text dark:text-white"
                    />
                  ) : (
                    <div
                      onClick={() => handleSelect(option.value)}
                      className="w-full text-sm cursor-pointer dark:text-white"
                    >
                      {option.label}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelect(option.value)}
                    >
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                    {editing && (
                      <>
                        <p className="text-xs text-stone-800 w-max my-auto dm-sans-light">
                          Click anywhere to edit
                        </p>
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {editing && (
              <div className="p-2">
                <Button variant="solid" icon={Plus} onClick={addOption}>
                  Add Option
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
