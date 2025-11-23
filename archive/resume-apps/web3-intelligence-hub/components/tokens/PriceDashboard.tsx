"use client"

import React, { useMemo, useState, useEffect } from 'react'

type RangeKey = '1H' | '24H' | '7D' | '1M' | '1Y' | '5Y' | 'ALL'

type Stats = {
  marketCap?: string
  volume24h?: string
  rank?: string
  circulatingSupply?: string
  allTimeHigh?: string
}

type Props = {
  tokenName?: string
  symbol?: string
  price?: number
  changePercent?: number
  stats?: Stats
  series?: Partial<Record<RangeKey, number[]>>
}

const RANGES: RangeKey[] = ['1H', '24H', '7D', '1M', '1Y', '5Y', 'ALL']

function generateSeries(length: number, start = 1000) {
  const out: number[] = []
  let v = start
  for (let i = 0; i < length; i++) {
    const change = (Math.random() - 0.48) * (start * 0.01)
    v = Math.max(0.0001, v + change)
    out.push(Number(v.toFixed(2)))
  }
  return out
}

function getDefaultSeriesFor(range: RangeKey, base = 84000) {
  switch (range) {
    case '1H':
      return generateSeries(60, base)
    case '24H':
      return generateSeries(96, base)
    case '7D':
      return generateSeries(168, base)
    case '1M':
      return generateSeries(720, base)
    case '1Y':
      return generateSeries(365, base)
    case '5Y':
      return generateSeries(1825, base)
    case 'ALL':
      return generateSeries(1000, base)
    default:
      return generateSeries(100, base)
  }
}

function formatCurrency(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(2)}K`
  return `$${n.toFixed(2)}`
}

function PriceChart({ data, range }: { data: Array<[number, number]>; range: RangeKey }) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [size, setSize] = React.useState({ width: 800, height: 280 })
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)
  const [pointerX, setPointerX] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setSize({ width: Math.max(200, Math.floor(r.width)), height: 220 })
    })
    obs.observe(el)
    setSize({ width: Math.max(200, Math.floor(el.getBoundingClientRect().width)), height: 220 })
    return () => obs.disconnect()
  }, [])

  const values = data.map((d) => d[1])
  const min = Math.min(...values)
  const max = Math.max(...values)
  const valueRange = Math.max(1, max - min)

  const padding = 16
  const innerWidth = Math.max(10, size.width - padding * 2)
  const innerHeight = Math.max(10, size.height - padding * 2)

  const points = data.map((d, i) => {
    const v = d[1]
    const x = padding + (i / Math.max(1, data.length - 1)) * innerWidth
    const y = padding + innerHeight - ((v - min) / valueRange) * innerHeight
    return [x, y, v] as const
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ')
  // generate a smooth path using Catmull-Rom to Bezier conversion
  function catmullRom2bezier(pts: Array<[number, number]>) {
    if (!pts || pts.length < 2) return ''
    if (pts.length === 2) return `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} L ${pts[1][0].toFixed(2)} ${pts[1][1].toFixed(2)}`
    const d: string[] = []
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i === 0 ? pts[i] : pts[i - 1]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = i + 2 < pts.length ? pts[i + 2] : p2

      if (i === 0) {
        d.push(`M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`)
      }

      const c1x = p1[0] + (p2[0] - p0[0]) / 6
      const c1y = p1[1] + (p2[1] - p0[1]) / 6
      const c2x = p2[0] - (p3[0] - p1[0]) / 6
      const c2y = p2[1] - (p3[1] - p1[1]) / 6

      d.push(`C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`)
    }
    return d.join(' ')
  }

  const smoothPath = catmullRom2bezier(points.map((p) => [p[0], p[1]]))
  const areaPath = `${smoothPath} L ${padding + innerWidth} ${padding + innerHeight} L ${padding} ${padding + innerHeight} Z`

  // fade animation on data change
  const [visible, setVisible] = React.useState(true)
  React.useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [data.length, data[data.length - 1] && data[data.length - 1][0]])

  // map range -> seconds for timestamp generation
  const secondsMap: Record<RangeKey, number> = {
    '1H': 3600,
    '24H': 24 * 3600,
    '7D': 7 * 24 * 3600,
    '1M': 30 * 24 * 3600,
    '1Y': 365 * 24 * 3600,
    '5Y': 5 * 365 * 24 * 3600,
    'ALL': 0,
  }

  // Use timestamps provided in data tuples
  const timestamps = data.map((d) => d[0])
  const formatTime = (ts: number) => {
    const d = new Date(ts * 1000)
    if (range === '1H' || range === '24H') return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString()
  }

  // pointer handlers
  function handlePointerMove(e: React.PointerEvent) {
    const el = containerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    setPointerX(x)
    const t = Math.max(0, Math.min(innerWidth, x - padding))
    const pct = t / Math.max(1, innerWidth)
    const idx = Math.round(pct * Math.max(0, data.length - 1))
    setHoverIndex(idx)
  }

  function handlePointerLeave() {
    if (!isDragging) setHoverIndex(null)
  }

  function handlePointerDown(e: React.PointerEvent) {
    const el = containerRef.current
    if (!el) return
    try {
      el.setPointerCapture(e.pointerId)
    } catch {}
    setIsDragging(true)
    handlePointerMove(e)
  }

  function handlePointerUp(e: React.PointerEvent) {
    const el = containerRef.current
    if (!el) return
    try {
      el.releasePointerCapture(e.pointerId)
    } catch {}
    setIsDragging(false)
  }

  const hoverPoint = hoverIndex !== null ? points[hoverIndex] : null

  // left-highlight: points up to hover (or full series if no hover)
  const leftIndex = hoverIndex !== null ? hoverIndex : points.length - 1
  const leftPoints = points.slice(0, Math.max(1, leftIndex + 1))
  const leftSmoothPath = catmullRom2bezier(leftPoints.map((p) => [p[0], p[1]]))
  const leftAreaPath = `${leftSmoothPath} L ${leftPoints.length ? leftPoints[leftPoints.length - 1][0].toFixed(2) : padding} ${padding + innerHeight} L ${padding} ${padding + innerHeight} Z`

  const tooltipLeft = Math.max(6, Math.min(pointerX - 80, size.width - 160))

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <svg viewBox={`0 0 ${size.width} ${size.height}`} width="100%" height={size.height} preserveAspectRatio="none">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff7a18" stopOpacity="0.20" />
            <stop offset="40%" stopColor="#ff7a18" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
          <pattern id="dots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(255,122,24,0.12)" />
          </pattern>
        </defs>

        {/* horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line key={`h-${g}`} x1={padding} x2={padding + innerWidth} y1={padding + g * innerHeight} y2={padding + g * innerHeight} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
        ))}

        {/* vertical grid lines */}
        {Array.from({ length: 6 }).map((_, i) => {
          const gx = padding + (i / 5) * innerWidth
          return <line key={`v-${i}`} x1={gx} x2={gx} y1={padding} y2={padding + innerHeight} stroke="rgba(255,255,255,0.02)" strokeWidth={1} />
        })}

        {/* glow (wider, blurred stroke) */}
        <path d={smoothPath} fill="none" stroke="#ff7a18" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" opacity={0.10} filter="url(#glow)" style={{ transition: 'opacity 260ms ease' }} />
        {/* full area (faded) */}
        <path d={areaPath} fill="url(#g1)" style={{ opacity: 0.45, transition: 'opacity 240ms ease' }} />
        {/* dotted overlay to emulate tiled fill */}
        <path d={areaPath} fill="url(#dots)" opacity={0.10} />

        {/* left-highlight area and stronger line up to hover */}
        {leftPoints.length > 1 && (
          <>
            <path d={leftAreaPath} fill="url(#g1)" style={{ opacity: 1, transition: 'opacity 160ms ease' }} />
            <path d={leftSmoothPath} fill="none" stroke="#ff7a18" strokeWidth={3.2} strokeLinejoin="round" strokeLinecap="round" style={{ opacity: 1, transition: 'opacity 160ms ease' }} />
          </>
        )}

        {/* smooth line (subtle full series) */}
        <path d={smoothPath} fill="none" stroke="#ff7a18" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" style={{ opacity: 0.55, transition: 'opacity 260ms ease' }} />

        {/* last value dot */}
        {points.length > 0 && (
          <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r={3.5} fill="#8b5cf6" />
        )}

        {/* hover crosshair & dot (dashed orange divider) */}
        {hoverPoint && (
          <g>
            <line x1={hoverPoint[0]} x2={hoverPoint[0]} y1={padding} y2={padding + innerHeight} stroke="#ff7a18" strokeWidth={1} strokeDasharray="2 6" strokeOpacity={0.9} />
            <circle cx={hoverPoint[0]} cy={hoverPoint[1]} r={4.5} fill="#ff7a18" stroke="#ffffff" strokeWidth={1.5} />
          </g>
        )}

        {/* left axis labels (de-emphasized) */}
        <text x={8} y={padding + 12} fontSize={11} fill="rgba(156,163,175,0.28)">{formatCurrency(max)}</text>
        <text x={8} y={padding + innerHeight} fontSize={11} fill="rgba(107,114,128,0.18)">{formatCurrency(min)}</text>

        {/* bottom time ticks */}
        {points.length > 1 && (() => {
          const nTicks = 6
          const ticks = Array.from({ length: nTicks }).map((_, i) => {
            const idx = Math.round((i / (nTicks - 1)) * (points.length - 1))
            const x = points[idx][0]
            const label = formatTime(timestamps[idx])
            return (<g key={`tick-${i}`}>
              <text x={x} y={padding + innerHeight + 18} fontSize={11} textAnchor="middle" fill="rgba(148,163,184,0.45)">{label}</text>
            </g>)
          })
          return ticks
        })()}
      </svg>

      {/* tooltip */}
      {hoverPoint && hoverIndex !== null && (
        <div style={{ left: tooltipLeft }} className="absolute top-0 z-50 pointer-events-none">
          <div className="relative bg-slate-800 text-white text-sm rounded-md p-2 shadow-md opacity-100" style={{ transformOrigin: 'left top', transition: 'opacity 160ms ease, transform 160ms ease' }}>
            <div className="font-semibold">{formatCurrency(data[hoverIndex][1])}</div>
            <div className="text-xs text-slate-400">{formatTime(timestamps[hoverIndex])}</div>
            <div style={{ position: 'absolute', left: 12, bottom: -6, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid rgba(17,24,39,1)' }} />
          </div>
        </div>
      )}
      {/* Show a small fixed current-price badge when dragging */}
      {(isDragging || hoverIndex !== null) && hoverIndex !== null && (
        <div className="absolute right-4 top-4 z-40 pointer-events-none">
          <div className="bg-white/5 text-white text-sm rounded-md px-3 py-1 shadow-md backdrop-blur-sm">
            <div className="font-semibold">{formatCurrency(data[hoverIndex][1])}</div>
            <div className="text-xs text-slate-300 mt-0.5">{formatTime(timestamps[hoverIndex])}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PriceDashboard({ tokenName = 'Bitcoin', symbol = 'BTC', price = 84000, changePercent = 0.25, stats, series = {} }: Props) {
  const [range, setRange] = useState<RangeKey>('24H')
  // liveSeries stores tuples [timestampSec, price]
  const [liveSeries, setLiveSeries] = useState<Array<[number, number]> | null>(null)
  const [liveStats, setLiveStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)

  const coinId = useMemo(() => {
    const s = symbol?.toLowerCase() || 'btc'
    if (s === 'btc' || s === 'bitcoin') return 'bitcoin'
    if (s === 'eth' || s === 'ethereum') return 'ethereum'
    return s
  }, [symbol])

  useEffect(() => {
    let mounted = true
    let intervalId: any = null

    async function fetchData() {
      setLoading(true)
      try {
        const now = Math.floor(Date.now() / 1000)

        let priceTuples: Array<[number, number]> | null = null
        if (range === 'ALL') {
          const resp = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=max`)
          if (resp.ok) {
            const data = await resp.json()
            priceTuples = (data.prices || []).map((p: any) => [Math.floor(p[0] / 1000), Number(p[1])])
          }
        } else {
          const secondsMap: Record<RangeKey, number> = {
            '1H': 3600,
            '24H': 24 * 3600,
            '7D': 7 * 24 * 3600,
            '1M': 30 * 24 * 3600,
            '1Y': 365 * 24 * 3600,
            '5Y': 5 * 365 * 24 * 3600,
            'ALL': 0,
          }
          const from = now - (secondsMap[range] || 24 * 3600)
          const to = now
          const resp = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`)
          if (resp.ok) {
            const data = await resp.json()
            priceTuples = (data.prices || []).map((p: any) => [Math.floor(p[0] / 1000), Number(p[1])])
          }
        }

        // fetch coin details once
        try {
          const detailsResp = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`)
          if (detailsResp.ok) {
            const d = await detailsResp.json()
            const m: Stats = {
              marketCap: d.market_data?.market_cap?.usd ? `$${Number(d.market_data.market_cap.usd).toLocaleString()}` : undefined,
              volume24h: d.market_data?.total_volume?.usd ? `$${Number(d.market_data.total_volume.usd).toLocaleString()}` : undefined,
              rank: d.market_cap_rank ? `#${d.market_cap_rank}` : undefined,
              circulatingSupply: d.market_data?.circulating_supply ? `${Number(d.market_data.circulating_supply).toLocaleString()} ${d.symbol?.toUpperCase()}` : undefined,
              allTimeHigh: d.market_data?.ath?.usd ? `$${Number(d.market_data.ath.usd).toLocaleString()}` : undefined,
            }
            if (mounted) setLiveStats(m)
          }
        } catch (e) {
          // ignore details errors
        }

        if (mounted) setLiveSeries(priceTuples)
      } catch (e) {
        if (mounted) setLiveSeries(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    // initial fetch
    fetchData()

    // Poll short ranges for near-real-time feel
    const shortRange = range === '1H' || range === '24H'
    if (shortRange) {
      intervalId = setInterval(() => {
        fetchData()
      }, 15_000)
    }

    return () => {
      mounted = false
      if (intervalId) clearInterval(intervalId)
    }
  }, [range, coinId])

  // seriesForRange will be an array of [tsSec, price]
  const seriesForRange = useMemo(() => {
    if (liveSeries && liveSeries.length > 0) return liveSeries
    if (series[range]) {
      // convert numeric arrays to tuples with synthetic timestamps across the range
      const nums = series[range] as number[]
      const now = Math.floor(Date.now() / 1000)
      const secondsMap: Record<RangeKey, number> = {
        '1H': 3600,
        '24H': 24 * 3600,
        '7D': 7 * 24 * 3600,
        '1M': 30 * 24 * 3600,
        '1Y': 365 * 24 * 3600,
        '5Y': 5 * 365 * 24 * 3600,
        'ALL': 0,
      }
      const span = secondsMap[range] || 24 * 3600
      if (!span || span <= 0) {
        // daily timestamps backwards
        return nums.map((p, i) => [now - (nums.length - 1 - i) * 24 * 3600, p] as [number, number])
      }
      const start = now - span
      return nums.map((p, i) => [Math.floor(start + (i / Math.max(1, nums.length - 1)) * span), p] as [number, number])
    }
    return getDefaultSeriesFor(range, price).map((p, i, arr) => {
      const now = Math.floor(Date.now() / 1000)
      const secondsMap: Record<RangeKey, number> = {
        '1H': 3600,
        '24H': 24 * 3600,
        '7D': 7 * 24 * 3600,
        '1M': 30 * 24 * 3600,
        '1Y': 365 * 24 * 3600,
        '5Y': 5 * 365 * 24 * 3600,
        'ALL': 0,
      }
      const span = secondsMap[range] || 24 * 3600
      if (!span || span <= 0) return [now, p] as [number, number]
      const start = now - span
      return [Math.floor(start + (i / Math.max(1, arr.length - 1)) * span), p] as [number, number]
    })
  }, [liveSeries, series, range, price])

  const current = (seriesForRange[seriesForRange.length - 1] && seriesForRange[seriesForRange.length - 1][1]) ?? price
  const displayStats = liveStats ?? stats ?? null
  const displayChangePercent = useMemo(() => {
    try {
      if (!seriesForRange || seriesForRange.length < 2) return changePercent
      const first = seriesForRange[0][1]
      const last = seriesForRange[seriesForRange.length - 1][1]
      if (!first || first === 0) return changePercent
      return Number((((last - first) / first) * 100).toFixed(2))
    } catch {
      return changePercent
    }
  }, [seriesForRange, changePercent])

  // Debug: log range -> series summary to help diagnose stale/duplicate rendering
  React.useEffect(() => {
    try {
      const len = seriesForRange?.length ?? 0
      const first = seriesForRange && seriesForRange[0] ? seriesForRange[0][1] : null
      const last = seriesForRange && seriesForRange[len - 1] ? seriesForRange[len - 1][1] : null
      // use console.debug so it's easy to filter in browser devtools
      // eslint-disable-next-line no-console
      console.debug('[PriceDashboard] range=', range, 'len=', len, 'first=', first, 'last=', last)
    } catch (e) {
      // ignore
    }
  }, [range, seriesForRange])

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-slate-800 w-12 h-12 flex items-center justify-center text-xl font-bold">{symbol[0]}</div>
            <div>
              <div className="text-sm text-slate-400">{tokenName} ({symbol})</div>
              <div className="text-2xl font-semibold">{formatCurrency(current)} <span className={`ml-3 text-sm ${displayChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{displayChangePercent >= 0 ? `+${displayChangePercent}%` : `${displayChangePercent}%`}</span></div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${r === range ? 'bg-slate-700 text-white' : 'bg-transparent text-slate-300 border border-slate-800'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900">
          <div className="text-xs text-slate-400">Market Cap</div>
          <div className="text-lg font-semibold">{displayStats?.marketCap ?? '$1.69T'}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900">
          <div className="text-xs text-slate-400">24H Volume</div>
          <div className="text-lg font-semibold">{displayStats?.volume24h ?? '$43.91B'}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900">
          <div className="text-xs text-slate-400">Rank</div>
          <div className="text-lg font-semibold">{displayStats?.rank ?? '#1'}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900">
          <div className="text-xs text-slate-400">Circulating Supply</div>
          <div className="text-lg font-semibold">{displayStats?.circulatingSupply ?? '19.95M BTC'}</div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-950 p-6">
        <div className="mb-4">
          <PriceChart data={seriesForRange} range={range} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <div className="text-xs text-slate-400">Current Price</div>
            <div className="text-lg font-semibold">{formatCurrency(current)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">All time high</div>
            <div className="text-lg font-semibold">{displayStats?.allTimeHigh ?? '$126,210.50'}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Performance</div>
            <div className={`text-lg font-semibold ${displayChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{displayChangePercent >= 0 ? `+${displayChangePercent}%` : `${displayChangePercent}%`}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
