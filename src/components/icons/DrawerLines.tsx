import React from "react";
import type { IconProps } from "./interface";

export const DrawerLines: React.FC<IconProps> = ({
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
        d="M2.00002 6C2.00002 5.44772 2.44773 5 3.00002 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3.00002C2.44773 7 2.00002 6.55228 2.00002 6Z"
        fill="#253F52"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.00002 12C2.00002 11.4477 2.44773 11 3.00002 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H3.00002C2.44773 13 2.00002 12.5523 2.00002 12Z"
        fill="#253F52"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.00002 18C2.00002 17.4477 2.44773 17 3.00002 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H3.00002C2.44773 19 2.00002 18.5523 2.00002 18Z"
        fill="#253F52"
      />
    </svg>
  );
};
