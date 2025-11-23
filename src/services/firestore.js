import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './config';

// ============================================
// USER OPERATIONS
// ============================================

// Update user tier (subscription)
export const updateUserTier = async (uid, tier) => {
  try {
    const userRef = doc(db, 'users', uid);
    const tierLimits = {
      initiate: { constructLimit: 3, commandLimit: 10 },
      operator: { constructLimit: -1, commandLimit: -1 }, // -1 = unlimited
      architect: { constructLimit: -1, commandLimit: -1 }
    };

    await updateDoc(userRef, {
      tier,
      'usage.constructLimit': tierLimits[tier].constructLimit,
      'usage.commandLimit': tierLimits[tier].commandLimit,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Increment usage counter
export const incrementUsage = async (uid, field) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      [`usage.${field}`]: increment(1),
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// ============================================
// SAVED PROMPTS (COMMAND)
// ============================================

// Save a prompt configuration
export const savePrompt = async (uid, promptData) => {
  try {
    const promptsRef = collection(db, 'users', uid, 'prompts');
    const docRef = await addDoc(promptsRef, {
      ...promptData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    await incrementUsage(uid, 'commandSaves');
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Get all saved prompts for a user
export const getUserPrompts = async (uid) => {
  try {
    const promptsRef = collection(db, 'users', uid, 'prompts');
    const q = query(promptsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const prompts = [];
    snapshot.forEach((doc) => {
      prompts.push({ id: doc.id, ...doc.data() });
    });

    return { prompts, error: null };
  } catch (error) {
    return { prompts: [], error: error.message };
  }
};

// Delete a saved prompt
export const deletePrompt = async (uid, promptId) => {
  try {
    await deleteDoc(doc(db, 'users', uid, 'prompts', promptId));
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// ============================================
// CONSTRUCT GENERATIONS
// ============================================

// Save a Construct generation
export const saveConstruct = async (uid, constructData) => {
  try {
    const constructsRef = collection(db, 'users', uid, 'constructs');
    const docRef = await addDoc(constructsRef, {
      ...constructData,
      createdAt: serverTimestamp()
    });

    // Increment usage
    await incrementUsage(uid, 'constructGenerations');

    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Get all Construct generations for a user
export const getUserConstructs = async (uid) => {
  try {
    const constructsRef = collection(db, 'users', uid, 'constructs');
    const q = query(constructsRef, orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);

    const constructs = [];
    snapshot.forEach((doc) => {
      constructs.push({ id: doc.id, ...doc.data() });
    });

    return { constructs, error: null };
  } catch (error) {
    return { constructs: [], error: error.message };
  }
};

// ============================================
// LEDGER WATCHLIST
// ============================================

// Save/update watchlist
export const saveWatchlist = async (uid, cryptoIds) => {
  try {
    const watchlistRef = doc(db, 'users', uid, 'settings', 'ledger');
    await setDoc(watchlistRef, {
      watchlist: cryptoIds,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Get watchlist
export const getWatchlist = async (uid) => {
  try {
    const watchlistRef = doc(db, 'users', uid, 'settings', 'ledger');
    const docSnap = await getDoc(watchlistRef);

    if (docSnap.exists()) {
      return { watchlist: docSnap.data().watchlist || [], error: null };
    }
    return { watchlist: ['btc', 'eth'], error: null }; // Default watchlist
  } catch (error) {
    return { watchlist: [], error: error.message };
  }
};

// ============================================
// ANALYTICS EVENTS
// ============================================

// Log custom event
export const logEvent = async (uid, eventName, eventData = {}) => {
  try {
    const eventsRef = collection(db, 'analytics');
    await addDoc(eventsRef, {
      uid,
      eventName,
      eventData,
      timestamp: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};
