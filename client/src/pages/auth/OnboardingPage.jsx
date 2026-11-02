import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/profileService';
import {
  ShieldCheck,
  Check,
  Sparkles,
  Copy,
  ChevronRight,
  Code2,
  Cpu,
  Server,
  Cloud,
  Database,
  Search,
  ExternalLink,
  Zap,
  HelpCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OnboardingPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(2);
  const [selectedTrack, setSelectedTrack] = useState('fullstack');
  const [selectedSkills, setSelectedSkills] = useState([
    'Python',
    'JavaScript',
    'React',
    'Tailwind CSS',
    'Node.js',
    'Express',
    'MongoDB',
    'Git',
    'Docker',
  ]);
  const [handle, setHandle] = useState('aman-kumar');
  const [indexable, setIndexable] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setHandle(user.username);
    } else if (user?.name) {
      setHandle(user.name.toLowerCase().replace(/\s+/g, '-'));
    }
  }, [user]);

  const careerTracks = [
    {
      id: 'fullstack',
      title: 'Full-Stack Software Engineer',
      description: 'Client-side rendering, APIs, and microservices',
      tag: '↗ 1,420 openings this week',
      icon: Code2,
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'aiml',
      title: 'AI / Machine Learning Engineer',
      description: 'LLM pipelines, embeddings, PyTorch & CUDA',
      tag: '🔥 Top rising demand',
      icon: Cpu,
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      id: 'backend',
      title: 'Backend & Distributed Systems',
      description: 'High-throughput architectures, queues, RPCs',
      tag: '🎯 High compensation tier',
      icon: Server,
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      id: 'devops',
      title: 'DevOps & Cloud Architect',
      description: 'CI/CD, Terraform, Kubernetes clusters & SRE',
      tag: '🛡️ Critical infrastructure',
      icon: Cloud,
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
    },
    {
      id: 'data',
      title: 'Data Engineer / Analytics',
      description: 'ETL pipelines, Snowflake, Apache Spark & Real-time analytics',
      tag: '📈 High volume scaling',
      icon: Database,
      badgeColor: 'text-slate-700 bg-slate-50 border-slate-200',
    },
  ];

  const skillGroups = [
    {
      name: 'PROGRAMMING',
      items: ['Python', 'JavaScript', 'Go', 'C++', 'Java'],
    },
    {
      name: 'FRONTEND & UI',
      items: ['React', 'Tailwind CSS', 'Next.js'],
    },
    {
      name: 'BACKEND & DATA PERSISTENCE',
      items: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis'],
    },
    {
      name: 'TOOLS & INFRASTRUCTURE',
      items: ['Git', 'Docker', 'Kubernetes', 'AWS'],
    },
  ];

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const copyHandleUrl = () => {
    navigator.clipboard.writeText(`https://ace.app/u/${handle}`);
    setCopied(true);
    toast.success('Portfolio handle URL copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = async () => {
    try {
      const trackObj = careerTracks.find((t) => t.id === selectedTrack);
      await updateProfile({
        careerInterests: [trackObj?.title || 'Full-Stack Software Engineer'],
        skills: selectedSkills,
        isPublic: indexable,
      });
      toast.success('Identity saved to profile! Welcome to your ACE Dashboard.');
    } catch {
      // Continue to dashboard smoothly
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#1B1B1B] flex flex-col font-sans">
      {/* ─── Top Header ──────────────────────────────────────────────────────── */}
      <header className="border-b border-[#EAEAEA] bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center text-white font-black text-lg shadow-sm">
                A
              </div>
              <div>
                <span className="font-extrabold text-[#1B1B1B] text-base leading-tight tracking-tight block">
                  ACE
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">
                  Academic & Career Engine
                </span>
              </div>
            </Link>
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#F3FBF3] border border-[#57C76F]/30 text-emerald-700 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#57C76F]" />
              <span>256-bit Encrypted</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            <Link to="/login" className="text-gray-500 hover:text-gray-900 hidden sm:inline-block">
              Sign In
            </Link>
            <Link to="/register" className="text-gray-500 hover:text-gray-900 hidden sm:inline-block">
              Register
            </Link>
            <span className="px-3 py-1.5 rounded-full bg-orange-50 text-[#FF6B00] font-bold border border-orange-200">
              Onboarding Wizard
            </span>
            <div className="flex items-center space-x-1.5 text-gray-500 text-xs bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Setup: 3 Steps</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold text-xs border border-orange-200">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Stepper Sub-header ─────────────────────────────────────────────── */}
      <div className="border-b border-[#EAEAEA] bg-white/70 backdrop-blur-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF6B00] text-[11px] font-extrabold tracking-wide uppercase">
                ONBOARDING FLOW
              </span>
              <h1 className="text-lg font-bold text-[#1B1B1B]">
                Step 2 of 4: Craft Your Identity
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-gray-600 mt-2 sm:mt-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] animate-pulse"></span>
              <span>Step 2 Active • 65% Overall</span>
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center space-x-2 pb-2 border-b-2 border-[#57C76F] text-emerald-700 font-semibold">
              <div className="w-5 h-5 rounded-full bg-[#57C76F] text-white flex items-center justify-center text-[10px]">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="text-[10px] uppercase text-emerald-600 block">Step 1</span>
                <span>Academic Profile</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 pb-2 border-b-2 border-[#FF6B00] text-[#FF6B00] font-bold">
              <div className="w-5 h-5 rounded-full bg-[#FF6B00] text-white flex items-center justify-center text-[11px]">
                2
              </div>
              <div className="truncate">
                <span className="text-[10px] uppercase text-orange-500 block">In Progress</span>
                <span>Skills & Roles</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 pb-2 border-b-2 border-gray-200 text-gray-400 font-medium">
              <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[11px]">
                3
              </div>
              <div className="truncate">
                <span className="text-[10px] uppercase text-gray-400 block">Step 3</span>
                <span>Coding & Sync</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 pb-2 border-b-2 border-gray-200 text-gray-400 font-medium">
              <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[11px]">
                4
              </div>
              <div className="truncate">
                <span className="text-[10px] uppercase text-gray-400 block">Step 4</span>
                <span>First Milestone</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Onboarding Form & Profile Strength ────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1B1B1B] tracking-tight">
                What are your core technical superpowers & career targets?
              </h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                ACE tailors your daily coding streaks, ATS resume suggestions, and placement opportunities based on your stack.
              </p>
            </div>

            {/* Section 1: Primary Career Track */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-[#1B1B1B]">
                  Primary Career Track <span className="text-[#FF6B00]">*</span>
                </label>
                <span className="text-xs text-gray-400">Select one primary pathway</span>
              </div>

              <div className="space-y-3">
                {careerTracks.map((track) => {
                  const isSelected = selectedTrack === track.id;
                  const Icon = track.icon;
                  return (
                    <div
                      key={track.id}
                      onClick={() => setSelectedTrack(track.id)}
                      className={`relative flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#FF6B00] bg-white ring-2 ring-[#FF6B00]/20 shadow-sm'
                          : 'border-[#EAEAEA] bg-white hover:border-gray-300 hover:bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-orange-100 text-[#FF6B00]' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-sm text-[#1B1B1B]">{track.title}</h3>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{track.description}</p>
                          <span className={`inline-block mt-1 text-[11px] font-semibold ${track.tag.includes('rising') ? 'text-amber-600' : track.tag.includes('openings') ? 'text-emerald-600' : 'text-blue-600'}`}>
                            {track.tag}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-[#FF6B00] text-white flex items-center justify-center shadow-sm">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Technical Stack */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAEAEA] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1B1B1B]">Your Technical Stack</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Toggle active technologies you write code in regularly</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#F3FBF3] border border-[#57C76F]/30 text-emerald-700 font-bold text-xs">
                  &lt;&gt; {selectedSkills.length} Selected
                </div>
              </div>

              <div className="space-y-4">
                {skillGroups.map((group) => (
                  <div key={group.name} className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 tracking-wider">
                      {group.name}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill) => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                              isSelected
                                ? 'bg-orange-50 text-[#FF6B00] border border-orange-300 shadow-sm'
                                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <span>{isSelected ? '✓' : '+'}</span>
                            <span>{skill}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Digital Identity & Portfolio Handle */}
            <div className="bg-white p-6 rounded-2xl border border-[#EAEAEA] shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#1B1B1B]">Digital Identity & Portfolio Handle</h3>
                <p className="text-xs text-gray-500 mt-0.5">Your immutable verified student handle for recruiters and tech portfolios</p>
              </div>

              <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 focus-within:border-[#FF6B00] focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                <span className="text-xs text-gray-400 font-mono font-medium">ace.app/u/</span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  className="bg-transparent border-none text-xs font-mono font-bold text-gray-800 focus:outline-none flex-1 px-1"
                />
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <button
                    type="button"
                    onClick={copyHandleUrl}
                    className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-900 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-2xs"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Recruiter Indexable Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F3FBF3] border border-[#57C76F]/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">
                      Make public portfolio indexable by recruiter search
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      Recommended — unlocks direct hiring scout inboxes
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIndexable(!indexable)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    indexable ? 'bg-[#57C76F]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      indexable ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200 gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-xs font-semibold text-gray-400 hover:text-gray-700"
              >
                Skip for now (I will complete this on my dashboard)
              </button>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#e66000] text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Continue to Platform Sync (Step 3)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Strength Card */}
            <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Profile Strength
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#F3FBF3] text-emerald-700 text-[11px] font-bold border border-[#57C76F]/20">
                  Intermediate
                </span>
              </div>

              {/* Circular Gauge */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#f3f4f6"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#FF6B00"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="163.3"
                      strokeDashoffset="57"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-base font-black text-[#1B1B1B]">65%</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-snug">
                    Strong foundation built!
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Completing Step 2 elevates your discovery ranking by 2.4x.
                  </p>
                </div>
              </div>

              {/* Next Unlock Banner */}
              <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/70 mb-4">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-orange-900 block">Next Unlock at 80%</span>
                    <span className="text-[10px] text-orange-800 leading-tight block">
                      Tamper-Proof Public Badge & 100 Bonus ACE Tokens ready to claim upon Step 3 completion.
                    </span>
                  </div>
                </div>
              </div>

              {/* Breakdown Checklist */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Academic Details</span>
                  <span className="font-bold text-emerald-600">✓ +40 XP</span>
                </div>
                <div className="flex items-center justify-between text-[#FF6B00] font-semibold">
                  <span>Skill & Role Tagging</span>
                  <span className="font-bold">⚡ +50 XP (Pending)</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>GitHub & LeetCode Sync</span>
                  <span>+60 XP</span>
                </div>
              </div>
            </div>

            {/* Placement Market Snapshot */}
            <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm">
              <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold mb-2">
                <Zap className="w-4 h-4 text-[#57C76F]" />
                <span>Placement Market Snapshot</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Graduates targeting Full-Stack with React + Node currently achieve an average of 3 interview invites within 14 days of verification.
              </p>
              <div className="flex items-baseline justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500 font-medium">Matched Roles</span>
                <span className="text-2xl font-black text-[#57C76F]">342 Active</span>
              </div>
            </div>

            {/* Help Callout */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-[#EAEAEA] shadow-2xs text-xs">
              <div className="flex items-center space-x-2 text-gray-600">
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <span>Need guidance picking roles?</span>
              </div>
              <button
                type="button"
                onClick={() => toast('ACE Career AI Advisor is active 24/7 in your dashboard!')}
                className="font-bold text-[#FF6B00] hover:underline"
              >
                Chat with Advisor
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#EAEAEA] bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
          <span>© 2025 Academic & Career Engine. All rights reserved.</span>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
            <a href="#" className="hover:text-gray-600">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
