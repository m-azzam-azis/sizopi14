import type { ReactNode } from 'react';

export interface chipInterface {
  textContent: string;
  type: 'p1' | 'p2' | 'p3';
  icon?: ReactNode;
  onClick?: () => void;
}
