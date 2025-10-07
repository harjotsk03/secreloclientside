import { Loader2 } from "lucide-react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  onClick = () => {},
  pushLeft = false,
  ...props
}) => {
  const variants = {
    primary: `bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white  `,
    secondary:
      "bg-stone-500 hover:bg-stone-600 dark:bg-stone-700 dark:hover:bg-stone-800 text-white  ",
    ghost:
      "bg-transparent hover:bg-stone-200 dark:hover:bg-stone-800 text-gray-700 dark:text-gray-300 border border-stone-300 dark:border-stone-700  ",
    invisible:
      "bg-transparent hover:bg-stone-200 dark:hover:bg-stone-800 text-gray-700 dark:text-gray-300  ",
    destructive:
      "bg-red-600 dark:bg-red-800 hover:bg-red-700 dark:hover:bg-red-900 text-white  ",
    solid:
      "bg-black dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-300 text-white dark:text-black  ",
    deployed:
      "bg-green-500 dark:bg-green-800/30 hover:bg-green-700 dark:hover:bg-green-800/70 text-green-900 hover:text-green-100 dark:text-green-300  ",
    redeploy:
      "bg-yellow-500 dark:bg-yellow-800/30 hover:bg-yellow-700 dark:hover:bg-yellow-800/70 text-yellow-800 dark:text-yellow-300  ",
  };

  const sizes = {
    xs: "px-2 h-6 text-xs",
    sm: "px-4 h-8 text-xs",
    md: "px-4 py-2 text-xs w-max",
    mdFullWidth: "px-4 py-2 text-xs w-full",
    searchSize: "px-4 py-2 text-xs",
    lg: "px-4 py-2 text-sm",
    chatSize: "px-4 h-9 py-0 text-xs",
    xl: "px-4 py-3 text-xs",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center ${
          pushLeft ? "justify-start" : "justify-center"
        } rounded-lg dm-sans-medium whitespace-nowrap tracking-wide transition-all duration-500 ease-in-out
        focus:outline-none
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
      {Icon && iconPosition === "left" && !loading && (
        <Icon className={`w-3.5 h-3.5 ${children && "mr-2"}`} />
      )}
      {children && children}
      {Icon && iconPosition === "right" && !loading && (
        <Icon className={`w-3.5 h-3.5 ${children && "mr-2"}`} />
      )}
    </button>
  );
};
