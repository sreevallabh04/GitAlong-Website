import React, { useState, useEffect, useCallback } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { Star, GitFork, TrendingUp, BookOpen, LogIn, Heart, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { SEO } from '../components/SEO';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { githubService, Repository } from '../services/githubService';
import toast from 'react-hot-toast';

interface SwipeableProfileCardProps {
  repo: Repository;
  onSwipeLeft?: (repo: Repository) => void;
  onSwipeRight?: (repo: Repository) => void;
  onSwipeUp?: (repo: Repository) => void;
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
        y: -1000, opacity: 0, rotate: -15,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
      });
      onSwipeUp?.(repo);
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      await controls.start({
        x: 1000, opacity: 0, rotate: 15,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
      });
      onSwipeRight?.(repo);
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      await controls.start({
        x: -1000, opacity: 0, rotate: -15,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
      });
      onSwipeLeft?.(repo);
    }
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
          avatarUrl={repo.owner?.avatar_url || 'https://avatars.githubusercontent.com/u/0?v=4'}
          name={repo.name}
          title={repo.description || 'No description available'}
          handle={repo.owner?.login || repo.full_name.split('/')[0]}
          status={`${repo.stargazers_count.toLocaleString()} stars`}
          contactText="View Repository"
          showUserInfo={true}
          showActionButtons={false}
          enableTilt={true}
          enableMobileTilt={false}
          onContactClick={() => window.open(repo.html_url, '_blank')}
        />

        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center justify-between text-sm text-white mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{repo.stargazers_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-4 h-4 text-green-400" />
              <span>{repo.forks_count.toLocaleString()}</span>
            </div>
            {repo.language && (
              <span className="px-2 py-1 bg-green-500/20 rounded text-blue-300 text-xs">
                {repo.language}
              </span>
            )}
          </div>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5"
          >
            <ExternalLink className="w-4 h-4" />
            View Repository
          </a>
        </div>

        <div className="flex gap-4 w-full">
          <button
            onClick={() => onSwipeRight?.(repo)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1"
            type="button"
          >
            <span className="text-xl">&check;</span>
            Save
          </button>
          <button
            onClick={() => onSwipeLeft?.(repo)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1"
            type="button"
          >
            <span className="text-xl">&times;</span>
            Skip
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const DiscoverPage: React.FC = () => {
  const { currentUser, isSupabaseAvailable } = useAuth();
  const navigate = useNavigate();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [savedRepos, setSavedRepos] = useState<Repository[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSavedRepos, setShowSavedRepos] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser || !isSupabaseAvailable) {
      toast.error('Please sign in to access Discover');
      navigate('/');
    }
  }, [currentUser, isSupabaseAvailable, navigate]);

  const fetchTrendingRepos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const trending = await githubService.getTrendingRepositories();
      setRepos(trending);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Failed to fetch trending repos:', err);
      setError('Failed to load repositories. GitHub API rate limit may have been reached.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchTrendingRepos();
    }
  }, [currentUser, fetchTrendingRepos]);

  useEffect(() => {
    const saved = localStorage.getItem('savedRepos');
    if (saved) {
      try {
        setSavedRepos(JSON.parse(saved));
      } catch {
        console.error('Failed to load saved repos from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedRepos', JSON.stringify(savedRepos));
  }, [savedRepos]);

  const handleSwipeRight = (repo: Repository) => {
    if (!savedRepos.find(r => r.id === repo.id)) {
      setSavedRepos(prev => [...prev, repo]);
      toast.success(`Saved ${repo.name} to favorites!`);
    }
    setCurrentIndex(prev => prev + 1);
  };

  const handleSwipeLeft = (repo: Repository) => {
    toast(`Skipped ${repo.name}`);
    setCurrentIndex(prev => prev + 1);
  };

  const handleSwipeUp = (repo: Repository) => {
    window.open(repo.html_url, '_blank');
    setCurrentIndex(prev => prev + 1);
  };

  const handleRemoveSaved = (repoId: number) => {
    setSavedRepos(prev => prev.filter(r => r.id !== repoId));
    toast.success('Removed from favorites');
  };

  if (!currentUser || !isSupabaseAvailable) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-center p-12 max-w-md">
          <LogIn className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Sign In Required</h3>
          <p className="text-gray-400 mb-6">Please sign in to discover and save repositories</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const currentRepo = repos[currentIndex];
  const allExplored = currentIndex >= repos.length && repos.length > 0;

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <SEO
        title="Discover Repositories - GitAlong"
        description="Swipe through trending GitHub repositories and discover your next coding project."
        url="https://gitalong.vercel.app/discover"
        type="website"
      />

      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              Trending on GitHub
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-green-500 bg-clip-text text-transparent">
              Find Your Next Project
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Swipe through trending GitHub repositories and save the ones you love
            </p>
            <div className="mt-4 flex items-center justify-center gap-4">
              {savedRepos.length > 0 && (
                <button
                  onClick={() => setShowSavedRepos(!showSavedRepos)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/40 rounded-lg text-green-400 hover:bg-green-600/30 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  {showSavedRepos ? 'Back to Swiping' : `Saved (${savedRepos.length})`}
                </button>
              )}
              <button
                onClick={fetchTrendingRepos}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {showSavedRepos && savedRepos.length > 0 && (
        <section className="py-8 pb-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Your Saved Repositories</h2>
              <p className="text-gray-400">Repositories you've saved for later</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedRepos.map((repo) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 rounded-xl bg-[#161B22] border border-[#30363D] hover:border-green-500/40 transition-all duration-300"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={repo.owner?.avatar_url || 'https://avatars.githubusercontent.com/u/0?v=4'}
                      alt={repo.owner?.login || repo.full_name}
                      className="w-12 h-12 rounded-lg border border-[#30363D]"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{repo.name}</h3>
                      <p className="text-gray-400 text-sm truncate">{repo.owner?.login || repo.full_name.split('/')[0]}</p>
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
                      <span className="px-2 py-1 bg-green-500/20 rounded text-blue-300">
                        {repo.language}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
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

      {!showSavedRepos && (
        <section className="py-8 pb-20">
          <div className="max-w-3xl mx-auto px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-green-400 animate-spin mb-4" />
                <p className="text-gray-400">Loading trending repositories...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
                <p className="text-gray-400 mb-6">{error}</p>
                <button
                  onClick={fetchTrendingRepos}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : allExplored ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">All caught up!</h3>
                <p className="text-gray-400 mb-6">You've explored all trending repositories.</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={fetchTrendingRepos}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Load More
                  </button>
                  {savedRepos.length > 0 && (
                    <button
                      onClick={() => setShowSavedRepos(true)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      My Favorites ({savedRepos.length})
                    </button>
                  )}
                </div>
              </div>
            ) : currentRepo ? (
              <>
                <div className="relative h-[650px] flex items-center justify-center">
                  {repos.slice(currentIndex, currentIndex + 3).map((repo, index) => {
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
                          zIndex: 3 - index,
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
                <div className="mt-8 text-center text-gray-400 text-sm">
                  <p>Swipe right to save &bull; Swipe left to skip &bull; Swipe up for details</p>
                  <p className="mt-2 text-gray-500">{currentIndex + 1} / {repos.length}</p>
                </div>
              </>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
};
