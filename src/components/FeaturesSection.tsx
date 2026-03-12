import React from 'react';
import { Sparkles, GitBranch, MessageCircle, Heart, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export const FeaturesSection: React.FC = () => {
	const features = [
		{ 
      icon: Heart, 
      title: 'Swipe & Match', 
      description: 'Swipe right to connect with developers who share your interests and tech stack.' 
    },
		{ 
      icon: GitBranch, 
      title: 'GitHub Core', 
      description: 'Sign in with GitHub. Your profile and stats are automatically synced for matching.' 
    },
		{ 
      icon: MessageCircle, 
      title: 'Real-time Chat', 
      description: 'Connect instantly with your matches through our Supabase-powered real-time chat.' 
    },
    { 
      icon: Zap, 
      title: 'Fast Discovery', 
      description: 'A recommendation engine that understands your code and finds perfect teammates.' 
    },
    { 
      icon: Sparkles, 
      title: 'Super Likes', 
      description: 'Stand out from the crowd. Let someone know you really want to collaborate.' 
    },
    { 
      icon: Globe, 
      title: 'Global Network', 
      description: 'Connect with developers from all over the world, across any language or framework.' 
    },
	];

	return (
		<section id="features" className="py-24 bg-[#0D1117]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4"
          >
            Built for the modern developer
          </motion.h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            Everything you need to find your next co-founder, side-project partner, or open-source collaborator.
          </p>
        </div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, i) => {
						const Icon = feature.icon;
						return (
							<motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 bg-[#161B22] rounded-3xl border border-[#30363D] hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/5"
              >
								<div className="inline-flex items-center justify-center w-14 h-14 bg-green-500/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
									<Icon className="w-7 h-7 text-green-500" />
								</div>
								<h3 className="text-xl font-black text-white mb-3 tracking-tight">{feature.title}</h3>
								<p className="text-gray-400 leading-relaxed font-medium">{feature.description}</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default FeaturesSection;
