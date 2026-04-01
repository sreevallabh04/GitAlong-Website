import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import {
  backendService,
  MatchItem,
  RepoSwipeHistoryItem,
  SwipeHistoryItem,
  UserSummary,
} from '../services/backendService';
import { useAuth } from '../contexts/AuthContext';

export const AppActivityPage: React.FC = () => {
  const { supabaseAccessToken } = useAuth();
  const [likedUsers, setLikedUsers] = useState<UserSummary[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<MatchItem[]>([]);
  const [recentSwipes, setRecentSwipes] = useState<SwipeHistoryItem[]>([]);
  const [savedRepos, setSavedRepos] = useState<RepoSwipeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!supabaseAccessToken) {
        setLoading(false);
        return;
      }

      try {
        const [history, matches, repoSaves] = await Promise.all([
          backendService.getSwipeHistory(supabaseAccessToken, 100),
          backendService.getMatches(supabaseAccessToken, 50),
          backendService.getRepoSwipeHistory(supabaseAccessToken, 100, 'save'),
        ]);
        setRecentSwipes(history);
        setMatchedUsers(matches.matches || []);
        setSavedRepos(repoSaves);

        const likedRows = history.filter((h) => h.action === 'like' || h.action === 'superLike');
        const uniqueLikedIds = Array.from(new Set(likedRows.map((h) => h.swiped_user_id)));
        const profiles = await Promise.all(
          uniqueLikedIds.map(async (uid) => {
            try {
              return await backendService.getUserProfile(supabaseAccessToken, uid);
            } catch {
              return null;
            }
          })
        );

        setLikedUsers(
          profiles
            .filter((p): p is NonNullable<typeof p> => p !== null)
            .map((p) => ({
              id: p.id,
              username: p.username,
              name: p.name,
              bio: p.bio,
              avatar_url: p.avatar_url,
              location: p.location,
              public_repos: p.public_repos,
              followers: p.followers,
              languages: p.languages,
              interests: p.interests,
              match_score: null,
            }))
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabaseAccessToken]);

  return (
    <section className="py-6 px-4 md:px-6">
      {loading ? (
        <div className="text-gray-400">Loading activity...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-[#161B22] border border-[#30363D]">
            <h3 className="text-base font-semibold text-green-400 mb-4">Liked Developers ({likedUsers.length})</h3>
            <div className="space-y-3 max-h-[60vh] overflow-auto pr-1">
              {likedUsers.length === 0 ? (
                <p className="text-sm text-gray-400">No liked developers yet.</p>
              ) : (
                likedUsers.map((dev) => (
                  <div key={dev.id} className="flex items-center gap-3 p-2 rounded-lg bg-black/20 border border-[#30363D]">
                    <img
                      src={dev.avatar_url || 'https://avatars.githubusercontent.com/u/0?v=4'}
                      alt={dev.username}
                      className="w-9 h-9 rounded-full border border-[#30363D]"
                    />
                    <div className="min-w-0">
                      <div className="text-white text-sm font-semibold truncate">{dev.name || dev.username}</div>
                      <div className="text-gray-400 text-xs truncate">@{dev.username}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#161B22] border border-[#30363D]">
            <h3 className="text-base font-semibold text-blue-400 mb-4">Matches ({matchedUsers.length})</h3>
            <div className="space-y-3 max-h-[60vh] overflow-auto pr-1">
              {matchedUsers.length === 0 ? (
                <p className="text-sm text-gray-400">No matches yet.</p>
              ) : (
                matchedUsers.map((match) => (
                  <div key={match.id} className="flex items-center gap-3 p-2 rounded-lg bg-black/20 border border-[#30363D]">
                    <img
                      src={match.other_user.avatar_url || 'https://avatars.githubusercontent.com/u/0?v=4'}
                      alt={match.other_user.username}
                      className="w-9 h-9 rounded-full border border-[#30363D]"
                    />
                    <div className="min-w-0">
                      <div className="text-white text-sm font-semibold truncate">
                        {match.other_user.name || match.other_user.username}
                      </div>
                      <div className="text-gray-400 text-xs truncate">@{match.other_user.username}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#161B22] border border-[#30363D]">
            <h3 className="text-base font-semibold text-purple-300 mb-4">Recent Swipes ({recentSwipes.length})</h3>
            <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
              {recentSwipes.length === 0 ? (
                <p className="text-sm text-gray-400">No swipe activity yet.</p>
              ) : (
                recentSwipes.map((swipe) => (
                  <div key={swipe.id} className="flex items-center justify-between rounded-lg border border-[#30363D] bg-black/20 p-2">
                    <div className="text-xs text-gray-200 truncate pr-2">{swipe.swiped_user_id}</div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          swipe.action === 'dislike'
                            ? 'bg-red-500/15 text-red-300'
                            : swipe.action === 'superLike'
                            ? 'bg-blue-500/15 text-blue-300'
                            : 'bg-green-500/15 text-green-300'
                        }`}
                      >
                        {swipe.action}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#161B22] border border-[#30363D]">
            <h3 className="text-base font-semibold text-amber-300 mb-4">Saved Repositories ({savedRepos.length})</h3>
            <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
              {savedRepos.length === 0 ? (
                <p className="text-sm text-gray-400">No saved repositories yet.</p>
              ) : (
                savedRepos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-[#30363D] bg-black/20 p-2 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="text-xs text-white truncate font-medium">{repo.repo_full_name}</div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-gray-400">
                      <span className="truncate pr-2">{repo.repo_language || 'Unknown'}</span>
                      <span>★ {repo.repo_stars}</span>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {!supabaseAccessToken && (
        <div className="mt-6 rounded-xl border border-[#30363D] bg-[#161B22] p-4 text-gray-300 text-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-green-400" />
          Sign in to view your activity timeline.
        </div>
      )}
    </section>
  );
};

