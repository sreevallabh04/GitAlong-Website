import React from 'react';
import { useLocation } from 'react-router-dom';
import { UserMenu } from '../UserMenu';

const titleMap: Record<string, string> = {
  '/app/discover': 'Discover',
  '/app/activity': 'Activity',
  '/app/settings': 'Settings',
};

export const AppTopbar: React.FC = () => {
  const location = useLocation();
  const title = titleMap[location.pathname] || 'App';

  return (
    <header className="sticky top-0 z-20 border-b border-[#30363D] bg-[#0D1117]/95 backdrop-blur">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-white">{title}</h1>
          <p className="text-[11px] text-gray-400">Modern collaborative matching workspace</p>
        </div>
        <UserMenu />
      </div>
    </header>
  );
};

