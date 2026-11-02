import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Trophy, Star, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#F3FBF3] rounded-full blur-3xl -z-10 opacity-70" />
      <div className="absolute top-1/3 -left-20 w-96 h-96 bg-[#FFF1E6] rounded-full blur-3xl -z-10 opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF1E6] border border-[#FFD9B3] text-xs font-bold text-[#FF6B00] shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>All-in-One Student Academic & Career Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="heading-xl text-[#1B1B1B] font-extrabold tracking-tight">
              Everything a Student Needs.{' '}
              <span className="text-gradient-orange">All in One Place.</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed max-w-2xl mx-auto lg:mx-0">
              ACE brings your academic achievements, projects, certificates, coding progress,
              internships, resumes, skills, and placement activities into one intelligent, unified
              ecosystem.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/register" className="btn-primary btn-lg w-full sm:w-auto shadow-orange">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
              <Link to="/login" className="btn-secondary btn-lg w-full sm:w-auto">
                Explore Dashboard
              </Link>
            </div>

            {/* Trust Note */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#6B7280]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#57C76F]" />
                <span className="font-semibold text-[#1B1B1B]">100% Free for Students</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#57C76F]" />
                <span className="font-semibold text-[#1B1B1B]">Public Shareable Portfolio</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product Illustration */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Main Mockup Card */}
            <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAEAEA] shadow-2xl p-6 relative z-10">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA] mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#57C76F] text-white flex items-center justify-center font-bold">
                    A
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1B1B1B]">Student Dashboard</h4>
                    <p className="text-[11px] text-[#6B7280]">Aman Kumar · CS Engineering</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#F3FBF3] text-[#57C76F] text-xs font-bold">
                  Active
                </span>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="p-3 bg-[#FFF1E6] rounded-2xl text-center">
                  <div className="flex items-center justify-center gap-1 text-[#FF6B00] mb-0.5">
                    <Flame className="w-4 h-4 fill-[#FF6B00]" />
                    <span className="text-base font-extrabold">27</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase">Day Streak</span>
                </div>

                <div className="p-3 bg-[#F3FBF3] rounded-2xl text-center">
                  <div className="flex items-center justify-center gap-1 text-[#57C76F] mb-0.5">
                    <Star className="w-4 h-4 fill-[#57C76F]" />
                    <span className="text-base font-extrabold">Lvl 8</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase">Developer</span>
                </div>

                <div className="p-3 bg-[#EFF6FF] rounded-2xl text-center">
                  <div className="flex items-center justify-center gap-1 text-[#2563EB] mb-0.5">
                    <Trophy className="w-4 h-4" />
                    <span className="text-base font-extrabold">1,450</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase">Total XP</span>
                </div>
              </div>

              {/* Mini Activity Chart Mock */}
              <div className="bg-[#FFFDF8] border border-[#EAEAEA] rounded-2xl p-4 mb-5">
                <div className="flex justify-between items-center text-xs font-bold mb-3">
                  <span className="text-[#1B1B1B]">Weekly Coding & Activity</span>
                  <span className="text-[#57C76F]">+24% growth</span>
                </div>
                <div className="flex items-end justify-between gap-2 h-20 pt-2">
                  {[45, 75, 60, 90, 80, 100, 85].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t-lg transition-all ${
                          i === 5 ? 'bg-[#FF6B00]' : 'bg-[#57C76F]'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-[9px] text-[#6B7280]">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Accomplishments */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                    <span className="font-semibold text-[#1B1B1B]">Smart AI Resume Generator</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#57C76F]">+30 XP</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#57C76F]" />
                    <span className="font-semibold text-[#1B1B1B]">AWS Cloud Practitioner Cert</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#57C76F]">+25 XP</span>
                </div>
              </div>
            </div>

            {/* Floating Floating Decorative Chips */}
            <div className="absolute -top-4 -left-6 z-20 bg-white shadow-xl rounded-2xl border border-[#EAEAEA] px-4 py-2.5 flex items-center gap-2.5 animate-bounce-slow">
              <div className="w-8 h-8 rounded-xl bg-[#FFF1E6] text-[#FF6B00] flex items-center justify-center font-bold">
                🔥
              </div>
              <div>
                <p className="text-xs font-bold text-[#1B1B1B]">27 Day Streak</p>
                <p className="text-[10px] text-[#6B7280]">Keep going!</p>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 z-20 bg-white shadow-xl rounded-2xl border border-[#EAEAEA] px-4 py-2.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#F3FBF3] text-[#57C76F] flex items-center justify-center font-bold">
                ⭐
              </div>
              <div>
                <p className="text-xs font-bold text-[#1B1B1B]">+50 ACE Tokens</p>
                <p className="text-[10px] text-[#6B7280]">Store balance updated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

