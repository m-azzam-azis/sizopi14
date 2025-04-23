import type React from "react";
import type { IconProps } from "./interface";

export const X: React.FC<IconProps> = ({
  fill = "fill-[#1A2223]",
  className,
  size,
}) => {
  return (
    <svg
      viewBox="0 0 35 35"
      fill={`${fill}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`${size} ${className}`}
    >
      <path
        d="M27.4792 0.212158H32.6928L21.3027 14.6142L34.7022 34.2122H24.2105L15.993 22.3261L6.59031 34.2122H1.3736L13.5564 18.8075L0.702209 0.212158H11.4603L18.8882 11.0765L27.4792 0.212158ZM25.6494 30.7599H28.5383L9.89055 3.48313H6.79047L25.6494 30.7599Z"
        fill="white"
      />
    </svg>
  );
};
