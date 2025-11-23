"use client";

import { useEffect, useMemo, useState } from "react";
import type { WhaleAlert } from "@/lib/tokens/types";

const TOKENS = [
    { symbol: "BTC", name: "Bitcoin", color: "bg-amber-400" },
    { symbol: "ETH", name: "Ethereum", color: "bg-indigo-400" },
    { symbol: "XRP", name: "XRP", color: "bg-sky-400" },
    { symbol: "SOL", name: "Solana", color: "bg-emerald-400" },
    { symbol: "USDT", name: "Tether", color: "bg-lime-400" },
];

const VENUES = [
    "Binance",
    "Coinbase Pro",
    "Kraken",
    "OKX",
    "Bybit",
    "Bitfinex",
];

function randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function createMockAlert(now: Date): WhaleAlert & { colorClass: string } {
    const token = TOKENS[Math.floor(Math.random() * TOKENS.length)];
    const directionIndex = Math.floor(Math.random() * 3);
    const direction =
        directionIndex === 0
            ? "exchange_to_wallet"
            : directionIndex === 1
                ? "wallet_to_exchange"
                : "wallet_to_wallet";

    const amount = randomBetween(5, 40);
    const usdValue = amount * randomBetween(500, 40000);
    const venue = VENUES[Math.floor(Math.random() * VENUES.length)];

    return {
        id: `${now.getTime()}-${Math.random().toString(16).slice(2)}`,
        tokenSymbol: token.symbol,
        tokenName: token.name,
        direction,
        amount,
        usdValue,
        venue,
        createdAt: now.toISOString(),
        colorClass: token.color,
    };
}

function timeAgo(createdAt: string) {
    const created = new Date(createdAt);
    const diff = Date.now() - created.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "just now";
    if (minutes === 1) return "1 min ago";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
}

export function WhaleAlertsPanel() {
    const [alerts, setAlerts] = useState<(WhaleAlert & { colorClass: string })[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Initialize alerts on client-side only
        const now = new Date();
        const initialAlerts = Array.from({ length: 6 }).map((_, idx) => {
            const past = new Date(now.getTime() - (idx + 1) * 5 * 60 * 1000);
            return createMockAlert(past);
        });
        setAlerts(initialAlerts);
        setMounted(true);

        // Auto-generate new alerts
        const interval = setInterval(() => {
            setAlerts((prev) => {
                const next = [createMockAlert(new Date()), ...prev];
                return next.slice(0, 20);
            });
        }, 35000);

        return () => clearInterval(interval);
    }, []);

    const decoratedAlerts = useMemo(
        () =>
            alerts.map((alert) => ({
                ...alert,
                label:
                    alert.direction === "exchange_to_wallet"
                        ? "moved from exchange to wallet"
                        : alert.direction === "wallet_to_exchange"
                            ? "sent from wallet to exchange"
                            : "transferred between wallets",
            })),
        [alerts]
    );

    return (
        <section className="glass-panel p-4 sm:p-5 lg:p-6 flex flex-col h-full">
            <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                    <p className="section-title">Whale alerts</p>
                    <p className="text-sm text-slate-400">
                        Simulated large on-chain movements for situational awareness.
                    </p>
                </div>
                <span className="inline-flex items-center whitespace-nowrap rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-300 border border-emerald-500/30">
                    Live feed
                </span>
            </div>

            <div className="relative flex-1 min-h-[300px]">
                <div className="absolute inset-0 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/70">
                    {!mounted ? (
                        <div className="flex items-center justify-center h-full text-sm text-slate-400">
                            Loading alerts...
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-800/80">
                            {decoratedAlerts.map((alert, idx) => (
                                <li
                                    key={alert.id}
                                    className={`px-3.5 py-3 sm:px-4 flex items-start gap-3 ${idx === 0 ? "bg-slate-900/70" : "bg-transparent"
                                        }`}
                                >
                                    <div
                                        className={`mt-1 h-7 w-7 flex items-center justify-center rounded-full ${alert.colorClass} text-slate-950 font-semibold text-xs shadow-md`}
                                    >
                                        {alert.tokenSymbol}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-xs sm:text-sm text-slate-100">
                                            <span className="font-semibold">
                                                {alert.amount.toLocaleString(undefined, {
                                                    maximumFractionDigits: 2,
                                                })}{" "}
                                                {alert.tokenSymbol}
                                            </span>{" "}
                                            <span className="text-slate-400">{alert.label}</span>
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            Est. value{" "}
                                            <span className="font-medium text-slate-100">
                                                ${alert.usdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </span>{" "}
                                            via {alert.venue}
                                        </p>
                                    </div>
                                    <div className="mt-1 text-[10px] text-slate-500 whitespace-nowrap">
                                        {timeAgo(alert.createdAt)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
}
