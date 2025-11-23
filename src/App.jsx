import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import PralorLanding from './components/PralorLanding';
import SentryDashboard from './components/SentryDashboard';
import Construct from './components/Construct';
import Ledger from './components/Ledger';
import Command from './components/Command';
import Pricing from './components/Pricing';
import AuthModal from './components/AuthModal';

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
      {renderView()}
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
