import { Check, Pencil, Trash, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../buttons/Button";

export const CheckboxGroup = ({
  label,
  options = [],
  selected = [],
  onChange,
  required=false,
  editing=false,
  setOptions = () => {},
}) => {
  const toggle = (val) => {
    onChange(
      selected.includes(val)
        ? selected.filter((v) => v !== val)
        : [...selected, val]
    );
  };

  const updateLabel = (index, newLabel) => {
    const newOptions = [...options];
    newOptions[index].label = newLabel;
    setOptions(newOptions);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([
      ...options,
      { label: "New Option", value: Date.now().toString() },
    ]);
  };

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-end">
        {label && (
          <label className="block text-xs lg:text-sm dm-sans-regular mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
      </div>

      <div className="w-full space-y-2 mb-2">
        {options.map((opt, index) => {
          const isChecked = selected.includes(opt.value);
          return (
            <div key={opt.value} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggle(opt.value)}
                className={`flex-1 flex items-start gap-3 rounded-lg border p-2 text-left transition-colors ${
                  isChecked
                    ? "border-blue-600 bg-blue-50"
                    : "border-stone-300 hover:bg-stone-100"
                }`}
              >
                <div
                  className={`w-5 h-5 flex items-center justify-center rounded border ${
                    isChecked ? "bg-blue-600 text-white" : "border-stone-300"
                  }`}
                >
                  {isChecked && <Check className="w-4 h-4" />}
                </div>

                {editing ? (
                  <input
                    value={opt.label}
                    onChange={(e) => updateLabel(index, e.target.value)}
                    className="w-full bg-transparent border-none focus:outline-none text-sm text-black dark:text-white"
                  />
                ) : (
                  <div className="text-sm text-black dark:text-white">
                    {opt.label}
                  </div>
                )}
              </button>

              {editing && (
                <button onClick={() => removeOption(index)}>
                  <Trash className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {editing && (
        <Button variant="solid" icon={Plus} onClick={addOption}>
          Add Option
        </Button>
      )}
    </div>
  );

};



