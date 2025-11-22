'use client';

import { motion, useAnimation, useInView, Variants, Transition } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef, useEffect, useRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glass';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  glowEffect?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700',
  secondary: 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800',
  ghost: 'bg-transparent text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
  glass: 'backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const roundedStyles = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
};

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      isLoading = false,
      glowEffect = true,
      rounded = 'lg',
      size = 'md',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const controls = useAnimation();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const isInView = useInView(buttonRef, { once: true });

    useEffect(() => {
      if (isInView) {
        controls.start('visible');
      }
    }, [controls, isInView]);

    const handleHoverStart = () => {
      controls.start('hover');
    };

    const handleHoverEnd = () => {
      controls.start('rest');
    };

    const buttonVariants: Variants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { 
          duration: 0.6, 
          ease: [0.16, 1, 0.3, 1] as any, // Type assertion for easing array
        },
      },
      hover: {
        scale: 1.02,
        transition: { duration: 0.3, ease: 'easeOut' },
      },
      rest: {
        scale: 1,
        transition: { duration: 0.3, ease: 'easeInOut' },
      },
      tap: {
        scale: 0.98,
      },
    };

    return (
      <motion.div
        initial="hidden"
        animate={controls}
        variants={buttonVariants}
        className={cn('inline-block', className)}
      >
        <motion.button
          ref={(node) => {
            if (ref) {
              if (typeof ref === 'function') {
                ref(node);
              } else {
                (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
              }
            }
            (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          }}
          className={cn(
            'relative overflow-hidden font-medium tracking-wide transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transform-gpu', // Enable GPU acceleration
            variantStyles[variant],
            sizeStyles[size],
            roundedStyles[rounded],
            'shadow-lg hover:shadow-xl',
            'active:scale-[0.99]',
            'transition-all duration-200 ease-in-out',
            'border-0',
            'select-none',
            'will-change-transform' // Optimize for animations
          )}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          whileTap="tap"
          disabled={disabled || isLoading}
          onClick={props.onClick}
          type={props.type as 'button' | 'submit' | 'reset' | undefined}
        >
          {glowEffect && (
            <motion.span
              className={cn(
                'absolute inset-0 opacity-0 group-hover:opacity-100',
                'bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20',
                'transition-opacity duration-300'
              )}
              initial={{ opacity: 0 }}
              animate={controls}
              variants={{
                hover: {
                  opacity: 1,
                  transition: { duration: 0.6, ease: 'easeOut' },
                },
                rest: {
                  opacity: 0,
                  transition: { duration: 0.3 },
                },
              }}
            />
          )}
          
          <motion.span
            className={cn(
              'relative z-10 flex items-center justify-center gap-2',
              'transition-all duration-300',
              isLoading ? 'opacity-0' : 'opacity-100'
            )}
          >
            {children}
          </motion.span>
          
          {isLoading && (
            <motion.span
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="h-5 w-5 rounded-full border-2 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </motion.span>
          )}
          
          {/* Subtle shine effect on hover */}
          <motion.span
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={controls}
            variants={{
              hover: {
                opacity: 1,
                transition: { duration: 0.6, ease: 'easeOut' },
              },
              rest: {
                opacity: 0,
                transition: { duration: 0.3 },
              },
            }}
          >
            <motion.span
              className="absolute -inset-12 -rotate-12 bg-gradient-to-r from-white/20 via-white/60 to-white/20"
              initial={{ x: '-100%' }}
              animate={{
                x: '100%',
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            />
          </motion.span>
        </motion.button>
      </motion.div>
    );
  }
);

GradientButton.displayName = 'GradientButton';
