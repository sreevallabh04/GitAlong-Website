import React from 'react';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-[#0D1117] border-t border-[#30363D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-[#2EA043] bg-clip-text text-transparent">What We Built</h2>
          <span className="text-xs md:text-sm text-[#2EA043] bg-[#2EA043]/10 border border-[#2EA043]/20 rounded-full px-3 py-1">Designed for collaboration</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#0F1420] rounded-2xl border border-[#30363D] hover:border-[#2EA043]/40 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-white">Smart Matching</h3>
            <p className="text-gray-400">We connect you with developers who complement your skills and interests.</p>
          </div>
          <div className="p-6 bg-[#0F1420] rounded-2xl border border-[#30363D] hover:border-[#2EA043]/40 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-white">Project Discovery</h3>
            <p className="text-gray-400">Explore open-source projects and join the right ones in a click.</p>
          </div>
          <div className="p-6 bg-[#0F1420] rounded-2xl border border-[#30363D] hover:border-[#2EA043]/40 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-white">Collaboration Tools</h3>
            <p className="text-gray-400">Coordinate with lightweight chat, tasks, and shared context.</p>
          </div>
        </div>
      </div>
    </section>
  );
};


