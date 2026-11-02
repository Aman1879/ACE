import React from 'react';
import { Flame, Star, Trophy, Coins, ShieldCheck, Zap } from 'lucide-react';

export default function GamificationSection() {
  const milestones = [
    { days: '50 Days', badge: '50-Day Champion', tokens: '+200 Tokens', icon: '🔥' },
    { days: '100 Days', badge: '100-Day Champion', tokens: '+500 Tokens', icon: '⚡' },
    { days: '200 Days', badge: '200-Day Champion', tokens: '+1,200 Tokens', icon: '🌟' },
    { days: '400 Days', badge: '400-Day Champion', tokens: '+3,000 Tokens', icon: '👑' },
  ];

  return (
    <section id="gamification" className="py-24 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
            Gamified Growth
          </span>
          <h2 className="section-title mt-2">Built-in Gamification to Keep You Consistent</h2>
          <p className="section-subtitle">
            Consistency is the single biggest predictor of student placement success. ACE turns
            daily effort into measurable progress, XP, and real rewards.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Card 1: Streaks */}
          <div className="card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1E6] text-[#FF6B00] flex items-center justify-center mb-4">
              <Flame className="w-6 h-6 fill-[#FF6B00]" />
            </div>
            <h3 className="text-base font-bold text-[#1B1B1B] mb-2">Daily Streak Heatmap</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Qualifying daily learning activities maintain your streak. Visual GitHub-like calendar
              heatmap.
            </p>
            <div className="px-3 py-2 bg-[#FFFDF8] rounded-xl border border-[#EAEAEA] text-xs font-bold text-[#FF6B00]">
              🔥 27 Consecutive Days
            </div>
          </div>

          {/* Card 2: XP & Levels */}
          <div className="card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#F3FBF3] text-[#57C76F] flex items-center justify-center mb-4">
              <Star className="w-6 h-6 fill-[#57C76F]" />
            </div>
            <h3 className="text-base font-bold text-[#1B1B1B] mb-2">20 Level Progression</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              From Beginner (Level 1) to Pro Learner (Level 20). Earn XP whenever you add projects or
              complete goals.
            </p>
            <div className="px-3 py-2 bg-[#F3FBF3] rounded-xl border border-[#D4F0DA] text-xs font-bold text-[#57C76F]">
              ⭐ Level 8: Developer
            </div>
          </div>

          {/* Card 3: Badges */}
          <div className="card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1B1B1B] mb-2">Collectible Badges</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Milestone badges across coding counts, certificates, hackathons, and long-term streak
              records.
            </p>
            <div className="px-3 py-2 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-700">
              🏆 12 Badges Unlocked
            </div>
          </div>

          {/* Card 4: ACE Tokens */}
          <div className="card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1E6] text-[#FF6B00] flex items-center justify-center mb-4">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1B1B1B] mb-2">ACE Reward Currency</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Server-validated token transactions. Zero client manipulation. Tokens can be redeemed
              in the ACE Store.
            </p>
            <div className="px-3 py-2 bg-[#FFF1E6] rounded-xl border border-[#FFD9B3] text-xs font-bold text-[#FF6B00]">
              🪙 1,450 Tokens Balance
            </div>
          </div>
        </div>

        {/* Streak Milestones Banner */}
        <div className="p-8 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div>
              <h4 className="text-lg font-bold text-[#1B1B1B]">Official Streak Milestones</h4>
              <p className="text-xs text-[#6B7280]">
                Unlock special milestone rewards as you reach continuous activity thresholds.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-[#FFF1E6] text-xs font-bold text-[#FF6B00] border border-[#FFD9B3]">
              Server-Verified Integrity
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#EAEAEA] flex items-center gap-4"
              >
                <div className="text-2xl">{m.icon}</div>
                <div>
                  <h5 className="text-sm font-bold text-[#1B1B1B]">{m.days}</h5>
                  <p className="text-xs text-[#6B7280]">{m.badge}</p>
                  <span className="text-[11px] font-bold text-[#57C76F]">{m.tokens}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

