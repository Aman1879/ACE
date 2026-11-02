import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1B1B1B] text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#FF6B00] flex items-center justify-center font-extrabold text-white text-lg">
                A
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">ACE</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your Academic & Career Journey, One Platform. An integrated student growth and career development ecosystem.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#57C76F]" />
              SDG 4, 8 & 9 Aligned
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/register" className="hover:text-white transition-colors">Student Dashboard</Link></li>
              <li><a href="#features" className="hover:text-white transition-colors">Projects & Skills</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Coding Tracker</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Resume Builder</a></li>
              <li><a href="#store" className="hover:text-white transition-colors">ACE Store & Rewards</a></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#gamification" className="hover:text-white transition-colors">XP & Streak System</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Public Portfolio</a></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Student Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Join as Student</Link></li>
            </ul>
          </div>

          {/* Col 4: Project Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Project Details</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="text-gray-300 font-medium">Group ID:</span> 52</li>
              <li><span className="text-gray-300 font-medium">Domain:</span> EdTech & Career</li>
              <li><span className="text-gray-300 font-medium">TRL:</span> Level 3 Proof of Concept</li>
              <li><span className="text-gray-300 font-medium">Tagline:</span> Manage · Track · Grow</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} ACE – Academic & Career Engine. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed for students with <Heart className="w-3.5 h-3.5 text-[#FF6B00] fill-[#FF6B00]" />
          </p>
        </div>
      </div>
    </footer>
  );
}

