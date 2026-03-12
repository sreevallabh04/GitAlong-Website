import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export const Footer: React.FC = () => {
  const handleDownloadApp = () => {
    toast('The app is not ready to be published yet. Check back in a few months.', {
      icon: '🚧',
    });
  };

  return (
    <footer className="bg-[#0D1117] border-t border-[#30363D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 text-white hover:text-green-500 transition-all duration-300 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center font-black text-black">
                GA
              </div>
              <span className="text-2xl font-black">GitAlong</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              We are building the future of collaborative coding. Find your perfect GitHub match and build amazing projects together.
            </p>
            <button
              onClick={handleDownloadApp}
              className="inline-flex items-center px-6 py-3 bg-green-500 text-black font-black rounded-xl hover:bg-green-400 transition-all duration-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Download App
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-green-500 transition-colors duration-300 font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-green-500 transition-colors duration-300 font-medium">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-green-500 transition-colors duration-300 font-medium">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-green-500 transition-colors duration-300 font-medium">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/sreevallabh04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-green-500 transition-colors duration-300 font-medium"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/gothamjest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-green-500 transition-colors duration-300 font-medium"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/sreevallabh-kakarala-52ab8a248/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-green-500 transition-colors duration-300 font-medium"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="mailto:srivallabhkakarala@gmail.com"
                  className="flex items-center text-gray-400 hover:text-green-500 transition-colors duration-300 font-medium"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#30363D] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 GitAlong. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Available on</span>
            <div className="flex space-x-2">
              <button
                onClick={() => window.open('https://apps.apple.com/app/GitAlong', '_blank')}
                className="text-gray-400 hover:text-green-500 transition-colors duration-300 text-sm font-medium"
              >
                App Store
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={() => window.open('https://play.google.com/store/apps/details?id=com.GitAlong.app', '_blank')}
                className="text-gray-400 hover:text-green-500 transition-colors duration-300 text-sm font-medium"
              >
                Google Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 
