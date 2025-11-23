'use client'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  strokeColor?: string
  fillColor?: string
  className?: string
}

export default function Sparkline({
  data,
  width = 100,
  height = 32,
  strokeColor,
  fillColor,
  className = '',
}: SparklineProps) {
  if (!data || data.length < 2) {
    return <div className={`w-[${width}px] h-[${height}px] bg-void-700/50 rounded animate-pulse`} />
  }

  // Determine if price is up or down
  const isUp = data[data.length - 1] >= data[0]
  const defaultStroke = isUp ? '#00ff6a' : '#ef4444' // neon-500 or red-500
  const defaultFill = isUp ? 'rgba(0, 255, 106, 0.1)' : 'rgba(239, 68, 68, 0.1)'

  const stroke = strokeColor || defaultStroke
  const fill = fillColor || defaultFill

  // Calculate points
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const padding = 2
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2

  const points = data.map((value, i) => {
    const x = padding + (i / (data.length - 1)) * innerWidth
    const y = padding + innerHeight - ((value - min) / range) * innerHeight
    return `${x},${y}`
  })

  const linePath = `M ${points.join(' L ')}`
  const areaPath = `${linePath} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      {/* Gradient fill */}
      <defs>
        <linearGradient id={`sparkline-gradient-${isUp ? 'up' : 'down'}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={fill} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Area */}
      <path
        d={areaPath}
        fill={`url(#sparkline-gradient-${isUp ? 'up' : 'down'})`}
      />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* End dot */}
      <circle
        cx={width - padding}
        cy={padding + innerHeight - ((data[data.length - 1] - min) / range) * innerHeight}
        r={2.5}
        fill={stroke}
      />
    </svg>
  )
}
