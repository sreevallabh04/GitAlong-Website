import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Activity, Settings2 } from 'lucide-react';

const items = [
  { to: '/app/discover', label: 'Discover', icon: Compass },
  { to: '/app/activity', label: 'Activity', icon: Activity },
  { to: '/app/settings', label: 'Settings', icon: Settings2 },
];

export const AppSidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r border-[#30363D] bg-[#0D1117]">
      <div className="px-5 py-5 border-b border-[#30363D]">
        <h2 className="text-lg font-bold text-white tracking-tight">GitAlong App</h2>
        <p className="text-xs text-gray-400 mt-1">Match, collaborate, build.</p>
      </div>
      <nav className="p-3 space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-500/15 text-green-300 border border-green-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-[#161B22]'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

