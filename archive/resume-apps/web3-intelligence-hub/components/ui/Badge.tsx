interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'purple' | 'neon'
  size?: 'sm' | 'md'
}

const variantClasses = {
  default: 'bg-silver-500/20 text-silver-300 border-silver-500/30',
  success: 'bg-neon-500/15 text-neon-400 border-neon-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  info: 'bg-cyber-500/20 text-cyber-400 border-cyber-500/30',
  purple: 'bg-cyber-500/20 text-cyber-400 border-cyber-500/30',
  neon: 'bg-neon-500/15 text-neon-400 border-neon-500/30 shadow-neon-sm',
}

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
}

export default function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  )
}

interface PriceChangeBadgeProps {
  value: number | undefined
  size?: 'sm' | 'md'
}

export function PriceChangeBadge({ value, size = 'md' }: PriceChangeBadgeProps) {
  if (value === undefined || value === null) {
    return <Badge variant="default" size={size}>-</Badge>
  }

  const isPositive = value >= 0
  const variant = isPositive ? 'success' : 'error'
  const formattedValue = `${isPositive ? '+' : ''}${value.toFixed(2)}%`

  return (
    <Badge variant={variant} size={size}>
      {formattedValue}
    </Badge>
  )
}
