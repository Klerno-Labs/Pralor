import { TokenMarket } from "@/lib/tokens/types";

const COINGECKO_BASE = process.env.COINGECKO_API_BASE ?? "https://api.coingecko.com/api/v3";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
    const url = `${COINGECKO_BASE}${path}`;
    const res = await fetch(url, {
        ...init,
        headers: {
            "Accept": "application/json",
            ...(init?.headers ?? {}),
        },
        // Let Next.js handle caching via `next` options at call-site
    });

    if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error("CoinGecko API error", res.status, await res.text());
        throw new Error("Failed to fetch from CoinGecko");
    }

    return res.json() as Promise<T>;
}

export async function fetchTopMarketTokens(): Promise<TokenMarket[]> {
    const params = new URLSearchParams({
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: "50",
        page: "1",
        sparkline: "true",
        price_change_percentage: "24h",
    });

    const data = await fetchJson<TokenMarket[]>(`/coins/markets?${params.toString()}`);
    return data;
}
