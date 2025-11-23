'use client'

import PageShell from '@/components/layout/PageShell'
import TrendingAssets from '@/components/tokens/TrendingAssets'
import FearGreedMeter from '@/components/tokens/FearGreedMeter'

export default function TrendingPage() {
  return (
    <PageShell
      title="Trending"
      description="Top trending assets with real-time buy/sell sentiment analysis."
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fear & Greed Meter - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <FearGreedMeter />
          </div>

          {/* Trending Assets - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <TrendingAssets />
          </div>
        </div>
      </div>
    </PageShell>
  )
}
