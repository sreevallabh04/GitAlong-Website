import React from 'react';

// FAQ component for better SEO and user experience
export const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "What is GitAlong?",
      answer: "GitAlong is a platform that connects developers who want to collaborate on coding projects. We help you find the perfect coding partner based on your skills, interests, and project goals."
    },
    {
      question: "How do I find coding partners on GitAlong?",
      answer: "After signing in with your GitHub account, you can browse developer profiles, view their repositories, and connect with those who share similar coding interests and skill levels."
    },
    {
      question: "How does GitAlong match developers?",
      answer: "GitAlong uses GitHub integration to analyze your coding style, preferred languages, and project history to suggest compatible developers for collaboration."
    },
    {
      question: "What programming languages and technologies are supported?",
      answer: "GitAlong supports all programming languages and technologies. Our platform integrates with GitHub, so any language or framework you use in your repositories is automatically supported."
    },
    {
      question: "How does GitHub integration work?",
      answer: "We use GitHub OAuth for secure authentication and pull your repository data to showcase your coding style, preferred languages, and project experience to potential collaborators."
    },
    {
      question: "Can I collaborate on both open source and private projects?",
      answer: "Yes! GitAlong facilitates connections for all types of coding projects, whether they're open source contributions, personal projects, or professional collaborations."
    },
    {
      question: "How do I ensure good collaboration with my coding partner?",
      answer: "We recommend starting with smaller projects to build trust, establishing clear communication channels, setting up shared development environments, and defining project goals and timelines together."
    },
    {
      question: "Is my data secure on GitAlong?",
      answer: "Absolutely. We only access publicly available GitHub information and use industry-standard security practices. We never store your GitHub credentials and only access the data you explicitly authorize."
    }
  ];

  return (
    <section className="py-20 bg-[#161B22]" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300">
            Everything you need to know about GitAlong and developer collaboration
          </p>
        </div>
        
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[#0D1117] rounded-2xl p-6 border border-[#30363D]">
              <h3 className="text-xl font-semibold text-white mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Benefits section for better SEO content
export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      title: "Accelerated Learning",
      description: "Learn faster by coding with experienced developers who can share knowledge, best practices, and real-world insights.",
      keywords: "developer learning, coding mentorship, programming skills"
    },
    {
      title: "Network Building",
      description: "Build meaningful professional relationships in the tech industry while working on projects together.",
      keywords: "developer networking, tech connections, professional relationships"
    },
    {
      title: "Project Completion",
      description: "Turn your ideas into reality with the help of motivated collaborators who share your vision and commitment.",
      keywords: "project collaboration, software development, team coding"
    },
    {
      title: "Skill Diversification",
      description: "Work with developers from different backgrounds to expand your technical skills and learn new technologies.",
      keywords: "skill development, technology learning, programming growth"
    },
    {
      title: "Open Source Contribution",
      description: "Contribute to open source projects more effectively with partners who can help you navigate complex codebases.",
      keywords: "open source, community contribution, collaborative development"
    },
    {
      title: "Career Growth",
      description: "Enhance your portfolio with collaborative projects that demonstrate your ability to work in team environments.",
      keywords: "career development, portfolio building, teamwork skills"
    }
  ];

  return (
    <section className="py-20 bg-[#0D1117]" id="benefits">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose Collaborative Coding?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the transformative benefits of finding your perfect coding partner through GitAlong
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-[#161B22] rounded-2xl p-6 border border-[#30363D] hover:border-[#2EA043]/50 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                {benefit.description}
              </p>
              <div className="text-xs text-[#2EA043] opacity-70">
                Related: {benefit.keywords}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
