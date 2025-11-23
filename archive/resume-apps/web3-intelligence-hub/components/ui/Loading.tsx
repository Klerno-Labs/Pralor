'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} text-amethyst-400 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className = '' }: LoadingDotsProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-amethyst-400"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'circle' | 'rect'
}

export function LoadingSkeleton({ className = '', variant = 'text' }: LoadingSkeletonProps) {
  const baseClasses = 'bg-void-600/50 animate-pulse'
  const variantClasses = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  }

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
}

interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message = 'Loading...' }: LoadingPageProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
      <div className="relative">
        <div className="absolute inset-0 blur-xl bg-amethyst-500/30 animate-pulse" />
        <LoadingSpinner size="lg" />
      </div>
      <p className="text-silver-400 text-sm">{message}</p>
    </div>
  )
}

interface LoadingCardProps {
  lines?: number
}

export function LoadingCard({ lines = 3 }: LoadingCardProps) {
  return (
    <div className="glass p-4 space-y-3">
      <LoadingSkeleton className="w-1/3 h-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingSkeleton
          key={i}
          className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  )
}
