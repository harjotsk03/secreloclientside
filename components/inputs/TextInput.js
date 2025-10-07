import { useTheme } from "../../context/ThemeContext";

export const TextInput = ({
  label,
  multiline = false,
  placeholder = "",
  value = "",
  onChange = () => {},
  onKeyDown,
  error = "",
  type = "text",
  disabled = false,
  required = false,
  icon: Icon,
  ...props
}) => {
  const { theme } = useTheme();
  const Component = multiline ? "textarea" : "input";

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-end">
        {label && (
          <label
            className={`block text-xs lg:text-sm dm-sans-regular mb-1.5 ${
              disabled
                ? "text-black/60 dark:text-white/50"
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
          <Icon
            className={`absolute left-3 ${
              multiline ? "top-3" : "top-1/2 transform -translate-y-1/2"
            }  w-3 h-3 lg:w-3.5 lg:h-3.5 text-stone-600 dark:text-stone-400`}
          />
        )}
        <Component
          onKeyDown={onKeyDown}
          className={`
    w-full px-5 py-2 h-10 text-sm rounded-lg dm-sans-regular text-black bg-white dark:bg-darkBG3 dark:text-white transition-colors border border-stone-200 dark:border-stone-800 focus:border-black focus:dark:border-stone-500 focus:ring-transparent focus:outline-none focus:ring-0
    ${Icon ? "pl-8" : "pl-3"}
    ${multiline ? "min-h-32 resize-vertical" : "h-9"}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
  `}
          placeholder={placeholder}
          {...(Component === "input" ? { type } : {})}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          {...props}
        />
      </div>
    </div>
  );
};
