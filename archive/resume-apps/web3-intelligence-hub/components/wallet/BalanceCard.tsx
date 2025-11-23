'use client'

import { useAccount, useBalance } from 'wagmi'
import SectionHeader from './SectionHeader'

export default function BalanceCard() {
    const { address, isConnected } = useAccount()
    const { data, isLoading, isError } = useBalance({
        address,
        query: { enabled: !!address },
    })

    let content: JSX.Element

    if (!isConnected) {
        content = (
            <p className="text-xs text-slate-400">
                Connect a wallet to see your ETH balance.
            </p>
        )
    } else if (isLoading) {
        content = (
            <div className="h-7 w-32 animate-pulse rounded-full bg-slate-800" />
        )
    } else if (isError || !data) {
        content = (
            <p className="text-xs text-red-300">
                Unable to load balance. Check RPC or try again.
            </p>
        )
    } else {
        content = (
            <div className="flex flex-col gap-1">
                <span className="text-2xl font-semibold tracking-tight">
                    {Number(data.formatted).toFixed(4)} ETH
                </span>
                <span className="text-[11px] text-slate-400">
                    On Ethereum mainnet
                </span>
            </div>
        )
    }

    return (
        <section className="rounded-2xl border border-slate-800 bg-card-dark/80 p-4 shadow-soft backdrop-blur">
            <SectionHeader
                title="ETH Balance"
                subtitle="Live balance for the connected wallet."
            />
            <div className="mt-3">{content}</div>
        </section>
    )
}
