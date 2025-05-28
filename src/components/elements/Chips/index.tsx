"use client";
import { cloneElement, useState } from "react";
import type { chipInterface } from "./interface";

export const Chips = function ({
  textContent,
  type,
  icon,
  onClick,
}: chipInterface) {
  const [isSelected, setIsSelected] = useState(false);

  const buttonPadding =
    type === "p1" && icon
      ? "px-[7px] py-[3px] text-s9"
      : type === "p1" && !icon
      ? "px-[8px] py-[3px] text-s8"
      : type === "p2"
      ? "px-[11px] py-[7px] text-s8"
      : "px-[15px] py-[7px] text-s7";

  const selectedStyle = isSelected
    ? "bg-orange-500 border-1 border-orange-500 text-white"
    : "bg-transparent hover:bg-orange-050 border-1 border-orange-500";

  return (
    <button
      onClick={() => {
        setIsSelected(!isSelected);
        if (onClick) {
          onClick();
        }
      }}
      className={`h-fit w-fit flex items-center justify-center font-jakarta text-orange-500 gap-1 rounded-[100px] duration-200 bg-gradient ${selectedStyle} ${buttonPadding}`}
    >
      {icon &&
        type !== "p1" &&
        cloneElement(
          icon as React.ReactElement,
          {
            width: 13,
            height: 13,
            className: `shrink-0 `,
            stroke: isSelected ? "#ffffff" : "#ee7e4c",
            style: {
              stroke: isSelected ? "#ffffff" : "#ee7e4c",
            },
          } as React.SVGProps<SVGSVGElement>
        )}
      {icon &&
        type === "p1" &&
        cloneElement(
          icon as React.ReactElement,
          {
            width: 10,
            height: 10,
            className: `shrink-0 `,
            stroke: isSelected ? "#ffffff" : "#ee7e4c",
            style: {
              stroke: isSelected ? "#ffffff" : "#ee7e4c",
            },
          } as React.SVGProps<SVGSVGElement>
        )}
      {textContent}
    </button>
  );
};
