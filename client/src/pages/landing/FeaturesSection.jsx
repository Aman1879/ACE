import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Award,
  Trophy,
  Code2,
  FileText,
  Globe,
  Briefcase,
  Target,
  CheckSquare,
  Flame,
  ShoppingBag,
  BarChart3,
  StickyNote,
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: LayoutDashboard,
      title: '1. Student Dashboard',
      desc: 'Central command center with stats, streaks, XP progress, and active goals.',
      bg: 'bg-[#FFF1E6]',
      color: 'text-[#FF6B00]',
    },
    {
      icon: FolderGit2,
      title: '2. Project Management',
      desc: 'Log tech stack, live URLs, GitHub repos, project status, and key achievements.',
      bg: 'bg-[#F3FBF3]',
      color: 'text-[#57C76F]',
    },
    {
      icon: Award,
      title: '3. Certificate Vault',
      desc: 'Store credentials, issuing bodies, expiry dates, and verifiable PDF documents.',
      bg: 'bg-blue-50',
      color: 'text-blue-600',
    },
    {
      icon: Trophy,
      title: '4. Achievement Tracker',
      desc: 'Document hackathons, scholarships, awards, and sports milestones in a timeline.',
      bg: 'bg-amber-50',
      color: 'text-amber-600',
    },
    {
      icon: Code2,
      title: '5. Coding Tracker',
      desc: 'Track problems solved across LeetCode, GFG, HackerRank with visual difficulty charts.',
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
    {
      icon: FileText,
      title: '6. Resume Builder',
      desc: 'Create ATS-friendly resumes with live preview and multi-template support.',
      bg: 'bg-rose-50',
      color: 'text-rose-600',
    },
    {
      icon: Globe,
      title: '7. Public Portfolio',
      desc: 'Shareable unique URL (ace.com/u/username) to present to recruiters anytime.',
      bg: 'bg-[#FFF1E6]',
      color: 'text-[#FF6B00]',
    },
    {
      icon: Briefcase,
      title: '8. Internship Tracker',
      desc: 'Manage roles, company details, tenures, stipends, and work proofs.',
      bg: 'bg-[#F3FBF3]',
      color: 'text-[#57C76F]',
    },
    {
      icon: Target,
      title: '9. Placement Tracker',
      desc: 'Job application pipeline with status stages, interview dates, and CTC details.',
      bg: 'bg-indigo-50',
      color: 'text-indigo-600',
    },
    {
      icon: CheckSquare,
      title: '10. Goals & Tasks',
      desc: 'Set daily, weekly, and long-term milestones with automatic XP rewards on completion.',
      bg: 'bg-emerald-50',
      color: 'text-emerald-600',
    },
    {
      icon: Flame,
      title: '11. XP & Streaks',
      desc: 'Consecutive activity tracking with 50, 100, 200, and 400-day milestone badges.',
      bg: 'bg-orange-50',
      color: 'text-orange-600',
    },
    {
      icon: ShoppingBag,
      title: '12. ACE Store & Tokens',
      desc: 'Earn proprietary ACE tokens and redeem for merchandise, subscriptions, and themes.',
      bg: 'bg-[#FFF1E6]',
      color: 'text-[#FF6B00]',
    },
    {
      icon: BarChart3,
      title: '13. Leaderboard',
      desc: 'Friendly, inspiring rankings across XP, streaks, and public accomplishments.',
      bg: 'bg-[#F3FBF3]',
      color: 'text-[#57C76F]',
    },
    {
      icon: StickyNote,
      title: '14. Career Notes & Analytics',
      desc: 'Private notebook for interview prep, revision snippets, and technical learnings.',
      bg: 'bg-teal-50',
      color: 'text-teal-600',
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#57C76F]">
            Complete Platform Capabilities
          </span>
          <h2 className="section-title mt-2">14 Core Modules Built for Student Growth</h2>
          <p className="section-subtitle">
            Every feature is purposefully designed to make managing your academic and career
            journey effortless and rewarding.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-4 shadow-xs`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#1B1B1B] mb-2">{f.title}</h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

