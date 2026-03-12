import React from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowRight, Zap, Code, Smartphone } from 'lucide-react';

interface CTASectionProps {
  onDownload: () => void;
  onLearnMore?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onDownload, onLearnMore }) => {
  return (
    <section className="py-24 bg-[#0D1117] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(46,204,113,0.05),transparent_50%)]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold uppercase tracking-widest">
            <Smartphone className="h-4 w-4 mr-2" />
            Coming soon to iOS & Android
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-4xl md:text-7xl font-black mb-6 text-white tracking-tight"
        >
          Ready to find your
          <br />
          <span className="text-green-500">Perfect Match?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-medium"
        >
          Join the community of developers who believe that great software is built together. 
          Swipe, match, and start building.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.button
            onClick={onDownload}
            className="group px-10 py-5 bg-green-500 text-black font-black rounded-2xl text-xl shadow-[0_0_30px_rgba(46,204,113,0.2)] hover:shadow-[0_0_40px_rgba(46,204,113,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center"
          >
            <Download className="h-6 w-6 mr-3" />
            Get GitAlong
            <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.button 
            onClick={onLearnMore}
            className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl text-xl hover:bg-white/10 transition-all duration-300"
          >
            See Demo
          </motion.button>
        </motion.div>

        {/* Feature Grid/Trust */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/5"
        >
          <div className="flex flex-col items-center">
            <Code className="h-6 w-6 text-green-500 mb-2" />
            <span className="text-gray-400 font-bold">100% Free</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="h-6 w-6 text-green-500 mb-2" />
            <span className="text-gray-400 font-bold">Open Source</span>
          </div>
          <div className="flex flex-col items-center">
            <Smartphone className="h-6 w-6 text-green-500 mb-2" />
            <span className="text-gray-400 font-bold">Cross Platform</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="h-6 w-6 text-green-500 mb-2" />
            <span className="text-gray-400 font-bold">Privacy First</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-green-500/5 blur-[150px] pointer-events-none"></div>
    </section>
  );
};
