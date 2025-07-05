// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// util do shad/cn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
