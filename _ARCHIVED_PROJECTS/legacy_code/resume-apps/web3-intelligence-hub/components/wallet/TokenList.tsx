'use client'

import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { TRACKED_TOKENS } from '@/lib/wallet/tokens'
import type { TokenBalance } from '@/lib/wallet/types'
import { createPublicClient, erc20Abi, http } from 'viem'
import { mainnet } from 'viem/chains'
import SectionHeader from './SectionHeader'

const client = createPublicClient({
    chain: mainnet,
    transport: http(process.env.NEXT_PUBLIC_RPC_URL),
})

async function fetchTokenBalances(address: `0x${string}`): Promise<TokenBalance[]> {
    const balances: TokenBalance[] = []
    for (const token of TRACKED_TOKENS) {
        try {
            const raw = await client.readContract({
                abi: erc20Abi,
                address: token.address,
                functionName: 'balanceOf',
                args: [address],
            })
            const rawBigInt = raw as bigint
            if (rawBigInt === BigInt(0)) {
                balances.push({
                    token,
                    rawBalance: rawBigInt,
                    formatted: '0',
                })
                continue
            }
            const formatted = Number(
                Number(rawBigInt) / 10 ** token.decimals
            ).toLocaleString(undefined, {
                maximumFractionDigits: 4,
            })
            balances.push({
                token,
                rawBalance: rawBigInt,
                formatted,
            })
        } catch (e) {
            balances.push({
                token,
                rawBalance: BigInt(0),
                formatted: '0',
            })
        }
    }
    return balances
}

export default function TokenList() {
    const { address, isConnected } = useAccount()

    const { data, isLoading } = useQuery({
        queryKey: ['token-balances', address],
        queryFn: () => fetchTokenBalances(address as `0x${string}`),
        enabled: !!address,
    })

    return (
        <section className="rounded-2xl border border-slate-800 bg-card-dark/80 p-4 shadow-soft backdrop-blur">
            <SectionHeader
                title="Token Balances"
                subtitle="Tracked ERC-20 holdings for the connected wallet."
            />
            <div className="mt-3 text-xs">
                {!isConnected && (
                    <p className="text-slate-400">
                        Connect a wallet to see tracked ERC-20 balances (USDC, USDT, WETH, DAI).
                    </p>
                )}
                {isConnected && isLoading && (
                    <div className="space-y-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between rounded-xl bg-slate-900/70 px-3 py-2"
                            >
                                <div className="h-4 w-16 animate-pulse rounded-full bg-slate-800" />
                                <div className="h-4 w-24 animate-pulse rounded-full bg-slate-800" />
                            </div>
                        ))}
                    </div>
                )}
                {isConnected && !isLoading && data && (
                    <div className="space-y-2">
                        {data.map((row) => (
                            <div
                                key={row.token.address}
                                className="flex items-center justify-between rounded-xl bg-slate-900/70 px-3 py-2"
                            >
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-medium text-slate-100">
                                        {row.token.symbol}
                                    </span>
                                    <span className="text-[11px] text-slate-500 font-mono">
                                        {row.token.address}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-[13px] font-semibold text-slate-50">
                                        {row.formatted}
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        {row.rawBalance === BigInt(0) ? 'No holdings' : 'On Ethereum mainnet'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
