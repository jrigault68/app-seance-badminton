const StyledButton = ({ children, className = "", fullWidth = true, ...props }) => {
  return (
    <button
      {...props}
      className={`bg-red-800 hover:bg-red-700 active:bg-red-900 text-white px-4 py-2 rounded-2xl shadow-md transition-all duration-300 ${
        fullWidth ? "w-full" : ""
      } text-lg font-semibold ${className}`}
    >
      {children}
    </button>
  );
};

export default StyledButton;