import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, getUserData } from '../firebase/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch user data from Firestore
        const { data } = await getUserData(firebaseUser.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Refresh user data
  const refreshUserData = async () => {
    if (user) {
      const { data } = await getUserData(user.uid);
      setUserData(data);
    }
  };

  // Check if user can use a feature based on their tier
  const canUseFeature = (feature) => {
    if (!userData) return false;

    const { tier, usage } = userData;

    switch (feature) {
      case 'construct':
        if (tier === 'initiate') {
          return usage.constructGenerations < usage.constructLimit;
        }
        return true; // Unlimited for paid tiers

      case 'commandSave':
        if (tier === 'initiate') {
          return usage.commandSaves < usage.commandLimit;
        }
        return true;

      case 'ledgerFull':
        return tier !== 'initiate';

      case 'export':
        return tier !== 'initiate';

      case 'whiteLabel':
        return tier === 'architect';

      case 'apiAccess':
        return tier === 'architect';

      default:
        return true;
    }
  };

  // Get remaining usage
  const getRemainingUsage = (feature) => {
    if (!userData) return 0;

    const { tier, usage } = userData;

    if (tier !== 'initiate') return -1; // -1 = unlimited

    switch (feature) {
      case 'construct':
        return Math.max(0, usage.constructLimit - usage.constructGenerations);
      case 'commandSave':
        return Math.max(0, usage.commandLimit - usage.commandSaves);
      default:
        return 0;
    }
  };

  const value = {
    user,
    userData,
    loading,
    isAuthenticated: !!user,
    tier: userData?.tier || 'initiate',
    refreshUserData,
    canUseFeature,
    getRemainingUsage
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
