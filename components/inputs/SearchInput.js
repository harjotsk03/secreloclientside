import { Search, Loader2 } from "lucide-react";

export const SearchInput = ({
  placeholder = "Search...",
  value = "",
  onChange = () => {},
  onSearch = () => {},
  disabled = false,
  icon: Icon,
  loading = false,
  bgDark = false,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full focus:ring-transparent focus:outline-none focus:ring-0"
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-5 py-2 h-10 text-sm rounded-lg dm-sans-regular text-black bg-white dark:bg-darkBG3 dark:text-white transition-colors border border-stone-200 dark:border-stone-800 focus:border-black focus:dark:border-stone-500 focus:ring-transparent focus:outline-none focus:ring-0
          ${Icon ? "pl-8" : "pl-3"}
          ${disabled ? "opacity-40 cursor-not-allowed" : ""}
        `}
      />

      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 lg:w-4 lg:h-4 text-stone-600 dark:text-stone-400" />
      )}

      {loading && (
        <div className="absolute right-3 top-0 h-full flex items-center justify-center focus:ring-transparent focus:outline-none focus:ring-0">
          <Loader2
            className={`w-4 h-4 animate-spin text-blue-500 dark:text-blue-600`}
          />
        </div>
      )}
    </form>
  );
};
