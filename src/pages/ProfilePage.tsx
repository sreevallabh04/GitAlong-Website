import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { SEO } from '../components/SEO';
import { Breadcrumbs, BreadcrumbStructuredData } from '../components/Breadcrumbs';
import { Github, Mail, Users, Star, BookOpen, MapPin, Calendar, ExternalLink, GitFork, Eye } from 'lucide-react';

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

export const ProfilePage: React.FC = () => {
  const { currentUser, githubUserData } = useAuth();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [reposLoading, setReposLoading] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      if (!githubUserData?.login) return;
      
      try {
        setReposLoading(true);
        const response = await fetch(`https://api.github.com/users/${githubUserData.login}/repos?sort=updated&per_page=12`);
        if (response.ok) {
          const data: GitHubRepo[] = await response.json();
          // Filter out private repos and sort by stars
          const publicRepos = data
            .filter(repo => !repo.private)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);
          setRepos(publicRepos);
        }
      } catch (error) {
        console.error('Failed to fetch repos:', error);
      } finally {
        setReposLoading(false);
      }
    };

    fetchRepos();
  }, [githubUserData?.login]);

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <SEO
        title="Your Profile – GitAlong"
        description="View your GitHub profile details integrated into GitAlong."
        url="https://gitalong.vercel.app/profile"
        type="profile"
      />

      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2EA043]/10 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Profile', isActive: true }]} />
          <BreadcrumbStructuredData items={[{ label: 'Profile', href: '/profile' }]} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Avatar and basics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D]"
            >
                           {!githubUserData ? (
               <div className="text-center">
                 <div className="w-32 h-32 rounded-2xl bg-[#0D1117] border border-[#30363D] mx-auto mb-4 flex items-center justify-center">
                   <Github className="w-12 h-12 text-gray-500" />
                 </div>
                 <div className="text-gray-400 text-sm">
                   {currentUser ? 'Sign in with GitHub to view your profile data.' : 'Please sign in to view your profile.'}
                 </div>
               </div>
             ) : (
               <>
                 <img
                   src={githubUserData.avatar_url}
                   alt={`${githubUserData.login} avatar`}
                   className="w-32 h-32 rounded-2xl border border-[#30363D] object-cover"
                 />
                 <h1 className="text-2xl font-bold text-white mt-4">{githubUserData.name || githubUserData.login}</h1>
                 <a 
                   href={githubUserData.html_url} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-[#2EA043] text-sm inline-flex items-center gap-2 hover:text-[#3FB950] transition-colors"
                 >
                   <Github className="w-4 h-4" />
                   @{githubUserData.login}
                   <ExternalLink className="w-3 h-3" />
                 </a>
                 {githubUserData.bio && <p className="text-gray-300 mt-3">{githubUserData.bio}</p>}

                 <div className="mt-4 space-y-2 text-gray-300 text-sm">
                   {githubUserData.location && (
                     <div className="flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-[#2EA043]" />
                       <span>{githubUserData.location}</span>
                     </div>
                   )}
                   {githubUserData.company && (
                     <div className="flex items-center gap-2">
                       <Users className="w-4 h-4 text-[#2EA043]" />
                       <span>{githubUserData.company}</span>
                     </div>
                   )}
                   {githubUserData.created_at && (
                     <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-[#2EA043]" />
                       <span>Joined GitHub {new Date(githubUserData.created_at).toLocaleDateString()}</span>
                     </div>
                   )}
                 </div>
               </>
             )}
            </motion.div>

            {/* Right: Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2 p-6 rounded-2xl bg-[#161B22] border border-[#30363D]"
            >
                           {!githubUserData ? (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {Array.from({ length: 4 }).map((_, i) => (
                   <div key={i} className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] flex items-center justify-center">
                     <div className="text-gray-500 text-2xl">—</div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D]">
                   <div className="text-gray-400 text-xs mb-1 flex items-center gap-2"><Users className="w-3 h-3" /> Followers</div>
                   <div className="text-2xl font-bold text-white">{githubUserData.followers}</div>
                 </div>
                 <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D]">
                   <div className="text-gray-400 text-xs mb-1 flex items-center gap-2"><Users className="w-3 h-3" /> Following</div>
                   <div className="text-2xl font-bold text-white">{githubUserData.following}</div>
                 </div>
                 <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D]">
                   <div className="text-gray-400 text-xs mb-1 flex items-center gap-2"><BookOpen className="w-3 h-3" /> Public Repos</div>
                   <div className="text-2xl font-bold text-white">{githubUserData.public_repos}</div>
                 </div>
                 <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D]">
                   <div className="text-gray-400 text-xs mb-1 flex items-center gap-2"><Star className="w-3 h-3" /> Highlights</div>
                   <div className="text-2xl font-bold text-white">—</div>
                 </div>
               </div>
             )}

                             {/* Contact */}
               {(githubUserData?.email || currentUser?.email) && (
                 <div className="mt-6 text-gray-300 text-sm">
                   <div className="flex items-center gap-2">
                     <Mail className="w-4 h-4 text-[#2EA043]" />
                     <span>{githubUserData?.email || currentUser?.email}</span>
                   </div>
                 </div>
               )}
            </motion.div>
                     </div>

           {/* Public Repositories Section */}
           {githubUserData && (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="mt-12"
             >
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-white">Public Repositories</h2>
                 <a 
                   href={`https://github.com/${githubUserData.login}?tab=repositories`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-[#2EA043] text-sm hover:text-[#3FB950] transition-colors inline-flex items-center gap-2"
                 >
                   View all on GitHub
                   <ExternalLink className="w-3 h-3" />
                 </a>
               </div>

               {reposLoading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {Array.from({ length: 6 }).map((_, i) => (
                     <div key={i} className="p-4 rounded-xl bg-[#161B22] border border-[#30363D] animate-pulse">
                       <div className="h-4 bg-[#0D1117] rounded w-3/4 mb-2" />
                       <div className="h-3 bg-[#0D1117] rounded w-1/2 mb-3" />
                       <div className="h-3 bg-[#0D1117] rounded w-full" />
                     </div>
                   ))}
                 </div>
               ) : repos.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {repos.slice(0, 9).map((repo) => (
                     <motion.div
                       key={repo.id}
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ duration: 0.3 }}
                       className="p-4 rounded-xl bg-[#161B22] border border-[#30363D] hover:border-[#2EA043]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#2EA043]/5"
                     >
                       <div className="flex items-start justify-between mb-2">
                         <h3 className="font-semibold text-white text-sm truncate flex-1">
                           <a 
                             href={repo.html_url}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="hover:text-[#2EA043] transition-colors"
                           >
                             {repo.name}
                           </a>
                         </h3>
                       </div>
                       
                       {repo.description && (
                         <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                           {repo.description}
                         </p>
                       )}

                       <div className="flex items-center justify-between text-xs text-gray-500">
                         <div className="flex items-center gap-4">
                           {repo.language && (
                             <span className="flex items-center gap-1">
                               <div className="w-2 h-2 rounded-full bg-[#2EA043]" />
                               {repo.language}
                             </span>
                           )}
                           <span className="flex items-center gap-1">
                             <Star className="w-3 h-3" />
                             {repo.stargazers_count}
                           </span>
                           <span className="flex items-center gap-1">
                             <GitFork className="w-3 h-3" />
                             {repo.forks_count}
                           </span>
                         </div>
                         <span className="text-xs">
                           {new Date(repo.updated_at).toLocaleDateString()}
                         </span>
                       </div>
                     </motion.div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-8">
                   <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                   <p className="text-gray-400">No public repositories found.</p>
                 </div>
               )}
             </motion.div>
           )}
         </div>
       </section>
     </div>
   );
 };


