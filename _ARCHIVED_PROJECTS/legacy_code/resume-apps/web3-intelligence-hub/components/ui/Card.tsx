'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-5',
  lg: 'p-5 md:p-6',
}

export default function Card({
  children,
  className = '',
  hover = false,
  gradient = false,
  padding = 'md',
}: CardProps) {
  const baseClasses = gradient ? 'glass-intense' : 'glass'
  const hoverClasses = hover ? 'hover:bg-void-600/60 hover:border-neon-500/20 hover:shadow-neon-sm cursor-pointer' : ''
  const paddingClass = paddingClasses[padding]

  return (
    <motion.div
      whileHover={hover ? { scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
      className={`${baseClasses} ${hoverClasses} ${paddingClass} transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  change?: {
    value: number
    isPositive: boolean
  }
  icon?: ReactNode
  hint?: string
}

export function StatCard({ label, value, change, icon, hint }: StatCardProps) {
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 font-medium ${change.isPositive ? 'text-neon-400' : 'text-red-400'}`}>
              {change.isPositive ? '+' : ''}{change.value.toFixed(2)}%
            </p>
          )}
          {hint && <p className="text-xs text-silver-500 mt-1">{hint}</p>}
        </div>
        {icon && (
          <div className="p-2 rounded-xl bg-neon-500/10 text-neon-400 border border-neon-500/20">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
  href: string
}

export function FeatureCard({ title, description, icon, href }: FeatureCardProps) {
  return (
    <a href={href}>
      <Card hover gradient className="h-full group">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-neon-500/15 to-neon-400/5 text-neon-400 border border-neon-500/20 group-hover:border-neon-500/40 group-hover:shadow-neon-sm transition-all">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white group-hover:text-neon-300 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-silver-400 mt-1">{description}</p>
          </div>
          <svg
            className="w-5 h-5 text-silver-600 group-hover:text-neon-400 group-hover:translate-x-1 transition-all"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Card>
    </a>
  )
}
