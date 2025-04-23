import React from "react";
import type { IconProps } from "./interface";

export const Dashboard: React.FC<IconProps> = ({
  fill = "fill-[#000]",
  className,
  size,
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${size} ${className}`}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2 4C2 2.89543 2.89543 2 4 2H9C10.1046 2 11 2.89543 11 4V11C11 12.1046 10.1046 13 9 13H4C2.89543 13 2 12.1046 2 11V4ZM9 4H4V11H9V4Z"
        fill="#253F52"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13 4C13 2.89543 13.8954 2 15 2H20C21.1046 2 22 2.89543 22 4V7C22 8.10457 21.1046 9 20 9H15C13.8954 9 13 8.10457 13 7V4ZM20 4H15V7H20V4Z"
        fill="#253F52"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13 13C13 11.8954 13.8954 11 15 11H20C21.1046 11 22 11.8954 22 13V20C22 21.1046 21.1046 22 20 22H15C13.8954 22 13 21.1046 13 20V13ZM20 13H15V20H20V13Z"
        fill="#253F52"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2 17C2 15.8954 2.89543 15 4 15H9C10.1046 15 11 15.8954 11 17V20C11 21.1046 10.1046 22 9 22H4C2.89543 22 2 21.1046 2 20V17ZM9 17H4V20H9V17Z"
        fill="#253F52"
      />
    </svg>
  );
};
