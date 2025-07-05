import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Github, User, MapPin, Building, Globe, Calendar, Star, GitBranch, Eye, ExternalLink, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { githubService, GitHubUser, Repository } from '../services/githubService';
import { useNavigate } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<GitHubUser | null>(null);
  const [userRepos, setUserRepos] = useState<Repository[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const result = await githubService.searchUsers(query);
      setUsers(result.items);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (user: GitHubUser) => {
    setSelectedUser(user);
    setLoadingRepos(true);
    try {
      const repos = await githubService.getUserRepositories(user.login);
      setUserRepos(repos);
    } catch (error) {
      console.error('Error fetching user repositories:', error);
      setUserRepos([]);
    } finally {
      setLoadingRepos(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Header */}
      <div className="bg-[#161B22] border-b border-[#30363D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <h1 className="text-2xl font-bold text-white">Find Developers</h1>
            <div className="w-8"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for developers by username, name, or skills..."
                className="w-full pl-12 pr-4 py-4 bg-[#161B22] border border-[#30363D] rounded-xl text-white placeholder-gray-400 focus:border-[#2EA043] focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-[#2EA043] text-white rounded-lg hover:bg-[#2EA043]/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-white mb-4">Developers</h2>
            <div className="space-y-4">
              <AnimatePresence>
                {users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleUserClick(user)}
                    className={`p-4 bg-[#161B22] border border-[#30363D] rounded-xl cursor-pointer transition-all hover:border-[#2EA043] hover:bg-[#161B22]/80 ${
                      selectedUser?.id === user.id ? 'border-[#2EA043] bg-[#2EA043]/10' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate">{user.name || user.login}</h3>
                        <p className="text-gray-400 text-sm truncate">@{user.login}</p>
                        {user.bio && (
                          <p className="text-gray-300 text-sm mt-1 line-clamp-2">{user.bio}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
                      <span>{user.public_repos} repos</span>
                      <span>{user.followers} followers</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* User Details */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#161B22] border border-[#30363D] rounded-xl p-6"
              >
                {/* User Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <img
                    src={selectedUser.avatar_url}
                    alt={selectedUser.login}
                    className="w-20 h-20 rounded-full"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {selectedUser.name || selectedUser.login}
                    </h2>
                    <p className="text-gray-400 mb-2">@{selectedUser.login}</p>
                    {selectedUser.bio && (
                      <p className="text-gray-300 mb-4">{selectedUser.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      {selectedUser.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {selectedUser.location}
                        </div>
                      )}
                      {selectedUser.company && (
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {selectedUser.company}
                        </div>
                      )}
                      {selectedUser.blog && (
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          <a
                            href={selectedUser.blog}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#2EA043] transition-colors"
                          >
                            Website
                          </a>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Joined {formatDate(selectedUser.created_at)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <a
                      href={`https://github.com/${selectedUser.login}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-white hover:border-[#2EA043] transition-colors"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View Profile
                    </a>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{selectedUser.public_repos}</div>
                      <div className="text-sm text-gray-400">Repositories</div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-[#0D1117] rounded-lg">
                    <div className="text-2xl font-bold text-white">{selectedUser.public_repos}</div>
                    <div className="text-sm text-gray-400">Repositories</div>
                  </div>
                  <div className="text-center p-4 bg-[#0D1117] rounded-lg">
                    <div className="text-2xl font-bold text-white">{selectedUser.followers}</div>
                    <div className="text-sm text-gray-400">Followers</div>
                  </div>
                  <div className="text-center p-4 bg-[#0D1117] rounded-lg">
                    <div className="text-2xl font-bold text-white">{selectedUser.following}</div>
                    <div className="text-sm text-gray-400">Following</div>
                  </div>
                </div>

                {/* Repositories */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Top Repositories</h3>
                  {loadingRepos ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400">Loading repositories...</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userRepos.slice(0, 5).map((repo) => (
                        <div
                          key={repo.id}
                          className="p-4 bg-[#0D1117] border border-[#30363D] rounded-lg hover:border-[#2EA043] transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-white font-semibold mb-1">{repo.name}</h4>
                              {repo.description && (
                                <p className="text-gray-300 text-sm mb-2">{repo.description}</p>
                              )}
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span className="flex items-center">
                                  <Star className="w-4 h-4 mr-1" />
                                  {repo.stargazers_count}
                                </span>
                                <span className="flex items-center">
                                  <GitBranch className="w-4 h-4 mr-1" />
                                  {repo.forks_count}
                                </span>
                                {repo.language && (
                                  <span className="flex items-center">
                                    <Eye className="w-4 h-4 mr-1" />
                                    {repo.language}
                                  </span>
                                )}
                              </div>
                            </div>
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-4 p-2 text-gray-400 hover:text-[#2EA043] transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-8 text-center">
                <Github className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Select a Developer</h3>
                <p className="text-gray-400">
                  Search for developers and click on their profile to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 