'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      richColors
      toastOptions={{
        classNames: {
          toast:
            'bg-[var(--theme-color-popover)] border border-[var(--theme-color-border)] shadow-sm',
          title: 'text-[var(--theme-color-text-primary)]',
          description: 'text-[var(--theme-color-text-secondary)]',
          actionButton: 'bg-[var(--theme-color-brand-primary)] text-white',
          cancelButton: 'bg-transparent border',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
