'use client'

import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig, chains } from '@/lib/web3/config'
import { useState, useEffect, type ReactNode } from 'react'
import { reconnect } from '@wagmi/core'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  // Create a new QueryClient for each session to prevent SSR issues
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  // Handle hydration and reconnect
  useEffect(() => {
    setMounted(true)
    reconnect(wagmiConfig)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={chains[0]}
          theme={darkTheme({
            accentColor: '#8b5cf6', // violet-500
            accentColorForeground: 'white',
            borderRadius: 'medium',
            overlayBlur: 'small',
          })}
          modalSize="wide"
          showRecentTransactions={true}
          appInfo={{
            appName: 'Web3 Intelligence Hub',
            learnMoreUrl: 'https://metamask.io/download/',
            disclaimer: ({ Text, Link }) => (
              <Text>
                No wallet installed?{' '}
                <Link href="https://metamask.io/download/">
                  Download MetaMask here
                </Link>
              </Text>
            ),
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
