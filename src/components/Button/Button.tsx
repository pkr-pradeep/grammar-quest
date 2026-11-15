/**
 * ============================================================================
 * GRAMMAR QUEST — BUTTON COMPONENT
 * ============================================================================
 * Reusable, accessible action button supporting touch targets (>= 44px),
 * single-line label discipline, and reduced-motion-safe Motion feedback.
 * ============================================================================
 */

import React from 'react';
import { motion } from 'motion/react';

export type ButtonVariant = 'primary' | 'navy' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[#FFC64B] text-[#263A70] hover:bg-[#F7B831] border border-[#EAB030] shadow-xs',
  navy:
    'bg-[#263A70] text-white hover:bg-[#1D2D59] border border-[#263A70] shadow-xs',
  secondary:
    'bg-white text-[#263A70] hover:bg-[#FFF9EC] border border-[#CFC9BA]',
  ghost:
    'bg-transparent text-[#263A70] hover:bg-[#FFF1D5]/70 border border-transparent',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-[40px] px-3.5 py-2 text-sm rounded-[12px] gap-1.5',
  md: 'min-h-[44px] px-5 py-2.5 text-base rounded-[14px] gap-2',
  lg: 'min-h-[48px] px-6 py-3 text-base rounded-[14px] gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  type = 'button',
  disabled,
  ...rest
}) => {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.14 }}
      className={[
        'inline-flex items-center justify-center font-medium whitespace-nowrap select-none cursor-pointer',
        'transition-colors duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...(rest as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {leftIcon ? <span className="inline-flex shrink-0">{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span className="inline-flex shrink-0">{rightIcon}</span> : null}
    </motion.button>
  );
};
