'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageShellProps {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
  leftActions?: ReactNode
  centerWidth?: string
  topLeftActions?: ReactNode
}

export default function PageShell({ title, description, children, actions, leftActions, centerWidth, topLeftActions }: PageShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative flex-1 p-4 md:p-6 lg:p-8"
    >
      {topLeftActions && (
        <div className="absolute left-4 top-4 sm:left-6 sm:top-6 z-50">
          {topLeftActions}
        </div>
      )}
      {/* Page header */}
      {/* If a centerWidth is provided, center the header content within that max width */}
      {centerWidth ? (
        <div className="w-full flex justify-center mb-8">
          <div className={`${centerWidth} flex items-center justify-start gap-3`}>
            {leftActions && <div className="flex items-center mr-3">{leftActions}</div>}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-silver-400">{description}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            {leftActions && <div className="flex items-center mr-3">{leftActions}</div>}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-silver-400">{description}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}

      {/* Page content */}
      {children}
    </motion.div>
  )
}
