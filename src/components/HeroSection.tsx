import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Users, Zap, Code, GitBranch, Smartphone, Sparkles } from 'lucide-react';
import AppIcon from '../assets/app_icon.jpg';

interface HeroSectionProps {
  onGetStarted: () => void;
  onLearnMore?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onLearnMore }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#0D1117]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(46,204,113,0.1),transparent_50%)]"></div>
      
      {/* Animated Orbiting Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-green-500 rounded-full opacity-30"
            animate={{
              x: [Math.cos(i * 60) * 200, Math.cos(i * 60 + 360) * 200],
              y: [Math.sin(i * 60) * 200, Math.sin(i * 60 + 360) * 200],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              className="absolute inset-0 bg-green-500/20 blur-2xl rounded-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <img 
              src={AppIcon} 
              alt="GitAlong Logo" 
              className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl shadow-2xl border-2 border-green-500/30"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs sm:text-sm font-bold tracking-wider uppercase">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2 inline" />
              Tinder for Developers
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
            Swipe. Match.
            <br />
            <span className="text-green-500 drop-shadow-[0_0_15px_rgba(46,204,113,0.3)]">Collaborate.</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            Discover amazing developers who share your tech interests. 
            Sign in with GitHub, swipe right to connect, and build the future together.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <button
            onClick={onGetStarted}
            className="group w-full sm:w-auto px-10 py-5 bg-green-500 hover:bg-green-400 text-black font-black rounded-2xl text-lg sm:text-xl shadow-[0_0_30px_rgba(46,204,113,0.3)] hover:shadow-[0_0_40px_rgba(46,204,113,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            Start Swiping
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={onLearnMore}
            className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl text-lg sm:text-xl transition-all duration-300 backdrop-blur-sm"
          >
            How it Works
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto pt-8 border-t border-white/5"
        >
          {[
            { icon: GitBranch, label: "GitHub OAuth", desc: "One-tap secure login" },
            { icon: Zap, label: "Real-time Chat", desc: "Powered by Supabase" },
            { icon: Smartphone, label: "Flutter App", desc: "Beautifully responsive" },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-green-500/10 transition-colors">
                <feature.icon className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-white font-bold mb-1">{feature.label}</h3>
              <p className="text-gray-500 text-sm whitespace-nowrap">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating Blobs */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/5 blur-[120px] rounded-full pointer-events-none"></div>
    </section>
  );
}; 
