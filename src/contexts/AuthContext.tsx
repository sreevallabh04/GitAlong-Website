import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup,
  GithubAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  isFirebaseAvailable: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  loginWithGitHub: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
  isFirebaseAvailable: false
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(false);

  useEffect(() => {
    // Check if Firebase is available
    setIsFirebaseAvailable(!!auth);
    
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGitHub = async () => {
    if (!auth) throw new Error('Firebase is not available');
    const provider = new GithubAuthProvider();
    provider.addScope('read:user');
    provider.addScope('user:email');
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) throw new Error('Firebase is not available');
    await signOut(auth);
  };

  const updateUserProfile = async (displayName: string) => {
    if (!auth) throw new Error('Firebase is not available');
    if (currentUser) {
      await updateProfile(currentUser, { displayName });
    }
  };

  const value = {
    currentUser,
    loading,
    loginWithGitHub,
    logout,
    updateUserProfile,
    isFirebaseAvailable
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};