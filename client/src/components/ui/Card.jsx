import { useTheme } from "../../context";

export const Card = ({
  children,
  className = "",
  padding = "default",
  title = "",
  ...props
}) => {
  const { isDark } = useTheme();

  const getPaddingClass = () => {
    switch (padding) {
      case "sm":
        return "p-3";
      case "lg":
        return "p-8";
      case "none":
        return "";
      default:
        return "p-6";
    }
  };

  return (
    <div
      className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg shadow-md border transition-colors duration-200 ${className}`}
      {...props}
    >
      {title && (
        <div
          className={`${getPaddingClass()} border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
        >
          <h3
            className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {title}
          </h3>
        </div>
      )}
      <div className={getPaddingClass()}>{children}</div>
    </div>
  );
};

export default Card;
