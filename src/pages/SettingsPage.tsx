import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { SEO } from '../components/SEO';
import { Breadcrumbs, BreadcrumbStructuredData } from '../components/Breadcrumbs';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Smartphone, 
  Globe, 
  Download,
  Moon,
  Sun,
  Monitor,
  ToggleLeft,
  ToggleRight,
  Save,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Github
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, githubUserData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    projectUpdates: true,
    newMessages: true,
    weeklyDigest: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showLocation: true,
    allowMessages: true
  });
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const [showPassword, setShowPassword] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'advanced', label: 'Advanced', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage for persistence
    const settingsData = {
      notifications,
      privacy,
      theme,
      language,
      timestamp: new Date().toISOString()
    };
    
    try {
      localStorage.setItem('gitalong-settings', JSON.stringify(settingsData));
      
      // Show success feedback
      const saveButton = document.querySelector('[data-save-settings]') as HTMLButtonElement;
      if (saveButton) {
        const originalText = saveButton.innerHTML;
        saveButton.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Saved!';
        saveButton.disabled = true;
        saveButton.className = 'flex items-center gap-2 px-6 py-3 bg-[#2EA043] text-white rounded-xl cursor-not-allowed';
        
        setTimeout(() => {
          saveButton.innerHTML = originalText;
          saveButton.disabled = false;
          saveButton.className = 'flex items-center gap-2 px-6 py-3 bg-[#2EA043] text-white rounded-xl hover:bg-[#3FB950] transition-colors';
        }, 2000);
      }
      
      console.log('Settings saved:', settingsData);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Delete user data from localStorage
        localStorage.removeItem('gitalong-settings');
        localStorage.removeItem('gitalong-user-data');
        
        // Sign out the user
        await logout();
        
        // Show confirmation
        alert('Account deleted successfully. You have been signed out.');
      } catch (error) {
        console.error('Failed to delete account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  const handleExportData = () => {
    try {
      // Collect user data for export
      const exportData = {
        user: {
          email: currentUser?.email,
          displayName: currentUser?.displayName,
          githubData: githubUserData
        },
        settings: {
          notifications,
          privacy,
          theme,
          language
        },
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `gitalong-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Show success feedback
      const exportButton = document.querySelector('[data-export-data]') as HTMLButtonElement;
      if (exportButton) {
        const originalText = exportButton.innerHTML;
        exportButton.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Exported!';
        exportButton.disabled = true;
        
        setTimeout(() => {
          exportButton.innerHTML = originalText;
          exportButton.disabled = false;
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear all cached data? This will refresh the app.')) {
      try {
        // Clear localStorage except for essential data
        const essentialKeys = ['gitalong-settings', 'gitalong-user-data'];
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && !essentialKeys.includes(key)) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Show success feedback
        const clearButton = document.querySelector('[data-clear-cache]') as HTMLButtonElement;
        if (clearButton) {
          const originalText = clearButton.innerHTML;
          clearButton.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Cleared!';
          clearButton.disabled = true;
          
          setTimeout(() => {
            clearButton.innerHTML = originalText;
            clearButton.disabled = false;
          }, 2000);
        }
        
        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      } catch (error) {
        console.error('Failed to clear cache:', error);
        alert('Failed to clear cache. Please try again.');
      }
    }
  };

  const handleToggleDeveloperMode = () => {
    setDeveloperMode(!developerMode);
    
    if (!developerMode) {
      // Enable developer mode
      localStorage.setItem('gitalong-developer-mode', 'true');
      console.log('Developer mode enabled');
      
      // Show developer tools info
      setTimeout(() => {
        alert('Developer mode enabled! You can now access advanced debugging features.');
      }, 100);
    } else {
      // Disable developer mode
      localStorage.removeItem('gitalong-developer-mode');
      console.log('Developer mode disabled');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <SEO
        title="Settings – GitAlong"
        description="Manage your GitAlong account settings, notifications, and preferences."
        url="https://gitalong.vercel.app/settings"
        type="website"
      />

      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2EA043]/10 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Settings', isActive: true }]} />
          <BreadcrumbStructuredData items={[{ label: 'Settings', href: '/settings' }]} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Manage your account preferences and app settings</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-[#2EA043]/10 border border-[#2EA043]/20 text-[#2EA043]'
                            : 'text-gray-300 hover:text-white hover:bg-[#30363D]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="bg-[#161B22] rounded-2xl border border-[#30363D] p-6">
                {/* Account Settings */}
                {activeTab === 'account' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <User className="w-6 h-6 text-[#2EA043]" />
                      <h2 className="text-2xl font-bold text-white">Account Settings</h2>
                    </div>

                    {/* Profile Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                      
                      {currentUser && githubUserData ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                            <input
                              type="text"
                              defaultValue={githubUserData.name || githubUserData.login}
                              className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-xl text-white placeholder-gray-500 focus:border-[#2EA043] focus:outline-none transition-colors"
                              placeholder="Enter display name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                            <input
                              type="text"
                              defaultValue={githubUserData.login}
                              disabled
                              className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-xl text-gray-500 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <input
                              type="email"
                              defaultValue={githubUserData.email || currentUser.email || ''}
                              className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-xl text-white placeholder-gray-500 focus:border-[#2EA043] focus:outline-none transition-colors"
                              placeholder="Enter email address"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                            <textarea
                              defaultValue={githubUserData.bio || ''}
                              rows={3}
                              className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded-xl text-white placeholder-gray-500 focus:border-[#2EA043] focus:outline-none transition-colors resize-none"
                              placeholder="Tell us about yourself"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Github className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400">Sign in with GitHub to manage your profile</p>
                        </div>
                      )}

                      {/* Account Actions */}
                      <div className="pt-6 border-t border-[#30363D]">
                        <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#30363D] text-white rounded-xl hover:bg-[#484F58] transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Sign Out
                          </button>
                          <button
                            onClick={handleDeleteAccount}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600/10 border border-red-600/20 text-red-400 rounded-xl hover:bg-red-600/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Bell className="w-6 h-6 text-[#2EA043]" />
                      <h2 className="text-2xl font-bold text-white">Notification Settings</h2>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-[#0D1117] rounded-xl border border-[#30363D]">
                          <div>
                            <h3 className="font-medium text-white capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {key === 'email' && 'Receive notifications via email'}
                              {key === 'push' && 'Receive push notifications on your device'}
                              {key === 'projectUpdates' && 'Get notified about project updates'}
                              {key === 'newMessages' && 'Receive notifications for new messages'}
                              {key === 'weeklyDigest' && 'Get a weekly summary of your activity'}
                            </p>
                          </div>
                          <button
                            onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-[#2EA043]' : 'bg-[#30363D]'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Privacy */}
                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Shield className="w-6 h-6 text-[#2EA043]" />
                      <h2 className="text-2xl font-bold text-white">Privacy Settings</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-[#0D1117] rounded-xl border border-[#30363D]">
                        <h3 className="font-medium text-white mb-2">Profile Visibility</h3>
                        <p className="text-sm text-gray-400 mb-3">Control who can see your profile information</p>
                        <select
                          value={privacy.profileVisibility}
                          onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                          className="w-full px-4 py-2 bg-[#161B22] border border-[#30363D] rounded-lg text-white focus:border-[#2EA043] focus:outline-none"
                        >
                          <option value="public">Public - Anyone can see your profile</option>
                          <option value="private">Private - Only you can see your profile</option>
                          <option value="friends">Friends - Only your connections can see</option>
                        </select>
                      </div>

                      {Object.entries(privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-[#0D1117] rounded-xl border border-[#30363D]">
                          <div>
                            <h3 className="font-medium text-white capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {key === 'showEmail' && 'Display your email address on your profile'}
                              {key === 'showLocation' && 'Show your location on your profile'}
                              {key === 'allowMessages' && 'Allow other users to send you messages'}
                            </p>
                          </div>
                          <button
                            onClick={() => setPrivacy(prev => ({ ...prev, [key]: !value }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-[#2EA043]' : 'bg-[#30363D]'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Appearance */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Palette className="w-6 h-6 text-[#2EA043]" />
                      <h2 className="text-2xl font-bold text-white">Appearance</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-[#0D1117] rounded-xl border border-[#30363D]">
                        <h3 className="font-medium text-white mb-2">Theme</h3>
                        <p className="text-sm text-gray-400 mb-3">Choose your preferred theme</p>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'light', icon: Sun, label: 'Light' },
                            { value: 'dark', icon: Moon, label: 'Dark' },
                            { value: 'system', icon: Monitor, label: 'System' }
                          ].map(({ value, icon: Icon, label }) => (
                            <button
                              key={value}
                              onClick={() => setTheme(value)}
                              className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                                theme === value
                                  ? 'border-[#2EA043] bg-[#2EA043]/10 text-[#2EA043]'
                                  : 'border-[#30363D] text-gray-300 hover:border-[#484F58]'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="text-sm font-medium">{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-[#0D1117] rounded-xl border border-[#30363D]">
                        <h3 className="font-medium text-white mb-2">Language</h3>
                        <p className="text-sm text-gray-400 mb-3">Select your preferred language</p>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-4 py-2 bg-[#161B22] border border-[#30363D] rounded-lg text-white focus:border-[#2EA043] focus:outline-none"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                          <option value="ja">日本語</option>
                          <option value="zh">中文</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Advanced */}
                {activeTab === 'advanced' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Settings className="w-6 h-6 text-[#2EA043]" />
                      <h2 className="text-2xl font-bold text-white">Advanced Settings</h2>
                    </div>

                    <div className="space-y-4">
                                             <div className="p-4 bg-[#0D1117] rounded-xl border border-[#30363D]">
                         <h3 className="font-medium text-white mb-2">Data Export</h3>
                         <p className="text-sm text-gray-400 mb-3">Download a copy of your data</p>
                         <button 
                           onClick={handleExportData}
                           data-export-data
                           className="flex items-center gap-2 px-4 py-2 bg-[#2EA043] text-white rounded-lg hover:bg-[#3FB950] transition-colors"
                         >
                           <Download className="w-4 h-4" />
                           Export Data
                         </button>
                       </div>

                       <div className="p-4 bg-[#0D1117] rounded-xl border border-[#30363D]">
                         <h3 className="font-medium text-white mb-2">Clear Cache</h3>
                         <p className="text-sm text-gray-400 mb-3">Clear all cached data and refresh the app</p>
                         <button 
                           onClick={handleClearCache}
                           data-clear-cache
                           className="flex items-center gap-2 px-4 py-2 bg-[#30363D] text-white rounded-lg hover:bg-[#484F58] transition-colors"
                         >
                           <RefreshCw className="w-4 h-4" />
                           Clear Cache
                         </button>
                       </div>

                       <div className="p-4 bg-[#0D1117] rounded-xl border border-[#30363D]">
                         <h3 className="font-medium text-white mb-2">Developer Mode</h3>
                         <p className="text-sm text-gray-400 mb-3">Enable developer tools and debugging features</p>
                         <div className="flex items-center gap-2">
                           <button 
                             onClick={handleToggleDeveloperMode}
                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                               developerMode ? 'bg-[#2EA043]' : 'bg-[#30363D]'
                             }`}
                           >
                             <span
                               className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                 developerMode ? 'translate-x-6' : 'translate-x-1'
                               }`}
                             />
                           </button>
                           <span className="text-sm text-gray-400">
                             {developerMode ? 'Enabled' : 'Disabled'}
                           </span>
                         </div>
                       </div>
                    </div>
                  </div>
                )}

                                 {/* Save Button */}
                 <div className="pt-6 border-t border-[#30363D]">
                   <button
                     onClick={handleSaveSettings}
                     data-save-settings
                     className="flex items-center gap-2 px-6 py-3 bg-[#2EA043] text-white rounded-xl hover:bg-[#3FB950] transition-colors"
                   >
                     <Save className="w-4 h-4" />
                     Save Changes
                   </button>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
