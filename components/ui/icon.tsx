import React from 'react';
import { cn } from '@/lib/utils';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number;
  filled?: boolean;
  weight?: 200 | 300 | 400 | 500 | 600 | 700;
}

function inferFontSize(className?: string): number | undefined {
  if (!className) return undefined;
  const textPx = className.match(/\btext-\[(\d+)px\]/);
  if (textPx) return Number(textPx[1]);
  if (/\b(?:h-3\.5|size-3\.5)\b/.test(className)) return 14;
  if (/\b(?:h-3|size-3)\b/.test(className)) return 12;
  if (/\b(?:h-4|size-4)\b/.test(className)) return 16;
  if (/\b(?:h-5|size-5)\b/.test(className)) return 20;
  if (/\b(?:h-6|size-6)\b/.test(className)) return 24;
  if (/\b(?:h-8|size-8)\b/.test(className)) return 32;
  if (/\b(?:h-10|size-10)\b/.test(className)) return 40;
  return undefined;
}

export function Icon({
  name,
  size,
  className,
  filled = false,
  weight = 300,
  style,
  ...props
}: IconProps) {
  const computedSize = size ?? inferFontSize(className);

  return (
    <span
      aria-hidden="true"
      className={cn(
        'material-symbols-outlined inline-flex shrink-0 items-center justify-center select-none leading-none',
        className
      )}
      style={{
        ...(computedSize ? { fontSize: `${computedSize}px` } : {}),
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${computedSize && computedSize <= 20 ? 20 : 24}`,
        ...style,
      }}
      {...props}
    >
      {name}
    </span>
  );
}
