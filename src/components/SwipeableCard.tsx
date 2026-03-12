import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { X, Check, Star, GitFork, Eye, ExternalLink, BookOpen } from 'lucide-react';
import PixelCard from './PixelCard';

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
}

interface SwipeableCardProps {
  repo: GitHubRepo;
  onSwipeLeft?: (repo: GitHubRepo) => void;
  onSwipeRight?: (repo: GitHubRepo) => void;
  onSwipeUp?: (repo: GitHubRepo) => void;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({ 
  repo, 
  onSwipeLeft, 
  onSwipeRight,
  onSwipeUp 
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const controls = useAnimation();

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 150;
    const velocityThreshold = 500;
    
    // Determine swipe direction
    if (Math.abs(info.offset.y) > Math.abs(info.offset.x) && info.offset.y < -threshold) {
      // Swipe up
      setIsExiting(true);
      await controls.start({ 
        y: -1000, 
        opacity: 0,
        transition: { duration: 0.3 }
      });
      onSwipeUp?.(repo);
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      // Swipe right (interested)
      setIsExiting(true);
      await controls.start({ 
        x: 1000, 
        opacity: 0,
        transition: { duration: 0.3 }
      });
      onSwipeRight?.(repo);
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      // Swipe left (not interested)
      setIsExiting(true);
      await controls.start({ 
        x: -1000, 
        opacity: 0,
        transition: { duration: 0.3 }
      });
      onSwipeLeft?.(repo);
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ opacity: 1, y: 0 }}
      className="w-full cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    >
      <PixelCard variant="blue" className="p-6 h-full">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-lg truncate mb-1">
                <a 
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-green-400 transition-colors inline-flex items-center gap-2"
                >
                  {repo.name}
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                </a>
              </h3>
              <p className="text-xs text-gray-400">
                {repo.full_name}
              </p>
            </div>
            
            {/* Swipe indicators */}
            <div className="flex gap-2 ml-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <X className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </div>

          {/* Description */}
          {repo.description && (
            <p className="text-gray-300 text-sm line-clamp-3">
              {repo.description}
            </p>
          )}

          {/* Language badge */}
          {repo.language && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-400">{repo.language}</span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {repo.stargazers_count}
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="w-4 h-4" />
                {repo.forks_count}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {repo.watchers_count}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(repo.updated_at).toLocaleDateString()}
            </span>
          </div>

          {/* Instructions */}
          <div className="pt-2 text-center">
            <p className="text-xs text-gray-500">
              Swipe right to save • Swipe left to skip • Swipe up for details
            </p>
          </div>
        </div>
      </PixelCard>
    </motion.div>
  );
};

interface SwipeableCardStackProps {
  repos: GitHubRepo[];
  onSave?: (repo: GitHubRepo) => void;
  onSkip?: (repo: GitHubRepo) => void;
  onViewDetails?: (repo: GitHubRepo) => void;
}

export const SwipeableCardStack: React.FC<SwipeableCardStackProps> = ({ 
  repos, 
  onSave, 
  onSkip,
  onViewDetails 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedRepos, setSavedRepos] = useState<GitHubRepo[]>([]);
  const [skippedRepos, setSkippedRepos] = useState<GitHubRepo[]>([]);

  const handleSwipeRight = (repo: GitHubRepo) => {
    setSavedRepos([...savedRepos, repo]);
    onSave?.(repo);
    setCurrentIndex(prev => Math.min(prev + 1, repos.length - 1));
  };

  const handleSwipeLeft = (repo: GitHubRepo) => {
    setSkippedRepos([...skippedRepos, repo]);
    onSkip?.(repo);
    setCurrentIndex(prev => Math.min(prev + 1, repos.length - 1));
  };

  const handleSwipeUp = (repo: GitHubRepo) => {
    onViewDetails?.(repo);
    // Open in new tab or show details modal
    window.open(repo.html_url, '_blank');
  };

  const currentRepo = repos[currentIndex];

  if (!currentRepo) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <BookOpen className="w-16 h-16 text-green-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">All caught up!</h3>
        <p className="text-gray-400">
          You've reviewed all recommended repositories.
        </p>
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setCurrentIndex(0)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  // Show up to 3 cards stacked
  const visibleRepos = repos.slice(currentIndex, currentIndex + 3);

  return (
    <div className="relative w-full max-w-md mx-auto h-[500px]">
      {visibleRepos.map((repo, index) => {
        const isTop = index === 0;
        return (
          <div
            key={repo.id}
            className="absolute inset-0"
            style={{
              zIndex: visibleRepos.length - index,
              transform: `translateY(${index * 10}px) scale(${1 - index * 0.02})`,
              opacity: isTop ? 1 : 0.7
            }}
          >
            {isTop && (
              <SwipeableCard
                repo={repo}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
                onSwipeUp={handleSwipeUp}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

