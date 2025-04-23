import React from "react";
import type { IconProps } from "./interface";

export const Facebook: React.FC<IconProps> = ({
  fill = "fill-[#1A2223]",
  className,
  size,
}) => {
  return (
    <svg
      viewBox="0 0 38 39"
      fill={`${fill}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`${size} ${className}`}
    >
      <path
        d="M37.9953 19.5473C37.9953 9.09871 29.5153 0.618652 19.0666 0.618652C8.61799 0.618652 0.137939 9.09871 0.137939 19.5473C0.137939 28.7088 6.64941 36.3371 15.2809 38.0975V25.226H11.4952V19.5473H15.2809V14.8152C15.2809 11.1619 18.2527 8.19013 21.9059 8.19013H26.6381V13.8687H22.8524C21.8113 13.8687 20.9595 14.7205 20.9595 15.7616V19.5473H26.6381V25.226H20.9595V38.3814C30.5185 37.435 37.9953 29.3713 37.9953 19.5473Z"
        fill="#ECF1F4"
      />
    </svg>
  );
};
