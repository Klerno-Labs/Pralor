import React, { useState, Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/AuthModal';

const PralorLanding = lazy(() => import('./components/PralorLanding'));
const SentryDashboard = lazy(() => import('./components/SentryDashboard'));
const Construct = lazy(() => import('./components/Construct'));
const Ledger = lazy(() => import('./components/Ledger'));
const Command = lazy(() => import('./components/Command'));
const Pricing = lazy(() => import('./components/Pricing'));

function AppContent() {
  // Navigation State: 'landing', 'sentry', 'construct', 'ledger', 'command', 'pricing'
  const [currentView, setCurrentView] = useState('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const renderView = () => {
    const props = {
      onNavigate: setCurrentView,
      onOpenAuth: openAuthModal
    };

    switch(currentView) {
      case 'landing':
        return <PralorLanding {...props} />;
      case 'sentry':
        return <SentryDashboard {...props} />;
      case 'construct':
        return <Construct {...props} />;
      case 'ledger':
        return <Ledger {...props} />;
      case 'command':
        return <Command {...props} />;
      case 'pricing':
        return <Pricing {...props} />;
      default:
        return <PralorLanding {...props} />;
    }
  };

  return (
    <div className="antialiased">
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="animate-spin h-10 w-10 border-2 border-pralor-purple border-t-transparent rounded-full mx-auto" />
              <p className="text-gray-400 text-sm tracking-wide">Loading PRALOR interface...</p>
            </div>
          </div>
        }
      >
        {renderView()}
      </Suspense>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
