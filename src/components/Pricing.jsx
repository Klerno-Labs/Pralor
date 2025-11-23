import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  X,
  Zap,
  Crown,
  Rocket,
  CreditCard,
  Shield,
  Lock,
  ExternalLink,
  Loader2
} from 'lucide-react';

// Stripe configuration - Replace with your actual Stripe price IDs
const STRIPE_CONFIG = {
  publishableKey: 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY',
  prices: {
    operator: {
      monthly: 'price_operator_monthly_id',
      yearly: 'price_operator_yearly_id'
    },
    architect: {
      monthly: 'price_architect_monthly_id',
      yearly: 'price_architect_yearly_id'
    }
  }
};

const PLANS = [
  {
    id: 'initiate',
    name: 'INITIATE',
    tagline: 'For explorers',
    icon: Zap,
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: 'Command Basic Blocks', included: true },
      { text: '3 Construct generations/month', included: true },
      { text: 'Limited Ledger access', included: true },
      { text: 'Community support', included: true },
      { text: 'Priority API access', included: false },
      { text: 'Export to JSON', included: false },
      { text: 'White-label tools', included: false },
      { text: 'Direct API to agents', included: false }
    ],
    cta: 'START FREE',
    ctaStyle: 'border border-white/20 hover:bg-white/5',
    popular: false
  },
  {
    id: 'operator',
    name: 'OPERATOR',
    tagline: 'For builders',
    icon: Rocket,
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      { text: 'Unlimited Command saves', included: true },
      { text: 'Unlimited Construct generations', included: true },
      { text: 'Full Ledger analytics', included: true },
      { text: 'Priority support', included: true },
      { text: 'Priority API access', included: true },
      { text: 'Export to JSON', included: true },
      { text: 'White-label tools', included: false },
      { text: 'Direct API to agents', included: false }
    ],
    cta: 'UPGRADE NOW',
    ctaStyle: 'bg-[#9D00FF] hover:bg-[#8000D0]',
    popular: true
  },
  {
    id: 'architect',
    name: 'ARCHITECT',
    tagline: 'For enterprises',
    icon: Crown,
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      { text: 'Everything in Operator', included: true },
      { text: 'White-label tools', included: true },
      { text: 'Direct API to agents', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'SLA guarantee', included: true },
      { text: 'On-premise deployment', included: true },
      { text: 'Custom AI training', included: true }
    ],
    cta: 'CONTACT SALES',
    ctaStyle: 'border border-[#00FFD1] text-[#00FFD1] hover:bg-[#00FFD1]/10',
    popular: false
  }
];

const PlanCard = ({ plan, isYearly, onSubscribe, isLoading }) => {
  const Icon = plan.icon;
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const savings = plan.monthlyPrice > 0 ? Math.round((1 - (plan.yearlyPrice / 12) / plan.monthlyPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-[#050505] rounded-lg overflow-hidden ${
        plan.popular
          ? 'border-2 border-[#9D00FF] shadow-[0_0_40px_rgba(157,0,255,0.2)] md:-translate-y-4'
          : 'border border-white/10 hover:border-white/30'
      } transition-all`}
    >
      {plan.popular && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-[#9D00FF] text-xs font-bold rounded-b">
          RECOMMENDED
        </div>
      )}

      <div className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg ${
            plan.popular ? 'bg-[#9D00FF]/20' : 'bg-white/5'
          } flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${plan.popular ? 'text-[#9D00FF]' : 'text-white'}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-sm text-gray-500">{plan.tagline}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">${isYearly ? Math.round(price / 12) : price}</span>
            {price > 0 && <span className="text-gray-500">/month</span>}
          </div>
          {isYearly && price > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              Billed ${price} yearly
              {savings > 0 && (
                <span className="ml-2 text-[#00FFD1]">Save {savings}%</span>
              )}
            </p>
          )}
          {price === 0 && (
            <p className="text-sm text-gray-400 mt-1">Free forever</p>
          )}
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3">
              {feature.included ? (
                <Check className="w-4 h-4 text-[#00FFD1] flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-gray-600 flex-shrink-0" />
              )}
              <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => onSubscribe(plan.id, isYearly)}
          disabled={isLoading}
          className={`w-full py-3 font-semibold rounded transition-all ${plan.ctaStyle} disabled:opacity-50`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            plan.cta
          )}
        </button>
      </div>
    </motion.div>
  );
};

const Pricing = ({ onNavigate }) => {
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSubscribe = async (planId, yearly) => {
    if (planId === 'initiate') {
      // Free tier - just redirect to dashboard
      onNavigate('sentry');
      return;
    }

    if (planId === 'architect') {
      // Enterprise tier - show contact form or redirect
      window.open('mailto:sales@pralor.com?subject=ARCHITECT%20Tier%20Inquiry', '_blank');
      return;
    }

    // For paid tiers, initiate Stripe checkout
    setIsLoading(planId);
    setSelectedPlan({ id: planId, yearly });

    // Simulate Stripe checkout initialization
    // In production, you would call your backend to create a Checkout Session
    setTimeout(() => {
      setIsLoading(null);
      setShowCheckout(true);
    }, 1000);
  };

  const initiateStripeCheckout = async () => {
    // In production, this would call your backend API
    // POST /api/create-checkout-session
    // Body: { priceId: STRIPE_CONFIG.prices[selectedPlan.id][selectedPlan.yearly ? 'yearly' : 'monthly'] }

    // The backend would create a Stripe Checkout Session and return the URL
    // Then redirect: window.location.href = session.url

    console.log('Initiating Stripe checkout for:', selectedPlan);
    alert('Stripe checkout would open here.\n\nTo enable payments:\n1. Add your Stripe publishable key\n2. Create products/prices in Stripe Dashboard\n3. Set up a backend endpoint to create Checkout Sessions');
    setShowCheckout(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#9D00FF] opacity-10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00FFD1] opacity-5 blur-[120px] rounded-full"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#00FFD1]" />
            <span className="text-sm text-gray-400">Secure checkout powered by Stripe</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            CHOOSE YOUR <span className="text-[#9D00FF]">TIER</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Scale your operations with the right level of access. All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-white/5 rounded-full">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly ? 'bg-[#9D00FF] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                isYearly ? 'bg-[#9D00FF] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly <span className="text-[#00FFD1]">-17%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isYearly={isYearly}
              onSubscribe={handleSubscribe}
              isLoading={isLoading === plan.id}
            />
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm">Instant Access</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-4">
            Cancel anytime. No questions asked. 30-day money-back guarantee.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I switch plans later?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate your billing.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, debit cards, and in some regions, local payment methods through Stripe.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes, all paid plans come with a 14-day free trial. You won\'t be charged until the trial ends.'
              },
              {
                q: 'What happens when I reach my limits?',
                a: 'You\'ll receive a notification before reaching limits. You can upgrade anytime to continue using premium features.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      {showCheckout && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0A0A0A] border border-gray-800 rounded-lg p-8 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Complete Your Subscription</h3>
            <p className="text-gray-400 mb-6">
              You're subscribing to the <span className="text-[#9D00FF] font-semibold">
                {PLANS.find(p => p.id === selectedPlan.id)?.name}
              </span> plan ({selectedPlan.yearly ? 'yearly' : 'monthly'}).
            </p>

            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total</span>
                <span className="text-2xl font-bold">
                  ${selectedPlan.yearly
                    ? PLANS.find(p => p.id === selectedPlan.id)?.yearlyPrice
                    : PLANS.find(p => p.id === selectedPlan.id)?.monthlyPrice}
                  <span className="text-sm text-gray-500">
                    /{selectedPlan.yearly ? 'year' : 'month'}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 py-3 border border-gray-700 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={initiateStripeCheckout}
                className="flex-1 py-3 bg-[#9D00FF] rounded-lg hover:bg-[#8000D0] transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Pay with Stripe
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              You'll be redirected to Stripe's secure checkout
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
