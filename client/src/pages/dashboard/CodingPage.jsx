import React, { useState } from 'react';
import {
  Code2,
  RefreshCw,
  Plus,
  Download,
  Flame,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  GitPullRequest,
  Check,
  Calendar,
  Lock,
  Search,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CodingPage() {
  const [platformFilter, setPlatformFilter] = useState('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [connectedPlatforms, setConnectedPlatforms] = useState([
    {
      id: 'leetcode',
      name: 'LeetCode',
      iconText: 'L',
      iconBg: 'bg-amber-500',
      username: 'aman_iitd',
      metric: '438 / 500',
      metricLabel: 'Solved Problems',
      rating: '1,940 (Top 4.2%)',
      globalRank: '#12,410',
      submetrics: 'E: 182 | M: 214 | H: 42',
      badges: ['Guardian Badge', '100d Badge'],
    },
    {
      id: 'github',
      name: 'GitHub',
      iconText: 'G',
      iconBg: 'bg-gray-900',
      username: 'aman-k',
      metric: '1,420',
      metricLabel: 'Yearly Commits',
      rating: '14 Repositories',
      globalRank: '44 PRs Merged',
      submetrics: 'Go 38% | Rust 26% | TS 22%',
      badges: ['184 Stars', 'Active Committer'],
    },
    {
      id: 'codeforces',
      name: 'Codeforces',
      iconText: 'C',
      iconBg: 'bg-blue-600',
      username: 'aman_cf',
      metric: '1,620',
      metricLabel: 'Current Rating',
      rating: 'Specialist Rank',
      globalRank: 'Top 8.5% Global',
      submetrics: 'Max: 1,684 | 28 Contests',
      badges: ['Specialist Rank'],
    },
    {
      id: 'geeksforgeeks',
      name: 'GeeksforGeeks',
      iconText: 'G',
      iconBg: 'bg-emerald-600',
      username: 'aman_gfg',
      metric: '186',
      metricLabel: 'Solved Problems',
      rating: 'Score: 620',
      globalRank: 'Campus Rank: Delhi #4',
      submetrics: 'Streak: 42 Days',
      badges: ['Top 5 Campus'],
    },
    {
      id: 'hackerrank',
      name: 'HackerRank',
      iconText: 'H',
      iconBg: 'bg-teal-700',
      username: 'aman_hr',
      metric: '6 Stars ★',
      metricLabel: 'Problem Solving',
      rating: 'Gold Level',
      globalRank: 'C++ Certified',
      submetrics: 'Python 5★ | SQL 4★',
      badges: ['Verified Skills'],
    },
  ]);

  const recentSolves = [
    {
      id: 'sol-1',
      title: '#42 Trapping Rain Water',
      subtitle: 'Two Pointers • Monotonic Stack',
      platform: 'LeetCode',
      difficulty: 'Hard',
      language: 'Go 1.22',
      runtime: 'Beats 98.4% (3ms)',
      date: '2 hours ago',
      xp: '+18 XP',
      tokens: '+4 $ACE',
      diffBg: 'bg-red-50 text-red-600 border-red-200',
    },
    {
      id: 'sol-2',
      title: 'Raft Consensus Log Replication PR #14',
      subtitle: 'Distributed Key-Store • Merged to main',
      platform: 'GitHub',
      difficulty: 'PR Merge',
      language: 'Rust',
      runtime: '100% CI Passed (28 tests)',
      date: 'Yesterday',
      xp: '+25 XP',
      tokens: '+8 $ACE',
      diffBg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'sol-3',
      title: '#210 Course Schedule II',
      subtitle: "Topological Sort • Kahn's Algorithm",
      platform: 'LeetCode',
      difficulty: 'Medium',
      language: 'C++20',
      runtime: 'Beats 89.1% (12ms)',
      date: '2 days ago',
      xp: '+12 XP',
      tokens: '+2 $ACE',
      diffBg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'sol-4',
      title: 'CF 1941D - Rudolf and the Ball Game',
      subtitle: 'Dynamic Programming + Bitsets',
      platform: 'Codeforces',
      difficulty: '1300 pts',
      language: 'C++20',
      runtime: 'Passed System (46ms)',
      date: '3 days ago',
      xp: '+12 XP',
      tokens: '+3 $ACE',
      diffBg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'sol-5',
      title: '#146 LRU Cache',
      subtitle: 'Hash Map • Doubly Linked List',
      platform: 'LeetCode',
      difficulty: 'Medium',
      language: 'Go 1.22',
      runtime: 'Beats 96.4% (88ms)',
      date: '4 days ago',
      xp: '+10 XP',
      tokens: '+2 $ACE',
      diffBg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  const filteredSolves =
    platformFilter === 'All'
      ? recentSolves
      : recentSolves.filter((s) => s.platform === platformFilter || (platformFilter === 'GitHub PRs' && s.platform === 'GitHub'));

  const handleSyncAll = () => {
    setIsSyncing(true);
    toast.loading('Polling official GraphQL & REST APIs for LeetCode, GitHub & Codeforces...', { id: 'sync' });
    setTimeout(() => {
      setIsSyncing(false);
      toast.success('Successfully synced all 5 platforms! +15 XP logged.', { id: 'sync' });
    }, 1500);
  };

  const handleExport = () => {
    toast.success('Generating verified telemetry dossier PDF...');
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-[#1B1B1B]">
      {/* ─── Breadcrumb & Top Header ────────────────────────────────────────── */}
      <div>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          ENGINEERING &amp; CODING SYNC &gt; Coding Tracker &amp; Verified Profiles
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[#1B1B1B] tracking-tight">
              Unified Coding Intelligence &amp; Algorithmic Growth
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
              Aggregate problem metrics, competitive contest ratings, and live GitHub commit streaks into a tamper-proof student engineering profile.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#e66000] text-white text-xs font-bold shadow-sm shadow-orange-500/20 flex items-center space-x-1.5 transition-all disabled:opacity-75"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync Now (Auto-Poll)</span>
            </button>
            <button
              type="button"
              onClick={() => toast.success('Connecting new platform webhook...')}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center space-x-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-gray-500" />
              <span>Add Platform Account</span>
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center space-x-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>Export PDF/JSON</span>
            </button>
          </div>
        </div>

        {/* Live sync sub-banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4 px-4 py-2 rounded-xl bg-white border border-[#EAEAEA] text-[11px] shadow-2xs">
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="w-2 h-2 rounded-full bg-[#57C76F] animate-pulse"></span>
            <span>All 5 platforms synced 14 mins ago • Next automatic webhook cycle in 46 mins • 0 sync errors</span>
          </div>
          <div className="flex items-center space-x-2 font-mono text-[10px] text-gray-400">
            <span>SHA: 25d-9f4e...c902 (On-Chain Hash)</span>
            <a href="#" className="text-[#FF6B00] font-bold hover:underline">
              Inspect Logs &gt;
            </a>
          </div>
        </div>
      </div>

      {/* ─── 4 KPI Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Solved */}
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Solved</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              +16 this wk
            </span>
          </div>
          <div className="text-3xl font-black text-[#1B1B1B]">782</div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
            <span>Easy: 370</span>
            <span>Med: 344</span>
            <span className="text-red-600 font-semibold">Hard: 68</span>
          </div>
        </div>

        {/* Peak Rating */}
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Peak Rating</span>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6B00] text-[10px] font-bold border border-orange-200">
              Knight Tier
            </span>
          </div>
          <div className="text-3xl font-black text-[#1B1B1B]">1,940</div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
            <span>Top 4.1% Global LeetCode</span>
            <span className="font-semibold text-blue-600">CF: 1,620 Max</span>
          </div>
        </div>

        {/* All-Time Commits */}
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">All-Time Commits</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold">
              46 Repos
            </span>
          </div>
          <div className="text-3xl font-black text-[#1B1B1B]">1,420</div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
            <span>184 stars earned</span>
            <span className="font-semibold text-emerald-600">94% PR Merge</span>
          </div>
        </div>

        {/* Active Streak */}
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Active Streak</span>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6B00] text-[10px] font-bold border border-orange-200">
              Active Today 🔥
            </span>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl font-black text-[#1B1B1B]">27</span>
            <span className="text-base font-bold text-gray-500">Days</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
            <span>3 Solved today</span>
            <span className="font-bold text-[#FF6B00]">Day 28 = +45 $ACE</span>
          </div>
        </div>
      </div>

      {/* ─── Connected Platforms (5 Active Cards) ───────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#1B1B1B]">Connected Platforms (5 Active)</h2>
          <span className="text-xs text-gray-400">Real-time sync via Official GraphQL &amp; REST APIs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {connectedPlatforms.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-[#EAEAEA] p-4 shadow-sm hover:border-gray-300 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-7 h-7 rounded-lg ${p.iconBg} text-white flex items-center justify-center font-black text-xs shadow-2xs`}
                  >
                    {p.iconText}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">{p.name}</h3>
                    <p className="text-[10px] font-mono text-gray-400">@{p.username}</p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 hover:text-gray-700 cursor-pointer" />
              </div>

              <div>
                <div className="text-xl font-black text-gray-900">{p.metric}</div>
                <div className="text-[10px] text-gray-400 font-medium">{p.metricLabel}</div>
              </div>

              <div className="text-[11px] text-gray-600 pt-2 border-t border-gray-100 space-y-0.5">
                <div className="font-semibold text-gray-800">{p.rating}</div>
                <div className="text-[10px] text-gray-400">{p.globalRank}</div>
                <div className="text-[10px] text-gray-500">{p.submetrics}</div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {p.badges.map((b, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-gray-50 border border-gray-200 text-[9px] font-bold text-gray-600"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Two-Column Middle Section ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Algorithmic Domain Mastery (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1B1B1B]">Algorithmic Domain Mastery</h3>
              <p className="text-xs text-gray-400 mt-0.5">Breakdown across 782 verified solves</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#F3FBF3] text-emerald-700 text-xs font-bold border border-[#57C76F]/30">
              GRAND READY 92%
            </span>
          </div>

          {/* Circular Ring Simulation */}
          <div className="flex items-center justify-center p-3">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle cx="72" cy="72" r="58" stroke="#f3f4f6" strokeWidth="10" fill="transparent" />
                <circle
                  cx="72"
                  cy="72"
                  r="58"
                  stroke="#57C76F"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="364.4"
                  strokeDashoffset="120"
                  strokeLinecap="round"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="58"
                  stroke="#FF6B00"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="364.4"
                  strokeDashoffset="260"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-2xl font-black text-gray-900">782</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total</div>
              </div>
            </div>

            <div className="ml-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#57C76F]" />
                <span className="text-gray-600">Easy: 370 (86%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                <span className="text-gray-600">Medium: 344 (44%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-gray-600">Hard: 68 (12%)</span>
              </div>
            </div>
          </div>

          {/* Domain Depth Check */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Domain Depth Check • Recommended Benchmarks
            </div>

            {[
              { name: 'Dynamic Programming', count: '68 / 90', percent: '75%', color: 'bg-orange-500' },
              { name: 'Graphs & Trees (BFS/DFS, Topological)', count: '84 / 155', percent: '54%', color: 'bg-emerald-500' },
              { name: 'Arrays, Hashing & Two Pointers', count: '142 / 158', percent: '90%', color: 'bg-emerald-600' },
              { name: 'System Design & Concurrency', count: '28 / 40', percent: '70%', color: 'bg-blue-500' },
              { name: 'Backtracking & Combinatorics', count: '46 / 55', percent: '83%', color: 'bg-purple-500' },
            ].map((d, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700">{d.name}</span>
                  <span className="text-gray-500 font-mono text-[11px]">
                    {d.count} ({d.percent})
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`${d.color} h-full rounded-full`} style={{ width: d.percent }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Unified Activity Heatmap (52 Weeks) (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#1B1B1B]">Unified Activity Heatmap (52 Weeks)</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Integrated timeline across LeetCode, GitHub commits, and Codeforces contests.
              </p>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <button type="button" className="px-2.5 py-1 rounded-md bg-orange-100 text-[#FF6B00] font-bold">
                All
              </button>
              <button type="button" className="px-2.5 py-1 rounded-md text-gray-500 hover:bg-gray-50">
                LeetCode
              </button>
              <button type="button" className="px-2.5 py-1 rounded-md text-gray-500 hover:bg-gray-50">
                GitHub
              </button>
              <button type="button" className="px-2.5 py-1 rounded-md text-gray-500 hover:bg-gray-50">
                CF Contests
              </button>
            </div>
          </div>

          {/* Heatmap Grid in Orange / Amber Shades */}
          <div className="space-y-1 overflow-x-auto pb-2">
            <div className="flex justify-between text-[10px] text-gray-400 font-mono px-1">
              {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-1 w-full min-w-[500px]">
              {Array.from({ length: 7 * 50 }).map((_, idx) => {
                const intensity = (idx * 19) % 5;
                let bg = 'bg-gray-100';
                if (intensity === 1) bg = 'bg-amber-100';
                if (intensity === 2) bg = 'bg-amber-300';
                if (intensity === 3) bg = 'bg-[#FF6B00]';
                if (intensity === 4) bg = 'bg-orange-700';
                return (
                  <div
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-[2px] ${bg} hover:scale-125 transition-transform cursor-pointer`}
                    title={`Day ${idx}: ${intensity * 3} solves & commits`}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
            <div>
              <span>Longest Streak: <strong className="text-gray-800">58 Days</strong> (Record)</span>
              <span className="mx-2">•</span>
              <span>Current: <strong className="text-[#FF6B00]">27 Days Active 🔥</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>Less</span>
              <div className="w-2 h-2 rounded-[2px] bg-gray-100"></div>
              <div className="w-2 h-2 rounded-[2px] bg-amber-100"></div>
              <div className="w-2 h-2 rounded-[2px] bg-[#FF6B00]"></div>
              <div className="w-2 h-2 rounded-[2px] bg-orange-700"></div>
              <span>More</span>
            </div>
          </div>

          {/* Weekly Milestone Banner */}
          <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-[#FF6B00]" />
                <span className="text-xs font-bold text-gray-900">
                  Weekly Milestone: 11 / 15 Solved (73%)
                </span>
              </div>
              <p className="text-[11px] text-orange-950">
                Solve 4 more Med/Hard problems before Sunday midnight to retain +75 $ACE bonus.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-gray-400 block">Upcoming:</span>
              <span className="text-xs font-bold text-gray-800">LeetCode 398 Contest (Sun 8 PM)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Recent Verified Solves & Submissions Table ─────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-[#FF6B00]" />
            <h3 className="text-sm font-bold text-[#1B1B1B]">Recent Verified Solves &amp; Submissions</h3>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            {['All', 'LeetCode', 'Codeforces', 'GitHub PRs'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setPlatformFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  platformFilter === tab
                    ? 'bg-[#FF6B00] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab === 'All' ? 'All Platforms' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Problem / Work Title</th>
                <th className="py-2.5 px-3">Platform</th>
                <th className="py-2.5 px-3">Difficulty</th>
                <th className="py-2.5 px-3">Language</th>
                <th className="py-2.5 px-3">Benchmark Runtime</th>
                <th className="py-2.5 px-3">Verified Date</th>
                <th className="py-2.5 px-3 text-right">XP &amp; ACE Token</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSolves.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-gray-900">{s.title}</div>
                    <div className="text-[11px] text-gray-400">{s.subtitle}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-gray-700">{s.platform}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${s.diffBg}`}>
                      {s.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-gray-600">{s.language}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-gray-600">{s.runtime}</td>
                  <td className="py-3 px-3 text-gray-400">{s.date}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-bold text-emerald-600">{s.xp}</span>{' '}
                    <span className="font-bold text-[#FF6B00]">{s.tokens}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 gap-2">
          <span>Showing latest 5 verified submissions • 772 historical records archived</span>
          <button
            type="button"
            onClick={() => toast('Displaying full archival log...')}
            className="font-bold text-[#FF6B00] hover:underline flex items-center self-end sm:self-auto"
          >
            <span>View Complete Solved Ledger</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>

      {/* ─── Lower Two Widgets (Weekly Targets & Algo Titan Tier) ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Weekly Coding Targets (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1B1B1B]">Weekly Coding Targets (Week 42)</h3>
              <p className="text-xs text-gray-400 mt-0.5">Completed sprint targets yield bonus tokens</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#F3FBF3] text-emerald-700 text-xs font-bold border border-[#57C76F]/30">
              2 of 4 Completed
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between opacity-80">
              <div className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-md bg-[#57C76F] text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div>
                  <span className="font-bold text-gray-800 line-through">Solve 5 Dynamic Programming Problems</span>
                  <span className="text-[10px] text-gray-400 block">Completed (6/5 solved) • LeetCode Verified</span>
                </div>
              </div>
              <span className="font-bold text-emerald-600">+60 XP</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between opacity-80">
              <div className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-md bg-[#57C76F] text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div>
                  <span className="font-bold text-gray-800 line-through">Push 5+ Commits to 'raft-kv' distributed repo</span>
                  <span className="text-[10px] text-gray-400 block">Completed (8 commits pushed) • GitHub Verified</span>
                </div>
              </div>
              <span className="font-bold text-emerald-600">+40 XP</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#FF6B00] ring-1 ring-orange-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-5 h-5 rounded-md border-2 border-orange-400 flex items-center justify-center text-xs font-bold text-transparent">
                  ✓
                </div>
                <div>
                  <span className="font-bold text-gray-900">Weekly Target: Solve 15 Medium/Hard Problems</span>
                  <span className="text-[10px] text-orange-600 font-semibold block">11 / 15 Solved (73%)</span>
                </div>
              </div>
              <span className="font-bold text-[#FF6B00]">+60 XP</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="font-bold text-gray-700">Attend LeetCode Biweekly Contest 380</span>
                  <span className="text-[10px] text-gray-400 block">Saturday 8:00 PM • Calendar Reminder Synced</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-600 text-[10px] font-bold">
                Registered
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-400">
            <span>Resets in 2 days 15 hours (Sunday 23:59 UTC)</span>
            <a href="#" className="font-medium text-gray-600 hover:text-gray-900">
              Manage All Career Goals
            </a>
          </div>
        </div>

        {/* Algo Titan Tier Milestone (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
              Next Tier Unlock
            </span>
            <span className="text-xs text-gray-400 font-semibold">800 Solves Milestone</span>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center shrink-0 shadow-sm">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-black text-gray-900">Algo Titan Tier</h4>
              <p className="text-xs text-gray-500 mt-1 leading-snug">
                Unlocks tamper-proof placement passport badge &amp; direct recruiter discovery ranking.
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-700">Progress to 800 Solves</span>
              <span className="font-bold text-[#FF6B00]">782 / 800 (18 problems left)</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#FF6B00] h-full rounded-full" style={{ width: '97.7%' }} />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100 text-gray-600">
            <span className="font-bold text-emerald-700">+150 $ACE Token Grant</span>
            <span className="text-[11px] text-gray-400">Estimated: 4 Days</span>
          </div>

          <button
            type="button"
            onClick={() => toast.success('Launching recommended LeetCode Hard problem: Binary Tree Maximum Path Sum')}
            className="w-full py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#e66000] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all text-center flex items-center justify-center space-x-2"
          >
            <span>Solve Recommended Hard Problem</span>
            <span>💡</span>
          </button>
        </div>
      </div>
    </div>
  );
}
