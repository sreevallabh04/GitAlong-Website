import React, { useState, useEffect, useCallback } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import {
  Star, GitFork, TrendingUp, BookOpen, LogIn, Heart,
  ExternalLink, RefreshCw, Loader2, Users, Code2, MapPin
} from 'lucide-react';
import { SEO } from '../components/SEO';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { githubService, Repository } from '../services/githubService';
import { backendService, UserSummary } from '../services/backendService';
import toast from 'react-hot-toast';

// ─── Unified card item: either a developer (from backend) or a repo (fallback) ─

type DiscoverMode = 'developers' | 'repos';

interface DeveloperCardProps {
  dev: UserSummary;
  onSwipeLeft?: (dev: UserSummary) => void;
  onSwipeRight?: (dev: UserSummary) => void;
}

const SwipeableDeveloperCard: React.FC<DeveloperCardProps> = ({
  dev,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const controls = useAnimation();

  const handleDragEnd = async (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 150;
    const velocityThreshold = 500;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      await controls.start({
        x: 1000, opacity: 0, rotate: 15,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
      });
      onSwipeRight?.(dev);
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      await controls.start({
        x: -1000, opacity: 0, rotate: -15,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
      });
      onSwipeLeft?.(dev);
    }
  };

  const githubUrl = `https://github.com/${dev.username}`;

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ opacity: 1, y: 0 }}
      whileDrag={{ scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      className="absolute inset-0 flex items-center justify-center"
      style={{ touchAction: 'none' }}
    >
      <div className="w-full max-w-md flex flex-col gap-4">
        <ProfileCard
          avatarUrl={dev.avatar_url || 'https://avatars.githubusercontent.com/u/0?v=4'}
          name={dev.name || dev.username}
          title={dev.bio || 'GitHub Developer'}
          handle={dev.username}
          status={dev.match_score !== null ? `${Math.round(dev.match_score)}% match` : `${dev.followers} followers`}
          contactText="View GitHub"
          showUserInfo={true}
          showActionButtons={false}
          enableTilt={true}
          enableMobileTilt={false}
          onContactClick={() => window.open(githubUrl, '_blank')}
        />

        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-green-500/20">
          <div className="flex flex-wrap items-center gap-3 text-sm text-white mb-3">
            {dev.location && (
              <div className="flex items-center gap-1 text-gray-300">
                <MapPin className="w-3 h-3 text-green-400" />
                <span className="text-xs">{dev.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-green-400" />
              <span>{dev.followers.toLocaleString()} followers</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>{dev.public_repos} repos</span>
            </div>
          </div>
          {dev.languages.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {dev.languages.slice(0, 5).map((lang) => (
                <span key={lang} className="px-2 py-0.5 bg-green-500/20 rounded text-blue-300 text-xs">
                  {lang}
                </span>
              ))}
            </div>
          )}
          {dev.match_score !== null && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Match Score</span>
                <span className="text-green-400 font-bold">{Math.round(dev.match_score)}%</span>
              </div>
              <div className="w-full bg-[#30363D] rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-green-600 to-green-400 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min(dev.match_score, 100)}%` }}
                />
              </div>
            </div>
          )}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-lg shadow-green-500/30"
          >
            <ExternalLink className="w-4 h-4" />
            View GitHub Profile
          </a>
        </div>

        <div className="flex gap-4 w-full">
          <button
            onClick={() => onSwipeRight?.(dev)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/30 hover:-translate-y-1"
            type="button"
          >
            <span className="text-xl">&check;</span>
            Connect
          </button>
          <button
            onClick={() => onSwipeLeft?.(dev)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/30 hover:-translate-y-1"
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

// ─── Repo swipe card (fallback mode) ─────────────────────────────────────────

interface RepoCardProps {
  repo: Repository;
  onSwipeLeft?: (repo: Repository) => void;
  onSwipeRight?: (repo: Repository) => void;
  onSwipeUp?: (repo: Repository) => void;
}

const SwipeableRepoCard: React.FC<RepoCardProps> = ({
  repo, onSwipeLeft, onSwipeRight, onSwipeUp,
}) => {
  const controls = useAnimation();

  const handleDragEnd = async (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 150;
    const velocityThreshold = 500;

    if (Math.abs(info.offset.y) > Math.abs(info.offset.x) && info.offset.y < -threshold) {
      await controls.start({ y: -1000, opacity: 0, rotate: -15, transition: { duration: 0.4 } });
      onSwipeUp?.(repo);
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      await controls.start({ x: 1000, opacity: 0, rotate: 15, transition: { duration: 0.4 } });
      onSwipeRight?.(repo);
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      await controls.start({ x: -1000, opacity: 0, rotate: -15, transition: { duration: 0.4 } });
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
      whileDrag={{ scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
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
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-lg shadow-green-500/30"
          >
            <ExternalLink className="w-4 h-4" />
            View Repository
          </a>
        </div>

        <div className="flex gap-4 w-full">
          <button
            onClick={() => onSwipeRight?.(repo)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/30 hover:-translate-y-1"
            type="button"
          >
            <span className="text-xl">&check;</span>
            Save
          </button>
          <button
            onClick={() => onSwipeLeft?.(repo)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/30 hover:-translate-y-1"
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export const DiscoverPage: React.FC = () => {
  const { currentUser, githubAccessToken, supabaseAccessToken } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<DiscoverMode>('developers');
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'no-users'>('online');
  const [developers, setDevelopers] = useState<UserSummary[]>([]);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [savedDevs, setSavedDevs] = useState<UserSummary[]>([]);
  const [savedRepos, setSavedRepos] = useState<Repository[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSaved, setShowSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please sign in to access Discover');
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Load persisted saved items
  useEffect(() => {
    try {
      const sd = localStorage.getItem('savedDevs');
      if (sd) setSavedDevs(JSON.parse(sd));
      const sr = localStorage.getItem('savedRepos');
      if (sr) setSavedRepos(JSON.parse(sr));
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedDevs', JSON.stringify(savedDevs));
  }, [savedDevs]);

  useEffect(() => {
    localStorage.setItem('savedRepos', JSON.stringify(savedRepos));
  }, [savedRepos]);

  const fetchContent = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    setCurrentIndex(0);

    console.log('[discover] fetchContent called', {
      backendUrl: import.meta.env.VITE_BACKEND_URL,
      hasSupabaseToken: !!supabaseAccessToken,
      tokenPrefix: supabaseAccessToken?.slice(0, 30) ?? 'NULL',
    });

    // Try backend ML recommendations first (requires Supabase JWT)
    if (supabaseAccessToken) {
      console.log('[discover] supabaseAccessToken present, checking health...');
      const backendHealthy = await backendService.isHealthy();
      console.log('[discover] backend healthy:', backendHealthy);
      if (backendHealthy) {
        try {
          const result = await backendService.getRecommendations(supabaseAccessToken, 20);
          console.log('[discover] recommendations result:', {
            total: result.total,
            algorithm: result.algorithm,
            count: result.recommendations.length,
          });
          if (result.recommendations.length > 0) {
            setDevelopers(result.recommendations);
            setMode('developers');
            setBackendStatus('online');
            setLoading(false);
            return;
          } else {
            // Backend is up but no other users in DB yet
            console.log('[discover] backend returned 0 recommendations (no other users in DB)');
            setBackendStatus('no-users');
          }
        } catch (err) {
          console.error('[discover] getRecommendations failed:', err);
          setBackendStatus('offline');
        }
      } else {
        console.warn('[discover] backend health check failed → falling back to trending repos');
        setBackendStatus('offline');
      }
    } else {
      console.warn('[discover] supabaseAccessToken is NULL → skipping backend, falling back to trending repos');
      setBackendStatus('offline');
    }

    // Fallback: GitHub trending repos
    try {
      const trending = await githubService.getTrendingRepositories(undefined, githubAccessToken);
      setRepos(trending);
      setMode('repos');
    } catch (err: any) {
      setError(err.message || 'Failed to load content.');
    } finally {
      setLoading(false);
    }
  }, [currentUser, supabaseAccessToken, githubAccessToken]);

  useEffect(() => {
    if (currentUser) {
      fetchContent();
    }
  }, [currentUser, fetchContent]);

  // ── Handlers ──
  const handleDevSwipeRight = (dev: UserSummary) => {
    if (!savedDevs.find(d => d.id === dev.id)) {
      setSavedDevs(prev => [...prev, dev]);
      toast.success(`Saved ${dev.name || dev.username}!`);
    }
    setCurrentIndex(prev => prev + 1);
  };

  const handleDevSwipeLeft = (_dev: UserSummary) => {
    setCurrentIndex(prev => prev + 1);
  };

  const handleRepoSwipeRight = (repo: Repository) => {
    if (!savedRepos.find(r => r.id === repo.id)) {
      setSavedRepos(prev => [...prev, repo]);
      toast.success(`Saved ${repo.name} to favorites!`);
    }
    setCurrentIndex(prev => prev + 1);
  };

  const handleRepoSwipeLeft = (repo: Repository) => {
    toast(`Skipped ${repo.name}`);
    setCurrentIndex(prev => prev + 1);
  };

  const handleRepoSwipeUp = (repo: Repository) => {
    window.open(repo.html_url, '_blank');
    setCurrentIndex(prev => prev + 1);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-center p-12 max-w-md">
          <LogIn className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Sign In Required</h3>
          <p className="text-gray-400 mb-6">Please sign in to discover developers and repositories</p>
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

  const items = mode === 'developers' ? developers : repos;
  const allExplored = currentIndex >= items.length && items.length > 0;
  const totalSaved = mode === 'developers' ? savedDevs.length : savedRepos.length;

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <SEO
        title="Discover – GitAlong"
        description="Swipe through developer recommendations and trending GitHub repositories."
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
              {mode === 'developers' ? (
                <><Users className="w-4 h-4" /> Developer Recommendations</>
              ) : (
                <><TrendingUp className="w-4 h-4" /> Trending on GitHub</>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-green-500 bg-clip-text text-transparent">
              {mode === 'developers' ? 'Find Your Match' : 'Find Your Next Project'}
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              {mode === 'developers'
                ? 'ML-powered developer recommendations based on your GitHub activity'
                : 'Swipe through trending GitHub repositories and save the ones you love'}
            </p>

            <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
              {totalSaved > 0 && (
                <button
                  onClick={() => setShowSaved(!showSaved)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/40 rounded-lg text-green-400 hover:bg-green-600/30 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  {showSaved ? 'Back to Swiping' : `Saved (${totalSaved})`}
                </button>
              )}
              <button
                onClick={fetchContent}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {mode === 'repos' && backendStatus === 'offline' && (
                <span className="text-xs px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500">
                  Backend offline – showing trending repos
                </span>
              )}
              {mode === 'repos' && backendStatus === 'no-users' && (
                <span className="text-xs px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400">
                  No other users yet – showing trending repos
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Saved panel ── */}
      {showSaved && (
        <section className="py-8 pb-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              {mode === 'developers' ? 'Saved Developers' : 'Saved Repositories'}
            </h2>

            {mode === 'developers' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedDevs.map((dev) => (
                  <motion.div
                    key={dev.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-[#161B22] border border-[#30363D] hover:border-green-500/40 transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={dev.avatar_url || 'https://avatars.githubusercontent.com/u/0?v=4'}
                        alt={dev.username}
                        className="w-12 h-12 rounded-full border border-[#30363D]"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate">{dev.name || dev.username}</h3>
                        <p className="text-gray-400 text-sm truncate">@{dev.username}</p>
                      </div>
                      {dev.match_score !== null && (
                        <span className="text-xs text-green-400 font-bold">
                          {Math.round(dev.match_score)}%
                        </span>
                      )}
                    </div>
                    {dev.bio && <p className="text-gray-300 text-sm mb-3 line-clamp-2">{dev.bio}</p>}
                    {dev.languages.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {dev.languages.slice(0, 4).map((l) => (
                          <span key={l} className="px-2 py-0.5 bg-green-500/20 rounded text-blue-300 text-xs">{l}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <a
                        href={`https://github.com/${dev.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                      <button
                        onClick={() => setSavedDevs(prev => prev.filter(d => d.id !== dev.id))}
                        className="px-3 py-2 bg-red-600/20 text-red-400 border border-red-500/40 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedRepos.map((repo) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-[#161B22] border border-[#30363D] hover:border-green-500/40 transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={repo.owner?.avatar_url || 'https://avatars.githubusercontent.com/u/0?v=4'}
                        alt={repo.owner?.login}
                        className="w-12 h-12 rounded-lg border border-[#30363D]"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate">{repo.name}</h3>
                        <p className="text-gray-400 text-sm truncate">{repo.owner?.login}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{repo.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3" />{repo.stargazers_count.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><GitFork className="w-3 h-3" />{repo.forks_count.toLocaleString()}</span>
                      </div>
                      {repo.language && (
                        <span className="px-2 py-1 bg-green-500/20 rounded text-blue-300">{repo.language}</span>
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
                        onClick={() => setSavedRepos(prev => prev.filter(r => r.id !== repo.id))}
                        className="px-3 py-2 bg-red-600/20 text-red-400 border border-red-500/40 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Swipe stack ── */}
      {!showSaved && (
        <section className="py-8 pb-20">
          <div className="max-w-3xl mx-auto px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-green-400 animate-spin mb-4" />
                <p className="text-gray-400">
                  {supabaseAccessToken ? 'Waking up the recommendation engine (this may take up to 30s on first load)...' : 'Loading trending repositories...'}
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
                <p className="text-gray-400 mb-6">{error}</p>
                <button
                  onClick={fetchContent}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : allExplored ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">All caught up!</h3>
                <p className="text-gray-400 mb-6">
                  {mode === 'developers'
                    ? "You've seen all your developer recommendations."
                    : "You've explored all trending repositories."}
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={fetchContent}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Load More
                  </button>
                  {totalSaved > 0 && (
                    <button
                      onClick={() => setShowSaved(true)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      My Saved ({totalSaved})
                    </button>
                  )}
                </div>
              </div>
            ) : mode === 'developers' && developers[currentIndex] ? (
              <>
                <div className="relative h-[680px] flex items-center justify-center">
                  {developers.slice(currentIndex, currentIndex + 3).map((dev, index) => {
                    const isTop = index === 0;
                    return (
                      <motion.div
                        key={dev.id}
                        className="absolute inset-0"
                        animate={{ scale: 1 - index * 0.05, opacity: isTop ? 1 : 0.6, y: index * 20 }}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: index * 0.1 }}
                        style={{ zIndex: 3 - index, pointerEvents: isTop ? 'auto' : 'none' }}
                      >
                        {isTop && (
                          <SwipeableDeveloperCard
                            dev={dev}
                            onSwipeRight={handleDevSwipeRight}
                            onSwipeLeft={handleDevSwipeLeft}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-8 text-center text-gray-400 text-sm">
                  <p>Swipe right to connect &bull; Swipe left to skip</p>
                  <p className="mt-2 text-gray-500">{currentIndex + 1} / {developers.length}</p>
                </div>
              </>
            ) : mode === 'repos' && repos[currentIndex] ? (
              <>
                <div className="relative h-[650px] flex items-center justify-center">
                  {repos.slice(currentIndex, currentIndex + 3).map((repo, index) => {
                    const isTop = index === 0;
                    return (
                      <motion.div
                        key={repo.id}
                        className="absolute inset-0"
                        animate={{ scale: 1 - index * 0.05, opacity: isTop ? 1 : 0.6, y: index * 20 }}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: index * 0.1 }}
                        style={{ zIndex: 3 - index, pointerEvents: isTop ? 'auto' : 'none' }}
                      >
                        {isTop && (
                          <SwipeableRepoCard
                            repo={repo}
                            onSwipeRight={handleRepoSwipeRight}
                            onSwipeLeft={handleRepoSwipeLeft}
                            onSwipeUp={handleRepoSwipeUp}
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
