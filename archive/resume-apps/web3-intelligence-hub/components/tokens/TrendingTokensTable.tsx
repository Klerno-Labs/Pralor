"use client";

import { useMemo, useState } from "react";
import type { TokenMarket, TokenSortKey } from "@/lib/tokens/types";
import { TrendPill } from "./TrendPill";

interface TrendingTokensTableProps {
    tokens: TokenMarket[];
}

function formatNumber(value: number | null | undefined, options?: Intl.NumberFormatOptions) {
    if (value == null || Number.isNaN(value)) return "—";
    return new Intl.NumberFormat(undefined, options).format(value);
}

export function TrendingTokensTable({ tokens }: TrendingTokensTableProps) {
    const [sortKey, setSortKey] = useState<TokenSortKey>("market_cap");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    const sortedTokens = useMemo(() => {
        const copy = [...tokens].slice(0, 20);
        copy.sort((a, b) => {
            const av = (a as any)[sortKey] ?? 0;
            const bv = (b as any)[sortKey] ?? 0;
            const diff = av - bv;
            return sortDir === "asc" ? diff : -diff;
        });
        return copy;
    }, [tokens, sortKey, sortDir]);

    const toggleSort = (key: TokenSortKey) => {
        if (key === sortKey) {
            setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    return (
        <section className="glass-panel p-4 sm:p-6 lg:p-7 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="section-title">Trending tokens</p>
                    <p className="text-sm text-slate-400">
                        Top 20 by market cap with live 24h performance.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="hidden sm:inline-block">Sort by</span>
                    <div className="inline-flex overflow-hidden rounded-full border border-slate-700/80 bg-slate-900/70 text-[11px]">
                        {([
                            ["market_cap", "Mkt cap"],
                            ["current_price", "Price"],
                            ["price_change_percentage_24h", "24h %"],
                        ] as [TokenSortKey, string][]).map(([key, label]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => toggleSort(key)}
                                className={`px-2.5 py-1.5 transition ${sortKey === key
                                        ? "bg-accent-soft text-slate-50"
                                        : "text-slate-400 hover:bg-slate-800/80"
                                    }`}
                            >
                                {label}
                                {sortKey === key && (
                                    <span className="ml-1 text-[9px]">
                                        {sortDir === "asc" ? "↑" : "↓"}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60">
                <table className="min-w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-[0.18em]">
                        <tr>
                            <th className="px-3 py-2 sm:px-4">#</th>
                            <th className="px-3 py-2 sm:px-4">Token</th>
                            <th className="px-3 py-2 sm:px-4 text-right">Price</th>
                            <th className="px-3 py-2 sm:px-4 text-right">24h %</th>
                            <th className="px-3 py-2 sm:px-4 text-right hidden sm:table-cell">
                                Market cap
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTokens.map((token) => (
                            <tr
                                key={token.id}
                                className="border-t border-slate-800/70 text-slate-200 hover:bg-slate-900/70 transition-colors"
                            >
                                <td className="px-3 py-2 sm:px-4 text-[11px] text-slate-500">
                                    {token.market_cap_rank ?? "—"}
                                </td>
                                <td className="px-3 py-2 sm:px-4">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={token.image}
                                            alt={token.name}
                                            className="h-5 w-5 rounded-full border border-slate-700/70"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-xs sm:text-sm font-medium">
                                                {token.name}
                                            </span>
                                            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                                {token.symbol}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-3 py-2 sm:px-4 text-right font-mono text-xs">
                                    ${formatNumber(token.current_price, { maximumFractionDigits: 4 })}
                                </td>
                                <td className="px-3 py-2 sm:px-4 text-right">
                                    <TrendPill value={token.price_change_percentage_24h ?? 0} />
                                </td>
                                <td className="px-3 py-2 sm:px-4 text-right text-xs hidden sm:table-cell">
                                    ${formatNumber(token.market_cap, {
                                        notation: "compact",
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
