'use client';

import React, { useId } from 'react';
import clsx from 'clsx';

interface SVGProps {
  className?: string;
}

// Círculo sólido com 30% de opacidade usando a cor de accent
export function CircleVector({ className }: SVGProps) {
  return (
    <svg
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
      // fill-current faz fill=currentColor; text-accent/30 define currentColor
      className={clsx('text-accent/30 fill-current', className)}
    >
      <circle cx="150" cy="150" r="140" />
    </svg>
  );
}

// Círculo com gradiente radial usando currentColor
export function GradientCircleVector({ className }: SVGProps) {
  const gradientId = useId();
  return (
    <svg
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('text-accent', className)}
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="150" r="140" fill={`url(#${gradientId})`} />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 60 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 110 110"
      xmlns="http://www.w3.org/2000/svg"
      // fill-current + text-foreground define a cor de preenchimento e stroke-current aplica stroke igual a currentColor
      className={clsx('text-primary fill-current stroke-current', className)}
    >
      <g strokeWidth="1">
        <path d="M81.6568 80.0517H107.827C107.827 80.0517 107.827 61.3533 107.827 47.4655C107.827 40.2427 100.929 31.1596 87.7803 31.7947C78.3965 31.5985 67.9054 38.7721 67.6049 47.4655C66.9788 65.58 67.4484 74.6657 67.6049 80.0517H81.6568Z" />
        <path d="M46.5556 1H23.5772V40.5259V80.0517H46.5556V1Z" />
        <path d="M23.5772 1H46.5556V80.0517M23.5772 1V40.5259V80.0517H46.5556M23.5772 1H2V47.4655V106L23.5772 86.0862L46.5556 106V80.0517M67.6049 80.0517C67.4484 74.6657 66.9788 65.58 67.6049 47.4655C67.9054 38.7721 78.3965 31.5985 87.7804 31.7947C100.929 31.1596 107.827 40.2427 107.827 47.4655C107.827 61.3533 107.827 80.0517 107.827 80.0517H81.6568H67.6049ZM67.6049 80.0517H46.5556" />
      </g>
    </svg>
  );
}
