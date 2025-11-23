"use client";

import { useState, useEffect, useCallback } from "react";
import PageShell from "@/components/layout/PageShell";
import { TokenOverviewCard } from "@/components/tokens/TokenOverviewCard";
import { TrendingTokensTable } from "@/components/tokens/TrendingTokensTable";
import { WhaleAlertsPanel } from "@/components/tokens/WhaleAlertsPanel";
import { fetchTopMarketTokens } from "@/lib/tokens/coingecko";
import type { TokenMarket } from "@/lib/tokens/types";

export default function TokensPage() {
  const [tokens, setTokens] = useState<TokenMarket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTokens = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchTopMarketTokens();
      setTokens(data);
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  return (
    <PageShell
      title="Token Intelligence"
      description="Real-time market data, trends, and whale alerts."
    >
      <div className="flex justify-end mb-6">
        <button
          onClick={loadTokens}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
        >
          <svg
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {tokens.length > 0 ? (
        <>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)] mb-5">
            <TokenOverviewCard tokens={tokens} />
            <WhaleAlertsPanel />
          </div>
          <TrendingTokensTable tokens={tokens} />
        </>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-800/50 bg-slate-900/20">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <p className="text-sm text-slate-400">Loading market data...</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-slate-400">Failed to load data.</p>
              <button
                onClick={loadTokens}
                className="mt-2 text-sm text-accent hover:text-accent-light"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
