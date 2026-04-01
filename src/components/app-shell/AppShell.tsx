import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';
import { AppBottomNav } from './AppBottomNav';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 min-w-0">
          <AppTopbar />
          <main className="pb-20 md:pb-6">
            <Outlet />
          </main>
        </div>
      </div>
      <AppBottomNav />
    </div>
  );
};

