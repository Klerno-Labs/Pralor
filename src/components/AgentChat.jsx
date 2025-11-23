import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  Loader2,
  Terminal,
  Activity,
  Shield,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Sparkles
} from 'lucide-react';
import { chat, architect, oracle, sentry } from '../ai/gemini';

const AGENTS = {
  architect: {
    name: 'ARCHITECT',
    icon: Terminal,
    color: '#9D00FF',
    description: 'Full-stack development & code solutions',
    greeting: 'ARCHITECT online. Ready to build, review, or explain code. What do you need?'
  },
  oracle: {
    name: 'ORACLE',
    icon: Activity,
    color: '#00FFD1',
    description: 'Market analysis & business intelligence',
    greeting: 'ORACLE active. I can analyze markets, validate ideas, or assess crypto trends. How can I assist?'
  },
  sentry: {
    name: 'SENTRY',
    icon: Shield,
    color: '#FFFFFF',
    description: 'Security audits & QA testing',
    greeting: 'SENTRY engaged. Ready for security audits, QA testing, or performance optimization. What needs checking?'
  }
};

const Message = ({ message, agentColor }) => {
  const [copied, setCopied] = useState(false);
  const isAgent = message.role === 'agent';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isAgent ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`max-w-[85%] ${isAgent ? 'order-1' : 'order-2'}`}>
        <div
          className={`rounded-lg p-4 ${
            isAgent
              ? 'bg-pralor-panel border border-gray-800'
              : 'bg-pralor-purple/20 border border-pralor-purple/30'
          }`}
        >
          {isAgent && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: agentColor }}
              ></span>
              <span className="text-xs font-mono" style={{ color: agentColor }}>
                {message.agent?.toUpperCase()}
              </span>
            </div>
          )}
          <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
          {isAgent && (
            <div className="flex justify-end mt-2 pt-2 border-t border-gray-700">
              <button
                onClick={handleCopy}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-600 mt-1 px-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
};

const AgentChat = ({ isOpen, onClose, initialAgent = 'architect' }) => {
  const [activeAgent, setActiveAgent] = useState(initialAgent);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const agent = AGENTS[activeAgent];
  const AgentIcon = agent.icon;

  // Initialize with greeting when agent changes
  useEffect(() => {
    setMessages([{
      role: 'agent',
      agent: activeAgent,
      content: AGENTS[activeAgent].greeting,
      timestamp: Date.now()
    }]);
  }, [activeAgent]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chat(userMessage.content, activeAgent);

      const agentMessage = {
        role: 'agent',
        agent: activeAgent,
        content: result.error
          ? `Error: ${result.error}. Please try again.`
          : result.text,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'agent',
        agent: activeAgent,
        content: 'Connection error. Please check your network and try again.',
        timestamp: Date.now()
      }]);
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`fixed z-50 bg-pralor-void border border-gray-800 rounded-lg shadow-2xl overflow-hidden ${
          isExpanded
            ? 'inset-4'
            : 'bottom-4 right-4 w-[480px] h-[600px]'
        }`}
      >
        {/* Header */}
        <div className="bg-pralor-panel border-b border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${agent.color}20` }}
              >
                <AgentIcon className="w-5 h-5" style={{ color: agent.color }} />
              </div>
              <div>
                <h3 className="font-bold text-white">{agent.name}</h3>
                <p className="text-xs text-gray-400">{agent.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4 text-gray-400" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Agent Tabs */}
          <div className="flex gap-2">
            {Object.entries(AGENTS).map(([key, agentInfo]) => (
              <button
                key={key}
                onClick={() => setActiveAgent(key)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  activeAgent === key
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-500 hover:text-white hover:bg-gray-800'
                }`}
              >
                {agentInfo.name}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 h-[calc(100%-180px)]">
          {messages.map((msg, idx) => (
            <Message key={idx} message={msg} agentColor={agent.color} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{agent.name} is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-800 p-4 bg-pralor-panel">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${agent.name} anything...`}
              className="flex-1 bg-pralor-void border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pralor-purple resize-none text-sm"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 bg-gradient-to-r from-pralor-purple to-pralor-cyan text-white rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            <Sparkles className="w-3 h-3 inline mr-1" />
            Powered by PRALOR AI Swarm
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AgentChat;
