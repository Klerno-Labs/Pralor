import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Shield, Zap, ChevronRight, Activity, Box, Globe } from 'lucide-react';

const PralorLanding = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('architect');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#9D00FF] selection:text-white overflow-x-hidden">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#9D00FF] opacity-10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00FFD1] opacity-5 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/5 ${scrolled ? 'bg-[#050505]/90 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 border-2 border-[#9D00FF] rotate-45"></div>
              <div className="absolute inset-2 bg-[#00FFD1] shadow-[0_0_10px_#00FFD1]"></div>
            </div>
            <span className="text-2xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">PRALOR</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide text-gray-400">
            <a href="#agents" className="hover:text-[#00FFD1] transition-colors">AGENTS</a>
            <a href="#products" className="hover:text-[#00FFD1] transition-colors">TOOLS</a>
            <a href="#roadmap" className="hover:text-[#00FFD1] transition-colors">ROADMAP</a>
          </div>
          <button
            onClick={() => onNavigate('sentry')}
            className="bg-white/5 hover:bg-[#9D00FF] hover:shadow-[0_0_20px_rgba(157,0,255,0.5)] border border-white/10 text-white px-6 py-2 rounded-none transition-all duration-300 group"
          >
            <span className="flex items-center gap-2">
              ACCESS TERMINAL <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-40 pb-20 container mx-auto px-6">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00FFD1]/10 border border-[#00FFD1]/20 text-[#00FFD1] text-xs tracking-widest mb-6">
            <span className="w-2 h-2 bg-[#00FFD1] rounded-full animate-pulse"></span>
            SYSTEM OPERATIONAL
          </div>
          <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">BUILDING THE</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D00FF] to-[#00FFD1]">FUTURE PROTOCOLS</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed mb-10 border-l-2 border-[#9D00FF] pl-6">
            A single-entity autonomous corporation leveraging advanced AI swarms to construct software architecture, analyze crypto markets, and deploy scalable businesses 24/7.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => onNavigate('sentry')}
              className="bg-[#9D00FF] hover:bg-[#8000D0] text-white px-8 py-4 text-lg font-bold tracking-wide transition-all shadow-[0_0_30px_rgba(157,0,255,0.3)] hover:shadow-[0_0_50px_rgba(157,0,255,0.5)]"
            >
              INITIATE STARTUP
            </button>
            <button
              onClick={() => onNavigate('sentry')}
              className="border border-white/20 hover:border-[#00FFD1] text-white px-8 py-4 text-lg font-bold tracking-wide transition-all hover:text-[#00FFD1] hover:bg-[#00FFD1]/5"
            >
              VIEW AGENT STATUS
            </button>
          </div>
        </div>

        {/* Hero Visual Elements */}
        <div className="absolute top-1/3 right-0 -z-10 opacity-30 md:opacity-100">
           <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin-slow">
              <circle cx="250" cy="250" r="200" stroke="#9D00FF" strokeWidth="1" strokeDasharray="10 10" />
              <circle cx="250" cy="250" r="150" stroke="#00FFD1" strokeWidth="2" strokeOpacity="0.5" />
              <path d="M250 50 L250 100" stroke="#00FFD1" strokeWidth="2" />
              <path d="M250 400 L250 450" stroke="#00FFD1" strokeWidth="2" />
              <path d="M50 250 L100 250" stroke="#00FFD1" strokeWidth="2" />
              <path d="M400 250 L450 250" stroke="#00FFD1" strokeWidth="2" />
           </svg>
        </div>
      </header>

      {/* The AI Swarm Section */}
      <section id="agents" className="py-24 bg-[#0A0A0A] border-y border-white/5 relative">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">THE <span className="text-[#00FFD1]">SWARM</span></h2>
            <p className="text-gray-400 max-w-xl">Your 24/7 digital workforce. Specialized agents ensuring PRALOR never sleeps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Agent Card 1 - ARCHITECT */}
            <div className="group relative bg-[#050505] p-1 border border-white/10 hover:border-[#9D00FF] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-[#9D00FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-8 relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 bg-[#9D00FF]/20 rounded-lg flex items-center justify-center mb-6 text-[#9D00FF]">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">ARCHITECT</h3>
                <p className="text-gray-500 text-sm mb-4">Lead Developer & Systems Engineer</p>
                <p className="text-gray-400 leading-relaxed mb-6 flex-grow">
                  Automated full-stack development. Capable of deploying React apps, configuring databases, and managing API integrations without human oversight.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-[#00FFD1]">
                  <span className="w-2 h-2 bg-[#00FFD1] rounded-full animate-ping"></span>
                  STATUS: ONLINE
                </div>
              </div>
            </div>

            {/* Agent Card 2 - ORACLE */}
            <div className="group relative bg-[#050505] p-1 border border-white/10 hover:border-[#00FFD1] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-[#00FFD1]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-8 relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 bg-[#00FFD1]/20 rounded-lg flex items-center justify-center mb-6 text-[#00FFD1]">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">ORACLE</h3>
                <p className="text-gray-500 text-sm mb-4">Market Analyst & Trend Predictor</p>
                <p className="text-gray-400 leading-relaxed mb-6 flex-grow">
                  Scans 5,000+ data points per minute across crypto markets and tech news. Predicts viral trends before they happen.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-[#00FFD1]">
                  <span className="w-2 h-2 bg-[#00FFD1] rounded-full animate-pulse"></span>
                  STATUS: MONITORING
                </div>
              </div>
            </div>

            {/* Agent Card 3 - SENTRY */}
            <div className="group relative bg-[#050505] p-1 border border-white/10 hover:border-white transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-8 relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6 text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">SENTRY</h3>
                <p className="text-gray-500 text-sm mb-4">Security & Uptime Guardian</p>
                <p className="text-gray-400 leading-relaxed mb-6 flex-grow">
                  Self-healing infrastructure management. Detects bugs, mitigates attacks, and ensures 99.99% uptime for all client tools.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-[#00FFD1]">
                  <span className="w-2 h-2 bg-[#00FFD1] rounded-full"></span>
                  STATUS: ACTIVE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Suite Showcase */}
      <section id="products" className="py-24 container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
                <h2 className="text-3xl md:text-5xl font-bold mb-8">TOOLS OF <br/><span className="text-[#9D00FF]">THE NEXT ERA</span></h2>
                <div className="space-y-6">
                    <div
                        className={`p-6 border-l-4 cursor-pointer transition-all ${activeTab === 'architect' ? 'border-[#00FFD1] bg-white/5' : 'border-gray-700 hover:bg-white/5'}`}
                        onClick={() => setActiveTab('architect')}
                    >
                        <h3 className="text-xl font-bold flex items-center gap-3">
                            <Box className="text-[#00FFD1]" /> CONSTRUCT
                        </h3>
                        <p className={`mt-2 text-gray-400 transition-all ${activeTab === 'architect' ? 'block' : 'hidden'}`}>
                            Idea-to-Business generation. Input a single sentence, output a full business plan, landing page, and go-to-market strategy.
                        </p>
                    </div>
                    <div
                        className={`p-6 border-l-4 cursor-pointer transition-all ${activeTab === 'ledger' ? 'border-[#9D00FF] bg-white/5' : 'border-gray-700 hover:bg-white/5'}`}
                        onClick={() => setActiveTab('ledger')}
                    >
                        <h3 className="text-xl font-bold flex items-center gap-3">
                            <Zap className="text-[#9D00FF]" /> LEDGER
                        </h3>
                        <p className={`mt-2 text-gray-400 transition-all ${activeTab === 'ledger' ? 'block' : 'hidden'}`}>
                            Next-gen crypto tracking. Uses sentiment analysis to visualize market movements in 3D space, not just 2D charts.
                        </p>
                    </div>
                    <div
                        className={`p-6 border-l-4 cursor-pointer transition-all ${activeTab === 'command' ? 'border-white bg-white/5' : 'border-gray-700 hover:bg-white/5'}`}
                        onClick={() => setActiveTab('command')}
                    >
                        <h3 className="text-xl font-bold flex items-center gap-3">
                            <Globe className="text-white" /> COMMAND
                        </h3>
                        <p className={`mt-2 text-gray-400 transition-all ${activeTab === 'command' ? 'block' : 'hidden'}`}>
                            The ultimate prompt engineering GUI. Drag-and-drop logic blocks to build complex AI behaviors without typing code.
                        </p>
                    </div>
                </div>
            </div>

            {/* Interactive Visualizer */}
            <div className="md:w-1/2 h-[400px] bg-[#111] border border-white/10 rounded-xl relative overflow-hidden group">
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    {activeTab === 'architect' && (
                        <div className="text-center animate-fade-in">
                            <Box className="w-24 h-24 text-[#00FFD1] mx-auto mb-4 opacity-80" />
                            <div className="font-mono text-[#00FFD1]">GENERATING INFRASTRUCTURE...</div>
                            <div className="w-64 h-1 bg-gray-800 mt-4 mx-auto overflow-hidden">
                                <div className="h-full bg-[#00FFD1] animate-progress"></div>
                            </div>
                        </div>
                    )}
                     {activeTab === 'ledger' && (
                        <div className="text-center animate-fade-in">
                            <Zap className="w-24 h-24 text-[#9D00FF] mx-auto mb-4 opacity-80" />
                            <div className="font-mono text-[#9D00FF]">ANALYZING BLOCKCHAIN NODES...</div>
                            <div className="flex justify-center gap-1 mt-4">
                                <div className="w-2 h-8 bg-[#9D00FF] animate-bounce"></div>
                                <div className="w-2 h-12 bg-[#9D00FF] animate-bounce" style={{animationDelay: '75ms'}}></div>
                                <div className="w-2 h-6 bg-[#9D00FF] animate-bounce" style={{animationDelay: '150ms'}}></div>
                            </div>
                        </div>
                    )}
                     {activeTab === 'command' && (
                        <div className="text-center animate-fade-in">
                            <Globe className="w-24 h-24 text-white mx-auto mb-4 opacity-80" />
                            <div className="font-mono text-white">COMPILING LOGIC BLOCKS...</div>
                            <div className="grid grid-cols-3 gap-2 mt-4 w-32 mx-auto">
                                <div className="h-2 bg-white opacity-20"></div>
                                <div className="h-2 bg-white opacity-50"></div>
                                <div className="h-2 bg-white opacity-20"></div>
                                <div className="h-2 bg-white opacity-80"></div>
                                <div className="h-2 bg-white opacity-20"></div>
                                <div className="h-2 bg-white opacity-60"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-[#0A0A0A] border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">CHOOSE YOUR <span className="text-[#9D00FF]">TIER</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">Scale your operations with the right level of access.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* INITIATE */}
            <div className="bg-[#050505] border border-white/10 p-8 relative group hover:border-white/30 transition-colors">
              <h3 className="text-xl font-bold mb-2">INITIATE</h3>
              <p className="text-gray-500 text-sm mb-4">For explorers</p>
              <div className="text-4xl font-bold mb-6">FREE</div>
              <ul className="space-y-3 mb-8 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00FFD1] rounded-full"></span>
                  Command Basic Blocks
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00FFD1] rounded-full"></span>
                  3 Construct generations/mo
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                  <span className="text-gray-600">Limited Ledger access</span>
                </li>
              </ul>
              <button
                onClick={() => onNavigate('sentry')}
                className="w-full py-3 border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors"
              >
                START FREE
              </button>
            </div>

            {/* OPERATOR */}
            <div className="bg-[#050505] border-2 border-[#9D00FF] p-8 relative group transform md:-translate-y-4 shadow-[0_0_40px_rgba(157,0,255,0.2)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#9D00FF] text-xs font-bold">
                RECOMMENDED
              </div>
              <h3 className="text-xl font-bold mb-2">OPERATOR</h3>
              <p className="text-gray-500 text-sm mb-4">For builders</p>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg text-gray-500">/mo</span></div>
              <ul className="space-y-3 mb-8 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00FFD1] rounded-full"></span>
                  Unlimited Command saves
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00FFD1] rounded-full"></span>
                  Full Ledger analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00FFD1] rounded-full"></span>
                  Priority API access
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00FFD1] rounded-full"></span>
                  Export to JSON
                </li>
              </ul>
              <button
                onClick={() => onNavigate('pricing')}
                className="w-full py-3 bg-[#9D00FF] text-white font-semibold hover:bg-[#8000D0] transition-colors"
              >
                UPGRADE NOW
              </button>
            </div>

            {/* ARCHITECT */}
            <div className="bg-[#050505] border border-white/10 p-8 relative group hover:border-[#00FFD1]/50 transition-colors">
              <h3 className="text-xl font-bold mb-2">ARCHITECT</h3>
              <p className="text-gray-500 text-sm mb-4">For enterprises</p>
              <div className="text-4xl font-bold mb-6">$99<span className="text-lg text-gray-500">/mo</span></div>
              <ul className="space-y-3 mb-8 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00FFD1] rounded-full"></span>
                  White-label tools
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00FFD1] rounded-full"></span>
                  Direct API to agents
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00FFD1] rounded-full"></span>
                  Custom integrations
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#00FFD1] rounded-full"></span>
                  Priority support
                </li>
              </ul>
              <button
                onClick={() => onNavigate('pricing')}
                className="w-full py-3 border border-[#00FFD1] text-[#00FFD1] font-semibold hover:bg-[#00FFD1]/10 transition-colors"
              >
                CONTACT SALES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020202] py-12 border-t border-white/5 text-center">
        <div className="mb-8 flex justify-center items-center gap-2 opacity-50">
            <div className="w-6 h-6 border border-[#9D00FF] rotate-45"></div>
            <span className="text-xl font-bold tracking-widest text-white">PRALOR</span>
        </div>
        <p className="text-gray-600 text-sm mb-8">
            &copy; 2025 PRALOR INC. SYSTEM AUTOMATED. ALL RIGHTS RESERVED.
        </p>
        <div className="flex justify-center gap-6">
            <button onClick={() => onNavigate('sentry')} className="text-gray-500 hover:text-[#00FFD1] transition-colors">TERMINAL</button>
            <a href="#" className="text-gray-500 hover:text-[#00FFD1] transition-colors">DOCS</a>
            <a href="#" className="text-gray-500 hover:text-[#00FFD1] transition-colors">SECURITY</a>
        </div>
      </footer>

      {/* Custom Animations */}
      <style>{`
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
        }
        @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
        }
        .animate-progress {
            animation: progress 2s ease-in-out infinite;
        }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PralorLanding;
