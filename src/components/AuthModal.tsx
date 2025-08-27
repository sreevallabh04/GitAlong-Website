import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGitHub, isFirebaseAvailable } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGithubSignIn = async () => {
    if (!isFirebaseAvailable) {
      setError('Authentication is not available. Please try again later.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await loginWithGitHub();
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md mx-4"
          >
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Sign in to GitAlong
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Firebase Not Available Warning */}
              {!isFirebaseAvailable && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm"
                >
                  Authentication service is currently unavailable. Please try again later.
                </motion.div>
              )}

              {/* GitHub Sign In */}
              <div className="space-y-4">
                <button
                  onClick={handleGithubSignIn}
                  disabled={loading || !isFirebaseAvailable}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-[#2EA043] to-[#3FB950] text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-[#2EA043]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <Github className="w-5 h-5 mr-3" />
                      Continue with GitHub
                    </>
                  )}
                </button>
              </div>

              {/* Info Message */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Sign in with your GitHub account to find your perfect coding partner and collaborate on amazing projects.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};