import React from 'react';
import { cn } from '../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton = ({ className, variant = 'rect' }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200",
        variant === 'circle' ? "rounded-full" : "rounded-xl",
        className
      )}
    />
  );
};
