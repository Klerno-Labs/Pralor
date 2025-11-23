"use client";

import { useMemo, useState } from "react";
import type { TokenMarket } from "@/lib/tokens/types";
import PriceDashboard from "@/components/tokens/PriceDashboard";

interface TokenOverviewCardProps {
    tokens: TokenMarket[];
}

export function TokenOverviewCard({ tokens }: TokenOverviewCardProps) {
    const [selectedId, setSelectedId] = useState<string>(() => {
        const btc = tokens.find((t) => t.symbol.toLowerCase() === "btc");
        return btc?.id ?? tokens[0]?.id;
    });

    const selected = useMemo(
        () => tokens.find((t) => t.id === selectedId) ?? tokens[0],
        [tokens, selectedId]
    );

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedId(event.target.value);
    };

    if (!selected) return null;

    return (
        <section className="glass-panel p-4 sm:p-6 lg:p-7 flex flex-col gap-4">
            {/* Token Selector */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <img
                        src={selected.image}
                        alt={selected.name}
                        className="h-8 w-8 rounded-full border border-slate-700/70 shadow-sm"
                    />
                    <span className="text-sm text-slate-400">Select token to analyze</span>
                </div>
                <div className="w-full sm:w-auto sm:min-w-[200px]">
                    <div className="relative">
                        <select
                            value={selectedId}
                            onChange={handleSelectChange}
                            className="w-full appearance-none rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 shadow-inner outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/40"
                        >
                            {tokens.map((token) => (
                                <option key={token.id} value={token.id}>
                                    {token.name} ({token.symbol.toUpperCase()})
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">
                            ▼
                        </span>
                    </div>
                </div>
            </div>

            {/* Full PriceDashboard with chart and all features */}
            <PriceDashboard
                tokenName={selected.name}
                symbol={selected.id}
                price={selected.current_price}
                changePercent={selected.price_change_percentage_24h ?? 0}
            />
        </section>
    );
}
