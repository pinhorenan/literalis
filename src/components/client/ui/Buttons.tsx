// File: src/components/client/ui/Buttons.tsx
'use client';

import React  from 'react';
import clsx   from 'clsx';
import Link   from 'next/link';
import Image  from 'next/image';

export type ButtonVariant =
  | 'default'
  | 'outline'
  | 'destructive'
  | 'card'
  | 'ghost'
  | 'icon'
  | 'logo';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  className?: string;
  href?: string;
  icon?: React.ElementType | React.ReactElement;
  iconSize?: number;
  logoSrc?: string;
  logoAlt?: string;
  logoSize?: number;
}

const baseClasses = [
  'text-[var(--text-primary)]',
  'select-none',
  'focus:outline-none',
  'transition-colors',
  'duration-200',
  'ease-in-out',
  'inline-flex',
  'items-center',
  'justify-center',
];

const variantStyles: Record<ButtonVariant, string> = {
  default:      'rounded-md bg-[var(--surface-bg)] hover:bg-[var(--surface-alt)] border border-[var(--border-base)]',
  outline:      'rounded-md bg-transparent hover:bg-[var(--surface-bg)] border border-[var(--border-base)]',
  destructive:  'rounded-md bg-[var(--color-warning)] hover:bg-[var(--color-danger)]',
  card:         'rounded-md bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)] border border-[var(--border-base)]',
  ghost:        'rounded-md bg-transparent hover:underline',
  icon:         'rounded-full bg-transparent',
  logo:         'bg-transparent p-0',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'p-1 text-xs',
  sm: 'p-2 text-sm',
  md: 'p-3 text-base',
  lg: 'p-4 text-lg',
  xl: 'p-5 text-xl',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      active = false,
      disabled = false,
      className,
      href,
      icon,
      iconSize = 24,
      logoSrc,
      logoAlt = 'logo',
      logoSize = 32,
      onClick,
      children,
      ...rest
    },
    ref
  ) => {
    const isIcon = variant === 'icon';
    const isLogo = variant === 'logo';

    const classes = clsx(
      baseClasses,
      variantStyles[variant],
      sizeStyles[size],
      disabled && 'opacity-50 cursor-not-allowed',
      !disabled && !href && 'cursor-pointer',
      active && (isIcon ? 'fill-current' : 'bg-[var(--surface-bg)] text-[var(--text-primary)]'),
      className
    );

    const content = isIcon && icon
      ? React.isValidElement(icon)
        ? icon
        : React.createElement(icon as React.ElementType, {
            size: iconSize,
            className: clsx(active ? 'fill-current' : 'hover:fill-current'),
          })
      : isLogo && logoSrc
      ? <Image src={logoSrc} alt={logoAlt} width={logoSize} height={logoSize} />
      : children;

    return href ? (
      <Link href={href} className={classes} onClick={onClick as any}>
        {content}
      </Link>
    ) : (
      <button
        ref={ref}
        className={classes}
        disabled={disabled}
        onClick={onClick}
        {...rest}
      >
        {content}
      </button>
    );
  }
);
Button.displayName = 'Button';
