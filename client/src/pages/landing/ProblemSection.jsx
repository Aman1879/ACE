import React from 'react';
import { Layers, FileSpreadsheet, Github, Code, Award, FolderKanban, ArrowRight } from 'lucide-react';

export default function ProblemSection() {
  const problems = [
    {
      icon: Github,
      title: 'Projects on GitHub',
      desc: 'Repositories with no context, metrics, or recruiter-friendly presentation.',
      color: 'text-gray-900',
      bg: 'bg-gray-100',
    },
    {
      icon: Code,
      title: 'Coding on LeetCode & GFG',
      desc: 'Scattered contest ratings and problem counts across multiple platforms.',
      color: 'text-[#FF6B00]',
      bg: 'bg-[#FFF1E6]',
    },
    {
      icon: Award,
      title: 'Certificates in Google Drive',
      desc: 'PDFs buried in folders with no verifiable proofs or categorization.',
      color: 'text-[#57C76F]',
      bg: 'bg-[#F3FBF3]',
    },
    {
      icon: FileSpreadsheet,
      title: 'Internships in Spreadsheets',
      desc: 'Clunky Excel sheets to manually record job applications and interview status.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: FolderKanban,
      title: 'Resumes in Canva or Word',
      desc: 'Static documents that must be re-edited constantly for every application.',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: Layers,
      title: 'Zero Unified Profile',
      desc: 'No single link to show recruiters the complete depth of your achievements.',
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            The Student Dilemma
          </span>
          <h2 className="section-title mt-2">
            Why is Student Career Information Scattered Everywhere?
          </h2>
          <p className="section-subtitle">
            Students currently juggle 6 to 8 different disconnected tools to manage their academic
            journey, losing opportunities and proof of growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-[#EAEAEA] bg-[#FFFDF8] hover:border-[#FF6B00]/40 hover:shadow-card transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#1B1B1B] mb-2">{item.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Central ACE Bridge Callout */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-[#FFF1E6] via-white to-[#F3FBF3] border border-[#EAEAEA] text-center max-w-4xl mx-auto">
          <h4 className="text-xl font-bold text-[#1B1B1B] mb-2">
            ACE Connects Every Dot into a Single Digital Identity
          </h4>
          <p className="text-sm text-[#6B7280] mb-4 max-w-2xl mx-auto">
            MANAGE projects and certificates → TRACK coding and applications → IMPROVE with daily
            goals and streaks → SHOWCASE with a public portfolio → GROW into your dream career.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF6B00]">
            <span>MANAGE</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>TRACK</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>IMPROVE</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>SHOWCASE</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>GROW</span>
          </div>
        </div>
      </div>
    </section>
  );
}

