import React from 'react';
import { Brain, GitBranch, MessageCircle } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
	const features = [
		{ icon: Brain, title: 'AI-Powered Matching', description: 'Smart matching based on your GitHub activity and skills.' },
		{ icon: GitBranch, title: 'Project Discovery', description: 'Find projects that fit your interests and experience.' },
		{ icon: MessageCircle, title: 'Built-in Chat', description: 'Discuss ideas and plan contributions with collaborators.' },
	];

	return (
		<section id="features" className="py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-3xl font-bold text-white mb-8">Key Features</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{features.map((f, i) => {
						const Icon = f.icon;
						return (
							<div key={i} className="p-6 bg-[#0D1117] rounded-lg border border-[#30363D]">
								<div className="inline-flex items-center justify-center w-12 h-12 bg-[#2EA043] rounded-md mb-4">
									<Icon className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-lg font-semibold text-white">{f.title}</h3>
								<p className="text-gray-300 mt-2">{f.description}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default FeaturesSection;
