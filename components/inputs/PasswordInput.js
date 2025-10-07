import { useState } from "react";
import { Eye, EyeOff, SignalZero } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const PasswordInput = ({
  label,
  placeholder = "",
  value = "",
  required=false,
  onChange = () => {},
  error = "",
  disabled = false,
  icon: Icon,
  ...props
}) => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex flex-row justify-between items-end">
        {label && (
          <label
            className={`block text-xs lg:text-sm dm-sans-regular ${
              disabled
                ? "text-black/50 dark:text-white/50"
                : "text-black dark:text-white"
            }`}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        {error && (
          <p className="text-xs dm-sans-regular text-red-600">{error}</p>
        )}
      </div>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 lg:w-3.5 lg:h-3.5 text-stone-600 dark:text-stone-400" />
        )}

        <input
          type={showPassword ? "text" : "password"}
          className={`
            w-full px-5 py-2 h-10 text-sm rounded-lg dm-sans-regular text-black bg-white dark:bg-darkBG3 dark:text-white transition-colors border border-stone-200 dark:border-stone-800 focus:border-black focus:dark:border-stone-500 focus:ring-transparent focus:outline-none focus:ring-0
            ${Icon ? "pl-8" : "pl-3"}
            ${disabled ? "opacity-40 cursor-not-allowed" : ""}
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : ""
            }
          `}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-600 dark:text-stone-400"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
