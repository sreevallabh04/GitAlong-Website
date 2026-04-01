import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Activity, Settings2 } from 'lucide-react';

const items = [
  { to: '/app/discover', label: 'Discover', icon: Compass },
  { to: '/app/activity', label: 'Activity', icon: Activity },
  { to: '/app/settings', label: 'Settings', icon: Settings2 },
];

export const AppBottomNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[#30363D] bg-[#0D1117]/95 backdrop-blur">
      <div className="grid grid-cols-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2 ${
                isActive ? 'text-green-300' : 'text-gray-400'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[11px]">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

