import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ShieldCheck, Github, Users, Bot } from 'lucide-react';
import { SEO } from '../components/SEO';

export const FAQPage: React.FC = () => {
	const faqs = [
		{
			question: 'What is GitAlong?',
			answer:
				'GitAlong helps developers discover collaborators and projects through GitHub signals and community profiles. We focus on authentic connections for building real software together.',
		},
		{
			question: 'How does sign in work?',
			answer:
				'We use GitHub OAuth for authentication. You authorize via GitHub and can revoke access anytime from your GitHub settings.',
		},
		{
			question: 'What data do you use?',
			answer:
				'Primarily your public GitHub profile and repository metadata. We do not store your GitHub credentials.',
		},
		{
			question: 'Is it free?',
			answer:
				'Yes. The core experience is free while we iterate with the community.',
		},
		{
			question: 'Is there a mobile app?',
			answer:
				'We are preparing a mobile experience and are launching on Google Play soon.',
		},
	];

	return (
		<div className="min-h-screen">
			<SEO
				title="GitAlong – Frequently Asked Questions"
				description="Answers about GitAlong: authentication, data usage, pricing, and the upcoming mobile launch."
				url="https://gitalong.vercel.app/faq"
				type="article"
			/>

			<section className="relative overflow-hidden">
				{/* Background gradient */}
				<div className="absolute inset-0 bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#0D1117]" />
				<div className="absolute inset-0 bg-gradient-to-tr from-[#2EA043]/10 to-transparent" />

				<div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-center mb-14"
					>
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2EA043]/10 border border-[#2EA043]/20 text-[#2EA043] text-sm font-medium mb-5">
							<HelpCircle className="w-4 h-4" />
							Help & FAQs
						</div>
						<h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-100 to-[#2EA043] bg-clip-text text-transparent leading-tight">
							Everything you need to know
						</h1>
						<p className="text-gray-300 text-lg md:text-xl mt-4 max-w-3xl mx-auto">
							Clear answers about how we work, our approach to data, and what’s next.
						</p>
					</motion.div>

					{/* FAQ Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{faqs.map((item, idx) => (
							<motion.div
								key={item.question}
								initial={{ opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: '-50px' }}
								transition={{ duration: 0.5, delay: idx * 0.05 }}
								className="group p-6 rounded-2xl bg-[#0F1420] border border-[#30363D] hover:border-[#2EA043]/40 hover:shadow-xl hover:shadow-[#2EA043]/5 transition-all"
							>
								<h3 className="text-white text-xl font-semibold mb-2">
									{item.question}
								</h3>
								<p className="text-gray-300 leading-relaxed">
									{item.answer}
								</p>
							</motion.div>
						))}
					</div>

					{/* Bottom Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
						<div className="p-6 rounded-2xl bg-[#0F1420] border border-[#30363D]">
							<div className="flex items-center gap-3 text-white font-semibold mb-2">
								<Github className="w-5 h-5 text-[#2EA043]" />
								GitHub Sign In
							</div>
							<p className="text-gray-400 text-sm">Authenticate with GitHub OAuth. Manage access in your GitHub account.</p>
						</div>
						<div className="p-6 rounded-2xl bg-[#0F1420] border border-[#30363D]">
							<div className="flex items-center gap-3 text-white font-semibold mb-2">
								<ShieldCheck className="w-5 h-5 text-[#2EA043]" />
								Your Data, Your Control
							</div>
							<p className="text-gray-400 text-sm">We use public profile data and repo metadata. No GitHub credentials stored.</p>
						</div>
						<div className="p-6 rounded-2xl bg-[#0F1420] border border-[#30363D]">
							<div className="flex items-center gap-3 text-white font-semibold mb-2">
								<Users className="w-5 h-5 text-[#2EA043]" />
								Built With The Community
							</div>
							<p className="text-gray-400 text-sm">We’re iterating in public with real developer feedback.</p>
						</div>
					</div>

					{/* Subtle banner */}
					<div className="mt-12 rounded-2xl border border-[#30363D] bg-[#0F1420] p-6 text-gray-300 flex items-center gap-3">
						<Bot className="w-5 h-5 text-[#2EA043]" />
						<span>Launching on Google Play soon. Follow updates on our GitHub.</span>
					</div>
				</div>
			</section>
		</div>
	);
};
