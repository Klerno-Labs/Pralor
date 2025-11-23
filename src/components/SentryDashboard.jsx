import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  DollarSign,
  Users,
  Server,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Shield,
  Cpu,
  Database,
  Zap,
  Eye,
  LogOut,
  User,
  Crown,
  MessageSquare,
  Terminal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../services/auth';
import AgentChat from './AgentChat';

// Simulated real-time data
const generateMetrics = () => ({
  revenue: {
    today: Math.floor(Math.random() * 500) + 100,
    month: Math.floor(Math.random() * 15000) + 5000,
    growth: (Math.random() * 20 - 5).toFixed(1)
  },
  users: {
    active: Math.floor(Math.random() * 200) + 50,
    total: Math.floor(Math.random() * 5000) + 1000,
    newToday: Math.floor(Math.random() * 50) + 5
  },
  server: {
    cpu: Math.floor(Math.random() * 40) + 20,
    memory: Math.floor(Math.random() * 30) + 40,
    uptime: 99.97,
    requests: Math.floor(Math.random() * 10000) + 5000
  },
  agents: {
    architect: { status: 'online', tasks: Math.floor(Math.random() * 10) + 1 },
    oracle: { status: 'monitoring', tasks: Math.floor(Math.random() * 5) + 1 },
    sentry: { status: 'watching', tasks: Math.floor(Math.random() * 3) + 1 }
  }
});

const MetricCard = ({ icon: Icon, title, value, subtitle, trend, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-pralor-panel border border-gray-800 rounded-lg p-4 hover:border-pralor-purple/50 transition-colors"
  >
    <div className="flex items-start justify-between">
      <div className={`p-2 rounded-lg bg-${color}/10`}>
        <Icon className={`w-5 h-5 text-${color}`} style={{ color: color }} />
      </div>
      {trend && (
        <span className={`text-xs px-2 py-1 rounded ${parseFloat(trend) >= 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
          {parseFloat(trend) >= 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-2xl font-bold mt-3 text-white">{value}</h3>
    <p className="text-gray-400 text-sm">{title}</p>
    {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
  </motion.div>
);

const AgentStatus = ({ name, status, tasks, icon: Icon }) => {
  const statusColors = {
    online: 'text-pralor-cyan',
    monitoring: 'text-yellow-400',
    watching: 'text-pralor-purple'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-3 bg-pralor-void rounded-lg border border-gray-800"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-pralor-purple/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-pralor-purple" />
        </div>
        <div>
          <h4 className="font-semibold text-white">{name}</h4>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-pralor-cyan' : status === 'monitoring' ? 'bg-yellow-400' : 'bg-pralor-purple'} animate-pulse`}></span>
            <span className={`text-xs ${statusColors[status]}`}>{status.toUpperCase()}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <span className="text-lg font-bold text-white">{tasks}</span>
        <p className="text-xs text-gray-500">Active Tasks</p>
      </div>
    </motion.div>
  );
};

const ServerHealth = ({ cpu, memory, uptime, requests }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-pralor-panel border border-gray-800 rounded-lg p-4"
  >
    <div className="flex items-center gap-2 mb-4">
      <Server className="w-5 h-5 text-pralor-cyan" />
      <h3 className="font-semibold text-white">Server Health</h3>
      <span className="ml-auto text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">OPERATIONAL</span>
    </div>

    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">CPU Usage</span>
          <span className="text-white">{cpu}%</span>
        </div>
        <div className="h-2 bg-pralor-void rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${cpu}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-pralor-cyan to-pralor-purple"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Memory</span>
          <span className="text-white">{memory}%</span>
        </div>
        <div className="h-2 bg-pralor-void rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${memory}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-pralor-purple to-pralor-cyan"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800">
        <div>
          <p className="text-2xl font-bold text-pralor-cyan">{uptime}%</p>
          <p className="text-xs text-gray-500">Uptime</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-pralor-purple">{requests.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Requests/hr</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const ActivityFeed = () => {
  const activities = [
    { type: 'success', message: 'New OPERATOR subscription activated', time: '2m ago', icon: CheckCircle },
    { type: 'info', message: 'ORACLE analyzing BTC market trends', time: '5m ago', icon: Eye },
    { type: 'warning', message: 'High API usage detected', time: '12m ago', icon: AlertTriangle },
    { type: 'success', message: 'ARCHITECT deployed new module', time: '23m ago', icon: Zap },
    { type: 'info', message: 'Construct generated 3 business plans', time: '45m ago', icon: Database },
  ];

  const typeColors = {
    success: 'text-green-400 bg-green-900/20',
    warning: 'text-yellow-400 bg-yellow-900/20',
    info: 'text-pralor-cyan bg-pralor-cyan/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-pralor-panel border border-gray-800 rounded-lg p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-pralor-purple" />
        <h3 className="font-semibold text-white">Activity Feed</h3>
      </div>

      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className={`p-1.5 rounded ${typeColors[activity.type]}`}>
              <activity.icon className="w-3 h-3" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const SentryDashboard = ({ onNavigate, onOpenAuth }) => {
  const [metrics, setMetrics] = useState(generateMetrics());
  const [agentChatOpen, setAgentChatOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('architect');
  const { user, userData, isAuthenticated, tier } = useAuth();

  const openAgentChat = (agent) => {
    setSelectedAgent(agent);
    setAgentChatOpen(true);
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(generateMetrics());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logOut();
    onNavigate('landing');
  };

  const tierBadge = {
    initiate: { label: 'INITIATE', color: 'bg-gray-700' },
    operator: { label: 'OPERATOR', color: 'bg-pralor-purple' },
    architect: { label: 'ARCHITECT', color: 'bg-gradient-to-r from-pralor-purple to-pralor-cyan' }
  };

  return (
    <div className="min-h-screen bg-pralor-void text-white">
      {/* Header */}
      <header className="bg-pralor-panel border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pralor-purple to-pralor-cyan flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SENTRY MAINFRAME</h1>
              <p className="text-xs text-gray-400">Monitoring &bull; Revenue &bull; Agent Activity</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-gray-400">All Systems Operational</span>
            </div>

            {/* User Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pralor-purple/20 flex items-center justify-center">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <User className="w-4 h-4 text-pralor-purple" />
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{userData?.displayName || 'User'}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${tierBadge[tier]?.color || 'bg-gray-700'}`}>
                      {tierBadge[tier]?.label || 'INITIATE'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 bg-pralor-purple hover:bg-pralor-purple/80 rounded-lg transition-colors text-sm font-medium"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => onNavigate('landing')}
              className="px-4 py-2 bg-pralor-void border border-gray-700 rounded-lg hover:border-pralor-purple transition-colors text-sm"
            >
              Exit Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={DollarSign}
            title="Revenue Today"
            value={`$${metrics.revenue.today}`}
            subtitle={`$${metrics.revenue.month.toLocaleString()} this month`}
            trend={metrics.revenue.growth}
            color="#00FFD1"
          />
          <MetricCard
            icon={Users}
            title="Active Users"
            value={metrics.users.active}
            subtitle={`${metrics.users.newToday} new today`}
            color="#9D00FF"
          />
          <MetricCard
            icon={Cpu}
            title="API Requests"
            value={`${(metrics.server.requests / 1000).toFixed(1)}K`}
            subtitle="Last hour"
            color="#00FFD1"
          />
          <MetricCard
            icon={TrendingUp}
            title="Total Users"
            value={metrics.users.total.toLocaleString()}
            trend="12.5"
            color="#9D00FF"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Agent Status */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-pralor-cyan" />
              AI Agent Swarm
            </h2>
            <div onClick={() => openAgentChat('architect')} className="cursor-pointer">
              <AgentStatus
                name="ARCHITECT"
                status={metrics.agents.architect.status}
                tasks={metrics.agents.architect.tasks}
                icon={Cpu}
              />
            </div>
            <div onClick={() => openAgentChat('oracle')} className="cursor-pointer">
              <AgentStatus
                name="ORACLE"
                status={metrics.agents.oracle.status}
                tasks={metrics.agents.oracle.tasks}
                icon={Eye}
              />
            </div>
            <div onClick={() => openAgentChat('sentry')} className="cursor-pointer">
              <AgentStatus
                name="SENTRY"
                status={metrics.agents.sentry.status}
                tasks={metrics.agents.sentry.tasks}
                icon={Shield}
              />
            </div>
          </div>

          {/* Middle Column - Server Health */}
          <div>
            <ServerHealth {...metrics.server} />
          </div>

          {/* Right Column - Activity */}
          <div>
            <ActivityFeed />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('command')}
            className="p-4 bg-pralor-panel border border-gray-800 rounded-lg hover:border-pralor-purple transition-colors text-left"
          >
            <h3 className="font-semibold text-white">Command Center</h3>
            <p className="text-xs text-gray-400">Access prompt builder</p>
          </button>
          <button
            onClick={() => onNavigate('construct')}
            className="p-4 bg-pralor-panel border border-gray-800 rounded-lg hover:border-pralor-cyan transition-colors text-left"
          >
            <h3 className="font-semibold text-white">Construct</h3>
            <p className="text-xs text-gray-400">Generate business ideas</p>
          </button>
          <button
            onClick={() => onNavigate('ledger')}
            className="p-4 bg-pralor-panel border border-gray-800 rounded-lg hover:border-pralor-purple transition-colors text-left"
          >
            <h3 className="font-semibold text-white">Ledger</h3>
            <p className="text-xs text-gray-400">Crypto analytics</p>
          </button>
          <button
            onClick={() => onNavigate('pricing')}
            className="p-4 bg-gradient-to-r from-pralor-purple/20 to-pralor-cyan/20 border border-pralor-purple/50 rounded-lg text-left hover:border-pralor-purple transition-colors"
          >
            <h3 className="font-semibold text-white">Upgrade Plan</h3>
            <p className="text-xs text-gray-400">Unlock ARCHITECT tier</p>
          </button>
        </div>
      </main>

      {/* Floating AI Chat Button */}
      {!agentChatOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setAgentChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-pralor-purple to-pralor-cyan rounded-full shadow-lg flex items-center justify-center hover:shadow-[0_0_30px_rgba(157,0,255,0.5)] transition-shadow z-40"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {/* Agent Chat */}
      <AgentChat
        isOpen={agentChatOpen}
        onClose={() => setAgentChatOpen(false)}
        initialAgent={selectedAgent}
      />
    </div>
  );
};

export default SentryDashboard;
