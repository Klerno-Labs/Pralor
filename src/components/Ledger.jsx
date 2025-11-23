import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  ArrowLeft,
  Search,
  Star,
  RefreshCw,
  Eye,
  BarChart3,
  Loader2
} from 'lucide-react';
import { oracle } from '../services/gemini';
import { useAuth } from '../context/AuthContext';

// CoinGecko API (free, no key required)
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const fetchTopTokens = async () => {
  try {
    const params = new URLSearchParams({
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: '20',
      page: '1',
      sparkline: 'true',
      price_change_percentage: '24h,7d'
    });

    const res = await fetch(`${COINGECKO_API}/coins/markets?${params}`);
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error('CoinGecko fetch error:', error);
    return null;
  }
};

const fetchGlobalData = async () => {
  try {
    const res = await fetch(`${COINGECKO_API}/global`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Global data fetch error:', error);
    return null;
  }
};

const fetchFearGreedIndex = async () => {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=1');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.data[0];
  } catch (error) {
    return { value: '50', value_classification: 'Neutral' };
  }
};

const formatPrice = (price) => {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
};

const formatMarketCap = (cap) => {
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
  return `$${cap.toLocaleString()}`;
};

const Sparkline = ({ data, positive }) => {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 32;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? '#00FFD1' : '#ef4444'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const TokenRow = ({ token, onAnalyze, isAnalyzing }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const positive = token.price_change_percentage_24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-pralor-panel border border-gray-800 rounded-lg p-4 hover:border-pralor-purple/50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="text-gray-500 text-sm w-6">#{token.market_cap_rank}</div>
        <img src={token.image} alt={token.name} className="w-8 h-8 rounded-full" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{token.symbol.toUpperCase()}</span>
            <span className="text-gray-500 text-sm truncate">{token.name}</span>
          </div>
        </div>

        <div className="hidden md:block w-24">
          <Sparkline data={token.sparkline_in_7d?.price} positive={positive} />
        </div>

        <div className="text-right min-w-[100px]">
          <div className="font-semibold text-white">{formatPrice(token.current_price)}</div>
          <div className={`text-sm flex items-center justify-end gap-1 ${positive ? 'text-green-400' : 'text-red-400'}`}>
            {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {positive ? '+' : ''}{token.price_change_percentage_24h?.toFixed(2)}%
          </div>
        </div>

        <div className="hidden lg:block text-right min-w-[100px]">
          <div className="text-gray-400 text-sm">{formatMarketCap(token.market_cap)}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} />
          </button>
          <button
            onClick={() => onAnalyze(token)}
            disabled={isAnalyzing}
            className="p-2 hover:bg-pralor-purple/20 rounded-lg transition-colors text-pralor-purple"
            title="ORACLE Analysis"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const MarketOverview = ({ globalData, fearGreed }) => {
  if (!globalData) return null;

  const btcDom = globalData.market_cap_percentage?.btc?.toFixed(1) || '0';
  const totalCap = formatMarketCap(globalData.total_market_cap?.usd || 0);
  const totalVol = formatMarketCap(globalData.total_volume?.usd || 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-pralor-panel border border-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4 text-pralor-cyan" />
          <span className="text-xs text-gray-500">Total Market Cap</span>
        </div>
        <p className="text-xl font-bold text-white">{totalCap}</p>
      </div>

      <div className="bg-pralor-panel border border-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-pralor-purple" />
          <span className="text-xs text-gray-500">24h Volume</span>
        </div>
        <p className="text-xl font-bold text-white">{totalVol}</p>
      </div>

      <div className="bg-pralor-panel border border-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-orange-400" />
          <span className="text-xs text-gray-500">BTC Dominance</span>
        </div>
        <p className="text-xl font-bold text-white">{btcDom}%</p>
      </div>

      <div className="bg-pralor-panel border border-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-xs text-gray-500">Fear & Greed</span>
        </div>
        <p className={`text-xl font-bold ${
          parseInt(fearGreed?.value) > 50 ? 'text-green-400' :
          parseInt(fearGreed?.value) < 50 ? 'text-red-400' : 'text-yellow-400'
        }`}>
          {fearGreed?.value} <span className="text-sm font-normal text-gray-500">{fearGreed?.value_classification}</span>
        </p>
      </div>
    </div>
  );
};

const AnalysisModal = ({ token, analysis, onClose }) => {
  if (!token) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-pralor-panel border border-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={token.image} alt={token.name} className="w-10 h-10 rounded-full" />
              <div>
                <h2 className="text-xl font-bold text-white">{token.name} ({token.symbol.toUpperCase()})</h2>
                <p className="text-sm text-gray-400">ORACLE AI Analysis</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">&times;</button>
          </div>
        </div>

        <div className="p-6">
          {analysis ? (
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans">
                {analysis}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-pralor-purple" />
              <span className="ml-3 text-gray-400">ORACLE analyzing {token.symbol.toUpperCase()}...</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Ledger = ({ onNavigate }) => {
  const [tokens, setTokens] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const [fearGreed, setFearGreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [analyzingToken, setAnalyzingToken] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState('');
  const { canUseFeature } = useAuth();

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [tokenData, global, fng] = await Promise.all([
        fetchTopTokens(),
        fetchGlobalData(),
        fetchFearGreedIndex()
      ]);

      if (tokenData) setTokens(tokenData);
      if (global) setGlobalData(global);
      if (fng) setFearGreed(fng);
      setError('');
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to load market data. Please retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(true), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = async (token) => {
    if (!canUseFeature('ledgerFull')) {
      setError('Upgrade required: full Ledger analytics available on paid tiers.');
      return;
    }
    setAnalyzingToken(token);
    setAnalysis(null);

    const context = `Current price: ${formatPrice(token.current_price)}, 24h change: ${token.price_change_percentage_24h?.toFixed(2)}%, Market cap: ${formatMarketCap(token.market_cap)}`;
    const result = await oracle.analyzeCrypto(token.symbol.toUpperCase(), context);

    setAnalysis(result.error ? `Error: ${result.error}` : result.text);
  };

  const filteredTokens = tokens.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-pralor-void text-white">
      <header className="bg-pralor-panel border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('sentry')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pralor-purple to-pralor-cyan flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">LEDGER</h1>
                <p className="text-xs text-gray-400">Live Crypto Intelligence</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {lastUpdate && (
              <span className="text-xs text-gray-500">
                Updated {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {error && (
          <div className="mb-4 bg-red-900/30 border border-red-500/30 text-sm text-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-pralor-purple" />
            <span className="ml-3 text-gray-400">Loading market data...</span>
          </div>
        ) : (
          <>
            <MarketOverview globalData={globalData} fearGreed={fearGreed} />

            <div className="bg-gradient-to-r from-pralor-purple/20 to-pralor-cyan/20 border border-pralor-purple/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-pralor-purple" />
                <div>
                  <p className="font-semibold text-white">ORACLE AI Active</p>
                  <p className="text-sm text-gray-400">Click the eye icon on any token for AI analysis</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tokens..."
                  className="w-full bg-pralor-panel border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-pralor-purple"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredTokens.map(token => (
                <TokenRow
                  key={token.id}
                  token={token}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={analyzingToken?.id === token.id && !analysis}
                />
              ))}
            </div>

            {filteredTokens.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No tokens found matching "{searchQuery}"
              </div>
            )}
          </>
        )}
      </main>

      <AnimatePresence>
        {analyzingToken && (
          <AnalysisModal
            token={analyzingToken}
            analysis={analysis}
            onClose={() => { setAnalyzingToken(null); setAnalysis(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ledger;
