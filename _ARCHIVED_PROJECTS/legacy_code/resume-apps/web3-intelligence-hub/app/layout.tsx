import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/layout/Providers'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Web3 Intelligence Hub | Premium Crypto Dashboard',
  description: 'A unified Web3 + AI intelligence platform for token analytics, NFT exploration, wallet management, and crypto research.',
  keywords: ['Web3', 'Crypto', 'NFT', 'DeFi', 'AI', 'Dashboard', 'Wallet'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-void-900 text-white antialiased`}>
        <Providers>
          <div className="relative min-h-screen bg-mesh bg-grid">
            {/* Sidebar - hidden on mobile */}
            <Sidebar />

            {/* Main content area */}
            <div className="lg:ml-64 flex flex-col min-h-screen">
              <Topbar />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
