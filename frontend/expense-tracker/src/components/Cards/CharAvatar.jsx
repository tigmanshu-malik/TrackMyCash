import React from "react";
import { getInitials } from "../../utils/helper";

const CharAvatar = ({ fullName = "", width = "w-12", height = "h-12", style = "" }) => {
  const initials = getInitials(fullName);
  const sizeClass = `${width} ${height}`;
  const textSizeClass = width === "w-12" ? "text-base" : "text-lg";

  return (
    <div
      className={`${sizeClass} ${style} flex items-center justify-center rounded-full font-semibold ${textSizeClass} text-gray-900 bg-gray-200 dark:bg-gray-700 dark:text-white`}
      aria-label={`Avatar for ${fullName}`}
      title={fullName}
    >
      {initials}
    </div>
  );
};

export default CharAvatar;
