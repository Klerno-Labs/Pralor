import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  Download,
  Save,
  Play,
  User,
  MessageSquare,
  Settings,
  Target,
  Sliders,
  FileText,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  Layers,
  Code,
  Zap
} from 'lucide-react';

// Block Types
const BLOCK_TYPES = {
  persona: {
    name: 'Persona',
    icon: User,
    color: 'pralor-purple',
    bgColor: 'bg-pralor-purple/20',
    borderColor: 'border-pralor-purple/50',
    description: 'Define who the AI should be',
    placeholder: 'You are a helpful assistant...'
  },
  context: {
    name: 'Context',
    icon: FileText,
    color: 'pralor-cyan',
    bgColor: 'bg-pralor-cyan/20',
    borderColor: 'border-pralor-cyan/50',
    description: 'Provide background information',
    placeholder: 'The user is working on...'
  },
  task: {
    name: 'Task',
    icon: Target,
    color: 'green-400',
    bgColor: 'bg-green-400/20',
    borderColor: 'border-green-400/50',
    description: 'Define the main objective',
    placeholder: 'Help the user with...'
  },
  constraint: {
    name: 'Constraint',
    icon: Sliders,
    color: 'yellow-400',
    bgColor: 'bg-yellow-400/20',
    borderColor: 'border-yellow-400/50',
    description: 'Set rules and limitations',
    placeholder: 'Do not include...'
  },
  format: {
    name: 'Format',
    icon: Code,
    color: 'blue-400',
    bgColor: 'bg-blue-400/20',
    borderColor: 'border-blue-400/50',
    description: 'Specify output format',
    placeholder: 'Respond in JSON format...'
  },
  example: {
    name: 'Example',
    icon: MessageSquare,
    color: 'pink-400',
    bgColor: 'bg-pink-400/20',
    borderColor: 'border-pink-400/50',
    description: 'Provide sample input/output',
    placeholder: 'Input: X\nOutput: Y'
  }
};

const BlockPalette = ({ onAddBlock }) => (
  <div className="bg-pralor-panel border border-gray-800 rounded-lg p-4">
    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Block Palette</h3>
    <div className="space-y-2">
      {Object.entries(BLOCK_TYPES).map(([type, config]) => (
        <motion.button
          key={type}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddBlock(type)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg ${config.bgColor} border ${config.borderColor} hover:opacity-80 transition-opacity`}
        >
          <config.icon className={`w-4 h-4 text-${config.color}`} style={{ color: config.color === 'pralor-purple' ? '#9D00FF' : config.color === 'pralor-cyan' ? '#00FFD1' : undefined }} />
          <div className="text-left">
            <p className="text-sm font-medium text-white">{config.name}</p>
            <p className="text-xs text-gray-500">{config.description}</p>
          </div>
          <Plus className="w-4 h-4 text-gray-500 ml-auto" />
        </motion.button>
      ))}
    </div>
  </div>
);

const PromptBlock = ({ block, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const config = BLOCK_TYPES[block.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-pralor-panel border ${config.borderColor} rounded-lg overflow-hidden`}
    >
      <div className="flex items-center gap-2 p-3 bg-pralor-void/50">
        <button className="cursor-grab hover:bg-gray-700 p-1 rounded">
          <GripVertical className="w-4 h-4 text-gray-500" />
        </button>
        <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
          <Icon className="w-4 h-4" style={{ color: config.color === 'pralor-purple' ? '#9D00FF' : config.color === 'pralor-cyan' ? '#00FFD1' : config.color.includes('-') ? undefined : config.color }} />
        </div>
        <span className="font-medium text-white">{config.name}</span>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-1.5 hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronUp className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="p-1.5 hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-gray-700 rounded"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-red-900/30 rounded text-gray-400 hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3">
              <textarea
                value={block.content}
                onChange={(e) => onUpdate({ ...block, content: e.target.value })}
                placeholder={config.placeholder}
                className="w-full h-24 bg-pralor-void border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-pralor-purple resize-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PromptPreview = ({ blocks }) => {
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    return blocks
      .filter(b => b.content.trim())
      .map(b => {
        const config = BLOCK_TYPES[b.type];
        return `## ${config.name}\n${b.content}`;
      })
      .join('\n\n');
  };

  const prompt = generatePrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify({ blocks, generatedPrompt: prompt }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-config.json';
    a.click();
  };

  return (
    <div className="bg-pralor-panel border border-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pralor-cyan" />
          Generated Prompt
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-pralor-void border border-gray-700 rounded-lg text-sm hover:border-pralor-purple transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-pralor-void border border-gray-700 rounded-lg text-sm hover:border-pralor-cyan transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {prompt ? (
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
            {prompt}
          </pre>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <Layers className="w-12 h-12 mb-3 opacity-50" />
            <p>Add blocks to generate your prompt</p>
          </div>
        )}
      </div>

      {prompt && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{blocks.filter(b => b.content.trim()).length} blocks used</span>
            <span>{prompt.length} characters</span>
          </div>
        </div>
      )}
    </div>
  );
};

const PromptTemplates = ({ onLoadTemplate }) => {
  const templates = [
    {
      name: 'Code Assistant',
      description: 'Expert programming helper',
      blocks: [
        { type: 'persona', content: 'You are an expert software engineer with 15 years of experience across multiple programming languages and frameworks.' },
        { type: 'task', content: 'Help users write clean, efficient, and well-documented code. Explain your reasoning and suggest best practices.' },
        { type: 'constraint', content: 'Always include error handling. Follow language-specific conventions. Avoid deprecated methods.' },
        { type: 'format', content: 'Provide code in markdown code blocks with syntax highlighting. Add comments explaining complex logic.' }
      ]
    },
    {
      name: 'Content Writer',
      description: 'Professional copywriting',
      blocks: [
        { type: 'persona', content: 'You are a professional content writer specializing in engaging, SEO-friendly articles.' },
        { type: 'context', content: 'The content is for a tech startup blog targeting developers and entrepreneurs.' },
        { type: 'task', content: 'Create compelling content that educates and entertains while driving engagement.' },
        { type: 'format', content: 'Use headers, bullet points, and short paragraphs. Include a catchy intro and strong CTA.' }
      ]
    },
    {
      name: 'Data Analyst',
      description: 'SQL and data insights',
      blocks: [
        { type: 'persona', content: 'You are a senior data analyst proficient in SQL, Python, and data visualization.' },
        { type: 'task', content: 'Help users write efficient queries, analyze datasets, and derive actionable insights.' },
        { type: 'constraint', content: 'Optimize queries for performance. Explain the logic behind complex joins and aggregations.' },
        { type: 'example', content: 'Input: Show me total sales by region\nOutput: SELECT region, SUM(sales) as total_sales FROM orders GROUP BY region ORDER BY total_sales DESC;' }
      ]
    }
  ];

  return (
    <div className="bg-pralor-panel border border-gray-800 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Templates</h3>
      <div className="space-y-2">
        {templates.map((template, idx) => (
          <button
            key={idx}
            onClick={() => onLoadTemplate(template.blocks)}
            className="w-full text-left p-3 bg-pralor-void border border-gray-700 rounded-lg hover:border-pralor-purple transition-colors"
          >
            <p className="font-medium text-white text-sm">{template.name}</p>
            <p className="text-xs text-gray-500">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

const Command = ({ onNavigate }) => {
  const [blocks, setBlocks] = useState([]);
  const [savedPrompts, setSavedPrompts] = useState([]);

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: ''
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (updatedBlock) => {
    setBlocks(blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b));
  };

  const deleteBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (id, direction) => {
    const index = blocks.findIndex(b => b.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return;

    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const loadTemplate = (templateBlocks) => {
    setBlocks(templateBlocks.map((b, idx) => ({ ...b, id: Date.now() + idx })));
  };

  const clearAll = () => {
    if (blocks.length === 0) return;
    if (confirm('Clear all blocks?')) {
      setBlocks([]);
    }
  };

  return (
    <div className="min-h-screen bg-pralor-void text-white">
      {/* Header */}
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
                <h1 className="text-xl font-bold">COMMAND</h1>
                <p className="text-xs text-gray-400">Drag & Drop Prompt Builder</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear All
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-pralor-void border border-gray-700 rounded-lg text-sm hover:border-pralor-purple transition-colors">
              <Save className="w-4 h-4" />
              Save
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pralor-purple to-pralor-cyan text-white font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity">
              <Play className="w-4 h-4" />
              Test Prompt
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Left Sidebar - Block Palette */}
          <div className="col-span-3 space-y-4 overflow-auto">
            <BlockPalette onAddBlock={addBlock} />
            <PromptTemplates onLoadTemplate={loadTemplate} />
          </div>

          {/* Center - Block Builder */}
          <div className="col-span-5 overflow-auto">
            <div className="space-y-3">
              {blocks.length === 0 ? (
                <div className="bg-pralor-panel border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
                  <Layers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">No blocks yet</h3>
                  <p className="text-sm text-gray-500 mb-4">Click blocks from the palette to add them here</p>
                  <button
                    onClick={() => addBlock('persona')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pralor-purple/20 border border-pralor-purple/50 rounded-lg text-sm text-pralor-purple hover:bg-pralor-purple/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add first block
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {blocks.map((block, idx) => (
                    <PromptBlock
                      key={block.id}
                      block={block}
                      onUpdate={updateBlock}
                      onDelete={() => deleteBlock(block.id)}
                      onMoveUp={() => moveBlock(block.id, 'up')}
                      onMoveDown={() => moveBlock(block.id, 'down')}
                      isFirst={idx === 0}
                      isLast={idx === blocks.length - 1}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Right - Preview */}
          <div className="col-span-4">
            <PromptPreview blocks={blocks} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Command;
