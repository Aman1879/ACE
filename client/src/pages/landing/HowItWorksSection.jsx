import React from 'react';
import { UserCheck, FileEdit, Award, LineChart, Gift, FileCode, Share2 } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      icon: UserCheck,
      title: 'Register Account',
      desc: 'Create your free student account with college & branch details in under 2 minutes.',
    },
    {
      num: '02',
      icon: FileEdit,
      title: 'Complete Profile',
      desc: 'Fill your bio, social links, key technical skills, and academic timeline.',
    },
    {
      num: '03',
      icon: Award,
      title: 'Add Achievements',
      desc: 'Upload your projects, certificates, hackathon honors, and internships.',
    },
    {
      num: '04',
      icon: LineChart,
      title: 'Track Daily Progress',
      desc: 'Set goals, track coding platform stats, and maintain your daily streak.',
    },
    {
      num: '05',
      icon: Gift,
      title: 'Earn XP & Tokens',
      desc: 'Level up across 20 ranks and accumulate ACE tokens to redeem rewards.',
    },
    {
      num: '06',
      icon: FileCode,
      title: 'Build ATS Resume',
      desc: 'Generate professional, ATS-optimized resumes with 1-click template switching.',
    },
    {
      num: '07',
      icon: Share2,
      title: 'Showcase to Recruiters',
      desc: 'Share your public portfolio link directly with recruiters and on LinkedIn.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white border-y border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            The Journey
          </span>
          <h2 className="section-title mt-2">How ACE Powers Your Growth</h2>
          <p className="section-subtitle">
            A seamless path from scattered student records to a unified, recruiter-ready profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-[#FFFDF8] border border-[#EAEAEA] hover:border-[#57C76F] hover:shadow-card transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F3FBF3] text-[#57C76F] flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-[#FF6B00] bg-[#FFF1E6] px-2.5 py-1 rounded-full">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1B1B1B] mb-2">{step.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

