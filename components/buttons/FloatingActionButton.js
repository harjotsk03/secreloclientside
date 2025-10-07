export const FloatingActionButton = ({
  children,
  onClick = () => {},
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 w-12 h-12 bg-blue-600 hover:bg-blue-700
        text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out
        flex items-center justify-center z-50
        ${className}
      `}
    >
      {children}
    </button>
  );
};
