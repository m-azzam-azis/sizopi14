import React from 'react';
import type { IconProps } from './interface';

export const Chevron: React.FC<IconProps> = ({
  fill = 'fill-[#000]',
  className,
  size,
}) => {
  return (
    <svg className={`${className} ${size}`} viewBox="0 0 24 24" fill="none">
      <path
        d="M16.59 8.29504L12 12.875L7.41 8.29504L6 9.70504L12 15.705L18 9.70504L16.59 8.29504Z"
        className={fill}
      />
    </svg>
  );
};
