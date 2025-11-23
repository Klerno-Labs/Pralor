'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12 text-center relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-neon-500/[0.07] rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyber-500/[0.08] rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />

      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto relative z-10"
      >
        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-500/10 border border-neon-500/30 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-500"></span>
          </span>
          <span className="text-sm font-medium text-neon-400">The Future of Finance is Here</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]"
        >
          <span className="text-white">Own Your</span>
          <br />
          <span className="text-neon glow-text bg-gradient-to-r from-neon-400 via-neon-300 to-neon-400 bg-clip-text text-transparent">
            Financial Future
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-lg md:text-xl text-silver-400 max-w-2xl mx-auto leading-relaxed"
        >
          One dashboard. All your crypto. Real-time analytics, AI-powered insights,
          and seamless wallet integration for the next generation of investors.
        </motion.p>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-8 md:gap-12"
        >
          {[
            { value: '50+', label: 'Tokens Tracked' },
            { value: 'Real-time', label: 'Market Data' },
            { value: 'AI', label: 'Research Assistant' },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-silver-500 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard" className="group btn-primary text-lg px-8 py-4 flex items-center gap-3 rounded-2xl">
            <span>Launch Dashboard</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link href="/ai-assistant" className="group btn-cyber text-lg px-8 py-4 flex items-center gap-3 rounded-2xl">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5" />
            </svg>
            <span>Ask AI</span>
          </Link>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
        >
          {[
            { icon: 'TA', title: 'Token Analytics', desc: 'Track 50+ tokens in real-time', accent: 'neon' },
            { icon: 'WC', title: 'Wallet Connect', desc: 'Multi-chain portfolio view', accent: 'cyber' },
            { icon: 'NFT', title: 'NFT Explorer', desc: 'Rarity scores & trait analysis', accent: 'neon' },
            { icon: 'AI', title: 'AI Research', desc: 'GPT-4 powered insights', accent: 'cyber' },
            { icon: 'LV', title: 'Live Activity', desc: 'Real-time transaction feed', accent: 'neon' },
            { icon: 'WH', title: 'Whale Alerts', desc: 'Big money movements', accent: 'cyber' },
                    ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.08 }}
              className={`glass-hover p-4 md:p-5 text-left group cursor-pointer ${
                feature.accent === 'neon' ? 'hover:border-neon-500/30' : 'hover:border-cyber-500/30'
              }`}
            >
              <div className="text-2xl md:text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">
                {feature.icon}
              </div>
              <h3 className={`font-bold text-white group-hover:${feature.accent === 'neon' ? 'text-neon-400' : 'text-cyber-400'} transition-colors`}>
                {feature.title}
              </h3>
              <p className="text-sm text-silver-500 mt-1">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-16 flex items-center justify-center gap-6 text-silver-600 text-sm"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neon-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Secure
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neon-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Fast
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-neon-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Open Source
          </span>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-void-950 to-transparent pointer-events-none" />
    </div>
  )
}
