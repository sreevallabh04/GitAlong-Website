import React, { useState, useEffect } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { Star, GitFork, Eye, TrendingUp, BookOpen, LogIn, Heart, ExternalLink } from 'lucide-react';
import { SEO } from '../components/SEO';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  updated_at: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const mockRecommendedRepos: GitHubRepo[] = [
  {
    id: 1,
    name: 'React',
    full_name: 'facebook/react',
    description: 'The library for web and native user interfaces',
    html_url: 'https://github.com/facebook/react',
    stargazers_count: 217000,
    forks_count: 45000,
    watchers_count: 217000,
    language: 'JavaScript',
    updated_at: new Date().toISOString(),
    private: false,
    owner: {
      login: 'facebook',
      avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4'
    }
  },
  {
    id: 2,
    name: 'Vue',
    full_name: 'vuejs/vue',
    description: 'The Progressive JavaScript Framework',
    html_url: 'https://github.com/vuejs/vue',
    stargazers_count: 210000,
    forks_count: 35000,
    watchers_count: 210000,
    language: 'JavaScript',
    updated_at: new Date().toISOString(),
    private: false,
    owner: {
      login: 'vuejs',
      avatar_url: 'https://avatars.githubusercontent.com/u/6128107?v=4'
    }
  },
  {
    id: 3,
    name: 'TensorFlow',
    full_name: 'tensorflow/tensorflow',
    description: 'An Open Source Machine Learning Framework',
    html_url: 'https://github.com/tensorflow/tensorflow',
    stargazers_count: 179000,
    forks_count: 88000,
    watchers_count: 179000,
    language: 'C++',
    updated_at: new Date().toISOString(),
    private: false,
    owner: {
      login: 'tensorflow',
      avatar_url: 'https://avatars.githubusercontent.com/u/15658638?v=4'
    }
  },
  {
    id: 4,
    name: 'Node.js',
    full_name: 'nodejs/node',
    description: 'Node.js JavaScript runtime',
    html_url: 'https://github.com/nodejs/node',
    stargazers_count: 115000,
    forks_count: 30000,
    watchers_count: 115000,
    language: 'JavaScript',
    updated_at: new Date().toISOString(),
    private: false,
    owner: {
      login: 'nodejs',
      avatar_url: 'https://avatars.githubusercontent.com/u/9950313?v=4'
    }
  },
  {
    id: 5,
    name: 'TypeScript',
    full_name: 'microsoft/TypeScript',
    description: 'TypeScript is a superset of JavaScript',
    html_url: 'https://github.com/microsoft/TypeScript',
    stargazers_count: 97000,
    forks_count: 13000,
    watchers_count: 97000,
    language: 'TypeScript',
    updated_at: new Date().toISOString(),
    private: false,
    owner: {
      login: 'microsoft',
      avatar_url: 'https://avatars.githubusercontent.com/u/6154722?v=4'
    }
  }
];

interface SwipeableProfileCardProps {
  repo: GitHubRepo;
  onSwipeLeft?: (repo: GitHubRepo) => void;
  onSwipeRight?: (repo: GitHubRepo) => void;
  onSwipeUp?: (repo: GitHubRepo) => void;
}

const SwipeableProfileCard: React.FC<SwipeableProfileCardProps> = ({ 
  repo, 
  onSwipeLeft, 
  onSwipeRight,
  onSwipeUp 
}) => {
  const controls = useAnimation();

  const handleDragEnd = async (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 150;
    const velocityThreshold = 500;
    
    if (Math.abs(info.offset.y) > Math.abs(info.offset.x) && info.offset.y < -threshold) {
      await controls.start({ 
        y: -1000, 
        opacity: 0,
        rotate: -15,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
      });
      onSwipeUp?.(repo);
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      await controls.start({ 
        x: 1000, 
        opacity: 0,
        rotate: 15,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
      });
      onSwipeRight?.(repo);
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      await controls.start({ 
        x: -1000, 
        opacity: 0,
        rotate: -15,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
      });
      onSwipeLeft?.(repo);
    }
  };

  const handleViewDetails = () => {
    window.open(repo.html_url, '_blank');
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ opacity: 1, y: 0 }}
      whileDrag={{ 
        scale: 1.05,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className="absolute inset-0 flex items-center justify-center"
      style={{ touchAction: 'none' }}
    >
      <div className="w-full max-w-md flex flex-col gap-4">
        <ProfileCard
          avatarUrl={repo.owner.avatar_url}
          name={repo.name}
          title={repo.description || 'No description available'}
          handle={repo.owner.login}
          status={`${repo.stargazers_count} stars`}
          contactText="View Repository"
          showUserInfo={true}
          showActionButtons={false}
          enableTilt={true}
          enableMobileTilt={false}
          onContactClick={handleViewDetails}
        />
        
        {/* Stats overlay with View Repo link */}
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center justify-between text-sm text-white mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{repo.stargazers_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-4 h-4 text-blue-400" />
              <span>{repo.forks_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-green-400" />
              <span>{repo.watchers_count.toLocaleString()}</span>
            </div>
            {repo.language && (
              <span className="px-2 py-1 bg-blue-500/20 rounded text-blue-300 text-xs">
                {repo.language}
              </span>
            )}
          </div>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
          >
            <ExternalLink className="w-4 h-4" />
            View Repository
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full">
          <button
            onClick={() => onSwipeRight?.(repo)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1"
            type="button"
          >
            <span className="text-xl">✓</span>
            Accept
          </button>
          <button
            onClick={() => onSwipeLeft?.(repo)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1"
            type="button"
          >
            <span className="text-xl">✕</span>
            Reject
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const DiscoverPage: React.FC = () => {
  const { currentUser, isFirebaseAvailable } = useAuth();
  const navigate = useNavigate();
  const [repos] = useState<GitHubRepo[]>(mockRecommendedRepos);
  const [savedRepos, setSavedRepos] = useState<GitHubRepo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSavedRepos, setShowSavedRepos] = useState(false);

  useEffect(() => {
    // Redirect to home if not signed in
    if (!currentUser || !isFirebaseAvailable) {
      toast.error('Please sign in to access Discover');
      navigate('/');
    }
  }, [currentUser, isFirebaseAvailable, navigate]);

  // Load saved repos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedRepos');
    if (saved) {
      try {
        setSavedRepos(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved repos:', error);
      }
    }
  }, []);

  // Save to localStorage whenever savedRepos changes
  useEffect(() => {
    localStorage.setItem('savedRepos', JSON.stringify(savedRepos));
  }, [savedRepos]);

  const handleSwipeRight = (repo: GitHubRepo) => {
    if (!savedRepos.find(r => r.id === repo.id)) {
      setSavedRepos([...savedRepos, repo]);
      toast.success(`Saved ${repo.name} to favorites!`);
    }
    setCurrentIndex(prev => Math.min(prev + 1, repos.length - 1));
  };

  const handleSwipeLeft = (repo: GitHubRepo) => {
    toast(`Skipped ${repo.name}`);
    setCurrentIndex(prev => Math.min(prev + 1, repos.length - 1));
  };

  const handleSwipeUp = (repo: GitHubRepo) => {
    window.open(repo.html_url, '_blank');
    setCurrentIndex(prev => Math.min(prev + 1, repos.length - 1));
  };

  const handleRemoveSaved = (repoId: number) => {
    setSavedRepos(savedRepos.filter(r => r.id !== repoId));
    toast.success('Removed from favorites');
  };

  // Show loading or sign-in prompt if not authenticated
  if (!currentUser || !isFirebaseAvailable) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-center p-12 max-w-md">
          <LogIn className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Sign In Required</h3>
          <p className="text-gray-400 mb-6">
            Please sign in to discover and save repositories
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const currentRepo = repos[currentIndex];

  if (!currentRepo) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-center p-12 max-w-md">
          <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">All caught up!</h3>
          <p className="text-gray-400 mb-6">
            You've explored all recommended repositories.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setCurrentIndex(0)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Over
            </button>
            {savedRepos.length > 0 && (
              <button
                onClick={() => setShowSavedRepos(!showSavedRepos)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                My Favorites ({savedRepos.length})
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const visibleRepos = repos.slice(currentIndex, currentIndex + 3);

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <SEO
        title="Discover Repositories – GitAlong"
        description="Swipe through recommended GitHub repositories and discover your next coding project."
        url="https://gitalong.vercel.app/discover"
        type="website"
      />

      {/* Header */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              Discover & Explore
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent">
              Find Your Next Project
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Swipe through handpicked GitHub repositories recommended for you
            </p>
            {savedRepos.length > 0 && (
              <button
                onClick={() => setShowSavedRepos(!showSavedRepos)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/40 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-colors"
              >
                <Heart className="w-4 h-4" />
                View Saved Repos ({savedRepos.length})
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Saved Repos Section */}
      {showSavedRepos && savedRepos.length > 0 && (
        <section className="py-8 pb-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Your Saved Repositories</h2>
              <p className="text-gray-400">Repositories you've right-swiped</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedRepos.map((repo) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 rounded-xl bg-[#161B22] border border-[#30363D] hover:border-blue-500/40 transition-all duration-300"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={repo.owner.avatar_url}
                      alt={repo.owner.login}
                      className="w-12 h-12 rounded-lg border border-[#30363D]"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{repo.name}</h3>
                      <p className="text-gray-400 text-sm truncate">{repo.owner.login}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{repo.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {repo.stargazers_count.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {repo.forks_count.toLocaleString()}
                      </span>
                    </div>
                    {repo.language && (
                      <span className="px-2 py-1 bg-blue-500/20 rounded text-blue-300">
                        {repo.language}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </a>
                    <button
                      onClick={() => handleRemoveSaved(repo.id)}
                      className="px-3 py-2 bg-red-600/20 text-red-400 border border-red-500/40 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Swipeable Cards */}
      {!showSavedRepos && (
        <section className="py-8 pb-20">
          <div className="max-w-3xl mx-auto px-4">
            <div className="relative h-[650px] flex items-center justify-center">
              {visibleRepos.map((repo, index) => {
                const isTop = index === 0;
                return (
                  <motion.div
                    key={repo.id}
                    className="absolute inset-0"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ 
                      scale: 1 - index * 0.05,
                      opacity: isTop ? 1 : 0.6,
                      y: index * 20
                    }}
                    transition={{ 
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1],
                      delay: index * 0.1
                    }}
                    style={{
                      zIndex: visibleRepos.length - index,
                      pointerEvents: isTop ? 'auto' : 'none'
                    }}
                  >
                    {isTop && (
                      <SwipeableProfileCard
                        repo={repo}
                        onSwipeRight={handleSwipeRight}
                        onSwipeLeft={handleSwipeLeft}
                        onSwipeUp={handleSwipeUp}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Instructions */}
            <div className="mt-8 text-center text-gray-400 text-sm">
              <p>Swipe right to save • Swipe left to skip • Swipe up for details</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

