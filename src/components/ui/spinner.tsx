import * as React from 'react';
import { cn } from '@/lib/utils';

type SpinnerProps = React.HTMLAttributes<HTMLSpanElement> & {
  size?: 'xs' | 'sm' | 'md' | 'lg';
};

export function Spinner({ className, size = 'sm', ...props }: SpinnerProps) {
  const sizes = {
    xs: 'h-3 w-3 border-2',
    sm: 'h-4 w-4 border-2',
    md: 'h-5 w-5 border-[3px]',
    lg: 'h-6 w-6 border-[3px]',
  } as const;

  return (
    <span
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'inline-block animate-spin rounded-full border-transparent border-t-current text-current',
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
