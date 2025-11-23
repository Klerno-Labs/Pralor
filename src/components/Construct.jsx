import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  FileText,
  Image,
  Globe,
  Loader2,
  Download,
  ChevronRight,
  Sparkles,
  Target,
  Users,
  DollarSign,
  Layers,
  ArrowLeft,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { construct as constructAI } from '../services/gemini';
import { saveConstruct } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

// AI-powered business generation
const generateBusiness = async (idea, industry = 'technology') => {
  const result = await constructAI.generate(idea, { industry });

  if (result.error || !result.data) {
    // Fallback to default generation if AI fails
    console.error('AI generation failed:', result.error);
    return {
      name: idea.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'AI',
      tagline: `The smartest way to ${idea.toLowerCase()}`,
      description: `A revolutionary platform that leverages AI to transform how people ${idea.toLowerCase()}. Built for the modern age with cutting-edge technology and user-centric design.`,
      targetAudience: [
        'Tech-savvy professionals aged 25-45',
        'Small business owners',
        'Enterprise clients seeking automation',
        'Early adopters and innovators'
      ],
      revenueModel: [
        { model: 'Freemium', description: 'Basic features free, premium at $29/mo' },
        { model: 'Enterprise', description: 'Custom pricing for large organizations' },
        { model: 'API Access', description: 'Usage-based pricing for developers' }
      ],
      marketSize: '$4.2B by 2027',
      competitors: ['Traditional solutions', 'Legacy software', 'Manual processes'],
      uniqueValue: `First-mover advantage in AI-powered ${idea.toLowerCase()} with patent-pending algorithms`,
      launchStrategy: [
        'Phase 1: MVP launch with core features',
        'Phase 2: Beta testing with 100 users',
        'Phase 3: Public launch with marketing push',
        'Phase 4: Enterprise tier and API rollout'
      ],
      aiGenerated: false
    };
  }

  return {
    ...result.data,
    aiGenerated: true
  };
};

const StepIndicator = ({ currentStep }) => {
  const steps = ['Idea Input', 'AI Processing', 'Results'];

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              idx <= currentStep
                ? 'bg-pralor-purple text-white'
                : 'bg-gray-800 text-gray-500'
            }`}>
              {idx + 1}
            </div>
            <span className={`text-sm ${idx <= currentStep ? 'text-white' : 'text-gray-500'}`}>
              {step}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <ChevronRight className={`w-4 h-4 ${idx < currentStep ? 'text-pralor-cyan' : 'text-gray-700'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const IdeaInput = ({ onSubmit }) => {
  const [idea, setIdea] = useState('');
  const [industry, setIndustry] = useState('');

  const exampleIdeas = [
    'Uber for dog walking',
    'AI-powered resume builder',
    'Sustainable packaging marketplace',
    'Virtual interior design service'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pralor-purple to-pralor-cyan mb-4">
          <Lightbulb className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">What's your idea?</h2>
        <p className="text-gray-400">Enter your raw concept and watch CONSTRUCT transform it into a complete business package.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Your Idea</label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your idea in one sentence..."
            className="w-full h-32 bg-pralor-panel border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pralor-purple resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Industry (optional)</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full bg-pralor-panel border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pralor-purple"
          >
            <option value="">Select an industry...</option>
            <option value="tech">Technology</option>
            <option value="health">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="education">Education</option>
            <option value="retail">Retail</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-3">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {exampleIdeas.map((example) => (
              <button
                key={example}
                onClick={() => setIdea(example)}
                className="px-3 py-1.5 bg-pralor-void border border-gray-700 rounded-full text-sm text-gray-300 hover:border-pralor-purple hover:text-white transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onSubmit(idea, industry)}
          disabled={!idea.trim()}
          className="w-full py-4 bg-gradient-to-r from-pralor-purple to-pralor-cyan text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Generate Business Package
        </button>
      </div>
    </motion.div>
  );
};

const Processing = ({ idea }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="max-w-lg mx-auto text-center py-20"
  >
    <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-pralor-purple border-r-pralor-cyan"
      />
      <Layers className="w-10 h-10 text-pralor-purple" />
    </div>

    <h2 className="text-2xl font-bold mb-4">Constructing Your Business</h2>
    <p className="text-gray-400 mb-8">"{idea}"</p>

    <div className="space-y-3 text-left max-w-xs mx-auto">
      {['Analyzing market potential', 'Generating business plan', 'Creating brand assets', 'Finalizing package'].map((task, idx) => (
        <motion.div
          key={task}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.5 }}
          className="flex items-center gap-3"
        >
          <Loader2 className="w-4 h-4 text-pralor-cyan animate-spin" />
          <span className="text-sm text-gray-300">{task}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const Results = ({ business, onReset }) => {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pralor-purple to-pralor-cyan mb-4"
        >
          <Check className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold mb-2">{business.name}</h1>
        <p className="text-xl text-pralor-cyan">{business.tagline}</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Business Overview */}
        <div className="bg-pralor-panel border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-pralor-purple" />
              Business Overview
            </h3>
            <button
              onClick={() => copyToClipboard(business.description, 'overview')}
              className="p-1.5 hover:bg-gray-700 rounded"
            >
              {copiedSection === 'overview' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
          <p className="text-gray-300 text-sm">{business.description}</p>
        </div>

        {/* Target Audience */}
        <div className="bg-pralor-panel border border-gray-800 rounded-lg p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-pralor-cyan" />
            Target Audience
          </h3>
          <ul className="space-y-2">
            {business.targetAudience.map((audience, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                <Target className="w-3 h-3 text-pralor-purple mt-1 flex-shrink-0" />
                {audience}
              </li>
            ))}
          </ul>
        </div>

        {/* Revenue Model */}
        <div className="bg-pralor-panel border border-gray-800 rounded-lg p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-green-400" />
            Revenue Model
          </h3>
          <div className="space-y-3">
            {business.revenueModel.map((model, idx) => (
              <div key={idx} className="border-l-2 border-pralor-purple pl-3">
                <p className="font-medium text-white text-sm">{model.model}</p>
                <p className="text-xs text-gray-400">{model.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Info */}
        <div className="bg-pralor-panel border border-gray-800 rounded-lg p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-pralor-cyan" />
            Market Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Market Size</p>
              <p className="text-2xl font-bold text-pralor-cyan">{business.marketSize}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-2">Unique Value Proposition</p>
              <p className="text-sm text-gray-300">{business.uniqueValue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Launch Strategy */}
      <div className="bg-pralor-panel border border-gray-800 rounded-lg p-6 mb-8">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-pralor-purple" />
          Launch Strategy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {business.launchStrategy.map((phase, idx) => (
            <div key={idx} className="relative">
              <div className="w-8 h-8 rounded-full bg-pralor-purple/20 flex items-center justify-center text-pralor-purple font-bold text-sm mb-2">
                {idx + 1}
              </div>
              <p className="text-sm text-gray-300">{phase}</p>
              {idx < business.launchStrategy.length - 1 && (
                <div className="hidden md:block absolute top-4 left-12 w-full h-0.5 bg-gradient-to-r from-pralor-purple/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button className="px-6 py-3 bg-gradient-to-r from-pralor-purple to-pralor-cyan text-white font-semibold rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Download className="w-4 h-4" />
          Export Full Package
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-pralor-panel border border-gray-700 text-white font-semibold rounded-lg flex items-center gap-2 hover:border-pralor-purple transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          Generate Another
        </button>
      </div>
    </motion.div>
  );
};

const Construct = ({ onNavigate }) => {
  const [step, setStep] = useState(0);
  const [idea, setIdea] = useState('');
  const [business, setBusiness] = useState(null);
  const [error, setError] = useState('');
  const { user, canUseFeature, recordUsage, getRemainingUsage, tier } = useAuth();

  const handleSubmit = async (submittedIdea, submittedIndustry = '') => {
    if (!canUseFeature('construct')) {
      setError('Upgrade required: free tier Construct limit reached.');
      return;
    }
    setError('');
    setIdea(submittedIdea);
    setStep(1);

    try {
      const result = await generateBusiness(submittedIdea, submittedIndustry);
      setBusiness(result);
      setStep(2);
      if (user) {
        await saveConstruct(user.uid, { idea: submittedIdea, industry: submittedIndustry, output: result });
        await recordUsage('constructGenerations');
      }
    } catch (err) {
      setError('Failed to generate. Please try again.');
      setStep(0);
    }
  };

  const handleReset = () => {
    setStep(0);
    setIdea('');
    setBusiness(null);
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
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CONSTRUCT</h1>
                <p className="text-xs text-gray-400">Idea-to-Business Generator</p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            {tier === 'initiate'
              ? <><span className="text-pralor-cyan">{getRemainingUsage('construct')}</span> generations remaining this month</>
              : 'Unlimited generations'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <StepIndicator currentStep={step} />

        <AnimatePresence mode="wait">
          {step === 0 && <IdeaInput key="input" onSubmit={handleSubmit} />}
          {step === 1 && <Processing key="processing" idea={idea} />}
          {step === 2 && business && <Results key="results" business={business} onReset={handleReset} />}
        </AnimatePresence>

        {error && (
          <div className="mt-6 flex items-center gap-2 bg-red-900/30 border border-red-500/30 text-sm text-red-200 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {tier === 'initiate' && (
          <p className="text-xs text-gray-500 mt-4">
            Remaining this month: {getRemainingUsage('construct')}
          </p>
        )}
      </main>
    </div>
  );
};

export default Construct;
