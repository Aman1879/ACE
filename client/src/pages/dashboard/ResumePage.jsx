import React, { useState } from 'react';
import {
  FileText,
  Download,
  Code2,
  Search,
  CheckCircle2,
  Sparkles,
  Zap,
  Check,
  Eye,
  Maximize2,
  Copy,
  Plus,
  ShieldCheck,
  ChevronDown,
  Layers,
  Settings,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResumePage() {
  const [activeTab, setActiveTab] = useState('editor'); // editor, template, vault, logs
  const [selectedTemplate, setSelectedTemplate] = useState('silicon-valley');
  const [spacing, setSpacing] = useState('tighter');
  const [highlightKeywords, setHighlightKeywords] = useState(true);

  // Automated Feeds Toggles
  const [syncLeetCode, setSyncLeetCode] = useState(true);
  const [syncAWS, setSyncAWS] = useState(true);
  const [syncGitHub, setSyncGitHub] = useState(true);

  const handleDownloadPDF = () => {
    toast.success('Compiling ATS-verified PDF with embedded cryptographic hashes...');
    window.print();
  };

  const handleScanJD = () => {
    toast('Scanning target JD: 98% Keyword Match detected for Distributed Systems!', {
      icon: '🎯',
    });
  };

  const handleExportLatex = () => {
    navigator.clipboard.writeText(`% ACE ATS Resume LaTeX
\\documentclass[10pt,letterpaper]{article}
\\usepackage[margin=0.5in]{geometry}
\\begin{document}
\\begin{center}
    {\\Huge \\textbf{AMAN KUMAR}} \\\\
    New Delhi, India $|$ aman.kumar@iitd.ac.in $|$ +91 98765 43210
\\end{center}
\\end{document}`);
    toast.success('LaTeX source copied to clipboard!');
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-[#1B1B1B]">
      {/* ─── Breadcrumb & Header ────────────────────────────────────────────── */}
      <div>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          CAREER &amp; ENGINEERING ASSETS &gt; ATS RESUME ENGINE &amp; BUILDER
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl lg:text-3xl font-black text-[#1B1B1B] tracking-tight">
                Intelligent ATS Resume Engine
              </h1>
              <span className="px-2.5 py-1 rounded-full bg-[#F3FBF3] border border-[#57C76F]/30 text-emerald-700 text-xs font-bold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Direct ATS Sync Active</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
              Generate job-tailored, parser-optimized resumes powered by your verified ACE coursework, GitHub commits, and LeetCode benchmarks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Target Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 flex items-center space-x-2 shadow-2xs hover:bg-gray-50"
              >
                <span className="text-gray-400 font-normal">Target Profile:</span>
                <span>Backend &amp; Distributed Systems (v2.4)</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleScanJD}
              className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center space-x-1.5 transition-colors shadow-2xs"
            >
              <Search className="w-3.5 h-3.5 text-gray-500" />
              <span>Scan Target JD</span>
            </button>

            <button
              type="button"
              onClick={handleExportLatex}
              className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center space-x-1.5 transition-colors shadow-2xs"
            >
              <Code2 className="w-3.5 h-3.5 text-gray-500" />
              <span>Export LaTeX</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#e66000] text-white text-xs font-bold shadow-sm shadow-orange-500/20 flex items-center space-x-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ATS PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── ATS Score Banner ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            {/* Score Ring */}
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="#f3f4f6" strokeWidth="6" fill="transparent" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="#57C76F"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="213.6"
                  strokeDashoffset="11"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black text-gray-900 leading-none block">94.8</span>
                <span className="text-[10px] text-gray-400 font-bold block">/ 100</span>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-gray-900">Exceptional</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#F3FBF3] text-emerald-700 text-[11px] font-bold border border-[#57C76F]/30">
                  Tier-1 Ready
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-xl leading-relaxed">
                Greenfield parser structure. Fully compatible with Greenhouse, Lever, and Workday ATS algorithms.
              </p>
            </div>
          </div>

          {/* Micro metrics on right */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-sm font-black text-emerald-600">98%</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Keyword Parity</div>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-sm font-black text-emerald-600">95%</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Quant Impact</div>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-sm font-black text-emerald-600">92%</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Select Read</div>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-sm font-black text-emerald-600">94%</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Page Density</div>
            </div>
          </div>
        </div>

        {/* Proof badges row */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100 text-xs">
          <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#57C76F]" />
            <span>LeetCode 1,940 Knight rating (782 solved) verified &amp; synced</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#57C76F]" />
            <span>All 4 projects authenticated via GitHub Webhooks</span>
          </div>
        </div>

        {/* Pro Tip Banner */}
        <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0" />
            <span className="text-gray-800">
              <strong>Pro Tip:</strong> Explicitly mention Redis LRU eviction policy in FastKV.
            </span>
          </div>
          <button
            type="button"
            onClick={() => toast.success('Keyword applied to FastKV description!')}
            className="px-2.5 py-1 rounded bg-[#FF6B00] text-white text-[11px] font-bold hover:bg-[#e66000]"
          >
            Apply
          </button>
        </div>
      </div>

      {/* ─── Split Screen: Left Editor & Right ATS Viewport ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Editor & Feeds (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Editor Tabs */}
          <div className="flex items-center space-x-4 border-b border-gray-200 text-xs font-bold pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`pb-2 border-b-2 transition-all ${
                activeTab === 'editor'
                  ? 'border-[#FF6B00] text-[#FF6B00]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Editor Flow
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('template')}
              className={`pb-2 border-b-2 transition-all ${
                activeTab === 'template'
                  ? 'border-[#FF6B00] text-[#FF6B00]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Template &amp; Font
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vault')}
              className={`pb-2 border-b-2 transition-all ${
                activeTab === 'vault'
                  ? 'border-[#FF6B00] text-[#FF6B00]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Synced Vault (16)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('logs')}
              className={`pb-2 border-b-2 transition-all ${
                activeTab === 'logs'
                  ? 'border-[#FF6B00] text-[#FF6B00]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              ATS Log
            </button>
          </div>

          {/* ATS Template Presets */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900">ATS Template Presets</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                100% Parsing Guarantee
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTemplate('silicon-valley')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedTemplate === 'silicon-valley'
                    ? 'border-[#FF6B00] bg-orange-50/30 ring-1 ring-orange-200'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                  <span className="text-xs font-bold text-gray-900">Silicon Valley</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Single Column Standard</p>
                <span className="text-[9px] font-bold text-[#FF6B00] block mt-1">RECOMMENDED</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTemplate('minimal-sde')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedTemplate === 'minimal-sde'
                    ? 'border-[#FF6B00] bg-orange-50/30 ring-1 ring-orange-200'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-xs font-bold text-gray-900">Minimal SDE</div>
                <p className="text-[10px] text-gray-400 mt-1">Linear Compact Spacing</p>
                <span className="text-[9px] font-bold text-gray-400 block mt-1">STANDARD</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTemplate('research-cv')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedTemplate === 'research-cv'
                    ? 'border-[#FF6B00] bg-orange-50/30 ring-1 ring-orange-200'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-xs font-bold text-gray-900">Research CV</div>
                <p className="text-[10px] text-gray-400 mt-1">Multi-Page Academic</p>
                <span className="text-[9px] font-bold text-gray-400 block mt-1">SPECIALIZED</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
              <span>Body Typography: Inter / 10pt</span>
              <div className="flex items-center space-x-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSpacing('tighter')}
                  className={`px-2 py-0.5 rounded ${spacing === 'tighter' ? 'bg-gray-900 text-white font-bold' : 'text-gray-400'}`}
                >
                  Tighter
                </button>
                <button
                  type="button"
                  onClick={() => setSpacing('normal')}
                  className={`px-2 py-0.5 rounded ${spacing === 'normal' ? 'bg-gray-900 text-white font-bold' : 'text-gray-400'}`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setSpacing('relaxed')}
                  className={`px-2 py-0.5 rounded ${spacing === 'relaxed' ? 'bg-gray-900 text-white font-bold' : 'text-gray-400'}`}
                >
                  Relaxed
                </button>
              </div>
            </div>
          </div>

          {/* Automated ACE Data Feeds */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900">Automated ACE Data Feeds</span>
              <span className="px-2 py-0.5 rounded-full bg-[#F3FBF3] text-emerald-700 text-[10px] font-bold border border-[#57C76F]/30">
                Auto-Injecting
              </span>
            </div>
            <p className="text-[11px] text-gray-400 leading-snug">
              Pulls cryptographic hashes and verified metrics directly into the document structure to eliminate self-reported discrepancies.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
                <div>
                  <div className="font-bold text-gray-800">Sync LeetCode &amp; Competitive Benchmarks</div>
                  <div className="text-[11px] text-gray-500">Top 4.1% Knight (1,940 Peak) • 782 Solved</div>
                </div>
                <input
                  type="checkbox"
                  checked={syncLeetCode}
                  onChange={(e) => setSyncLeetCode(e.target.checked)}
                  className="w-4 h-4 text-[#FF6B00] rounded focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
                <div>
                  <div className="font-bold text-gray-800">Sync AWS Certification Credly Hash</div>
                  <div className="text-[11px] text-gray-500">AWS-SAA-C03 • Verified 2024</div>
                </div>
                <input
                  type="checkbox"
                  checked={syncAWS}
                  onChange={(e) => setSyncAWS(e.target.checked)}
                  className="w-4 h-4 text-[#FF6B00] rounded focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
                <div>
                  <div className="font-bold text-gray-800">Live Project GitHub Metrics</div>
                  <div className="text-[11px] text-gray-500">Syncs test passing % and commit benchmarks</div>
                </div>
                <input
                  type="checkbox"
                  checked={syncGitHub}
                  onChange={(e) => setSyncGitHub(e.target.checked)}
                  className="w-4 h-4 text-[#FF6B00] rounded focus:ring-0"
                />
              </label>
            </div>
          </div>

          {/* Experience & Internships Form Section */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900">Experience &amp; Internships</span>
              <button
                type="button"
                onClick={() => toast.success('Add experience modal opened')}
                className="text-xs font-bold text-[#FF6B00] hover:underline"
              >
                + Add Item
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Databricks — Incoming Systems Intern</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Incoming 2025
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Shortlisted via ACE automated campus pipeline; assigned to Storage &amp; Query Optimization cluster.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Razorpay — Backend Engineering Intern</span>
                  <span className="text-[10px] text-gray-400">May – Jul 2024</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Architected idempotent webhook processing service processing 4.2M daily transactions, reducing p99 dispatch latency by 34ms.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                    ✓ Impact Metric Detected (34ms / 4.2M)
                  </span>
                  <button
                    type="button"
                    onClick={() => toast.success('AI refinement applied!')}
                    className="text-[11px] font-bold text-[#FF6B00] flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Polish with AI</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Projects Form Section */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900">Featured Projects</span>
              <span className="text-xs text-gray-400">2 Active in ATS view</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">FastKV — Distributed In-Memory Store</span>
                  <span className="text-[10px] text-gray-400">Go, Raft, gRPC</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Built Raft consensus from scratch; benchmarked at 14,200 req/sec with &lt;2ms p99 latency.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">AlgoStream — Real-Time Analytics Engine</span>
                  <span className="text-[10px] text-gray-400">Node.js, Redis, React</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Sub-50ms reactive WebSocket dashboard actively used by 1,200+ collegiate students.
                </p>
              </div>

              <button
                type="button"
                onClick={() => toast.success('Vault project browser opened')}
                className="w-full py-2 rounded-xl border border-dashed border-gray-300 text-xs font-bold text-gray-600 hover:border-gray-400 flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project from ACE Vault</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Live ATS Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span className="font-semibold text-gray-700">
              Standard ATS Viewport (8.5" x 11") • Page 1 of 1
            </span>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highlightKeywords}
                  onChange={(e) => setHighlightKeywords(e.target.checked)}
                  className="w-3.5 h-3.5 text-[#FF6B00] rounded focus:ring-0"
                />
                <span className="font-medium text-gray-600">Highlight Keywords</span>
              </label>
              <button type="button" onClick={() => toast('Zoom reset to 100%')} className="hover:text-gray-900">
                <Eye className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => toast('Fullscreen ATS preview active')} className="hover:text-gray-900">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 8.5" x 11" Paper Document (Exact ATS Format) */}
          <div className="bg-white border border-[#D1D5DB] rounded-xl shadow-lg p-8 sm:p-10 font-serif text-[#0F172A] text-[11px] leading-relaxed selection:bg-orange-100">
            {/* Header: Name and Contact Info */}
            <div className="text-center border-b border-gray-300 pb-3 mb-3">
              <h1 className="text-2xl font-black tracking-wider text-black font-sans uppercase">
                Aman Kumar
              </h1>
              <div className="text-[10px] text-gray-700 font-sans mt-1 space-x-2">
                <span>New Delhi, India</span>
                <span>•</span>
                <span>aman.kumar@iitd.ac.in</span>
                <span>•</span>
                <span>+91 98765 43210</span>
                <span>•</span>
                <span className="font-semibold text-gray-900">ace.app/u/aman-kumar</span>
                <span>•</span>
                <span>github.com/aman-k</span>
                <span>•</span>
                <span>linkedin.com/in/aman-dev</span>
              </div>
            </div>

            {/* Section 1: Education */}
            <div className="mb-3.5">
              <div className="flex justify-between items-baseline border-b border-gray-300 pb-0.5 mb-1 font-sans">
                <span className="font-bold text-xs uppercase tracking-wide text-black">Education</span>
                <span className="text-[10px] text-gray-500 font-medium">IIT DELHI</span>
              </div>

              <div className="flex justify-between text-[11px] font-sans">
                <span className="font-bold text-black">Indian Institute of Technology (IIT) Delhi</span>
                <span className="text-gray-600">Expected May 2026</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-700 font-sans">
                <span>Bachelor of Technology in Computer Science and Engineering</span>
                <span className="font-bold text-black">CGPA: 9.24 / 10.0</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-0.5 font-sans">
                <strong>Relevant Coursework:</strong> Data Structures &amp; Algorithms, Distributed Systems, Operating Systems, Database Management Systems, Computer Networks, Compilers.
              </p>
            </div>

            {/* Section 2: Technical Skills & Verified Benchmarks */}
            <div className="mb-3.5">
              <div className="flex justify-between items-baseline border-b border-gray-300 pb-0.5 mb-1 font-sans">
                <span className="font-bold text-xs uppercase tracking-wide text-black">
                  Technical Skills &amp; Verified Benchmarks
                </span>
                <span className="text-[10px] text-emerald-700 font-bold uppercase">
                  Automated Telemetry
                </span>
              </div>

              <div className="space-y-0.5 text-[10px] font-sans">
                <div>
                  <strong className="text-black">Core Languages:</strong>{' '}
                  <span className={highlightKeywords ? 'bg-orange-50 text-gray-900 font-semibold' : ''}>
                    Go, C++, Rust, Python, TypeScript, SQL, Bash
                  </span>
                </div>
                <div>
                  <strong className="text-black">Systems &amp; Cloud:</strong>{' '}
                  <span className={highlightKeywords ? 'bg-orange-50 text-gray-900 font-semibold' : ''}>
                    Docker, Kubernetes, AWS, Redis, gRPC, PostgreSQL, Kafka, Linux/Unix Internals
                  </span>
                </div>
                <div>
                  <strong className="text-black">Algorithmic Benchmarks:</strong>{' '}
                  <span className="text-gray-800">
                    LeetCode Peak Rating 1,940 (Top 4.1%, Knight Tier • 782 Problems Solved) | Codeforces Specialist (1,620)
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Engineering Experience */}
            <div className="mb-3.5">
              <div className="flex justify-between items-baseline border-b border-gray-300 pb-0.5 mb-1 font-sans">
                <span className="font-bold text-xs uppercase tracking-wide text-black">
                  Engineering Experience
                </span>
                <span className="text-[10px] text-gray-500 font-medium">SYSTEMS &amp; BACKEND</span>
              </div>

              {/* Databricks */}
              <div className="mb-2 font-sans">
                <div className="flex justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-black">Databricks</span>
                    <span className="text-gray-600 text-[10px] ml-1.5 font-normal">
                      — Incoming Systems Software Engineering Intern
                    </span>
                  </div>
                  <span className="text-gray-600 text-[10px]">May 2025 – July 2025</span>
                </div>
                <div className="text-[10px] text-gray-500">Bengaluru / San Francisco</div>
                <ul className="list-disc list-outside ml-4 mt-0.5 text-[10px] text-gray-700 space-y-0.5">
                  <li>
                    Shortlisted via ACE automated collegiate pipeline; assigned to the Storage &amp; Query Engine optimization cluster.
                  </li>
                </ul>
              </div>

              {/* Razorpay */}
              <div className="font-sans">
                <div className="flex justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-black">Razorpay</span>
                    <span className="text-gray-600 text-[10px] ml-1.5 font-normal">
                      — Backend Engineering Intern (Payments Gateway Team)
                    </span>
                  </div>
                  <span className="text-gray-600 text-[10px]">May 2024 – July 2024</span>
                </div>
                <div className="text-[10px] text-gray-500">Bangalore, India</div>
                <ul className="list-disc list-outside ml-4 mt-0.5 text-[10px] text-gray-700 space-y-0.5">
                  <li>
                    Architected idempotent webhook processing service processing{' '}
                    <strong className="text-black font-semibold">4.2M daily transactions</strong>, reducing p99 dispatch latency by{' '}
                    <strong className="text-black font-semibold">34ms</strong> through concurrent worker pipelines.
                  </li>
                  <li>
                    Integrated a distributed Redis caching layer with optimistic concurrency locking, successfully mitigating double-charge race conditions during high-concurrency flash sale spikes.
                  </li>
                  <li>
                    Drafted comprehensive Prometheus telemetry alerts and Grafana dashboards for automated service recovery during transient database outages.
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 4: Featured Engineering Projects */}
            <div className="mb-3.5">
              <div className="flex justify-between items-baseline border-b border-gray-300 pb-0.5 mb-1 font-sans">
                <span className="font-bold text-xs uppercase tracking-wide text-black">
                  Featured Engineering Projects
                </span>
                <span className="text-[10px] text-gray-500 font-medium">OPEN-SOURCE &amp; VERIFIED</span>
              </div>

              {/* FastKV */}
              <div className="mb-2 font-sans">
                <div className="flex justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-black">FastKV: Distributed In-Memory Key-Value Store</span>
                    <span className="text-gray-500 text-[10px] ml-1.5 font-mono">Go, gRPC, RocksDB</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">github.com/aman-k/fastkv</span>
                </div>
                <ul className="list-disc list-outside ml-4 mt-0.5 text-[10px] text-gray-700 space-y-0.5">
                  <li>
                    Implemented the Raft distributed consensus protocol from scratch supporting leader election, log replication, and periodic heartbeats across 5-node distributed clusters.
                  </li>
                  <li>
                    Benchmarked sustained throughput of <strong className="text-black">14,200 req/sec</strong> with{' '}
                    <strong className="text-black">&lt;2ms p99 latency</strong> under chaotic network partitions, verified via 100% automated CI unit and partition testing.
                  </li>
                </ul>
              </div>

              {/* AlgoStream */}
              <div className="font-sans">
                <div className="flex justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-black">AlgoStream: Real-Time Coding Analytics Engine</span>
                    <span className="text-gray-500 text-[10px] ml-1.5 font-mono">Node.js, Redis, React, WebSockets</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">ace.app/u/aman-k/algostream</span>
                </div>
                <ul className="list-disc list-outside ml-4 mt-0.5 text-[10px] text-gray-700 space-y-0.5">
                  <li>
                    Constructed high-frequency asynchronous telemetry pipeline polling LeetCode and Codeforces webhooks without encountering upstream rate-limit drops.
                  </li>
                  <li>
                    Designed sub-50ms reactive WebSocket leaderboard dashboard utilized by <strong className="text-black">1,200+ collegiate students</strong> for competitive programming practice and peer milestones.
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 5: Honors & Verified Certifications */}
            <div className="font-sans">
              <div className="flex justify-between items-baseline border-b border-gray-300 pb-0.5 mb-1">
                <span className="font-bold text-xs uppercase tracking-wide text-black">
                  Honors &amp; Verified Certifications
                </span>
                <span className="text-[10px] text-emerald-700 font-bold uppercase">Credly Synced</span>
              </div>

              <ul className="list-disc list-outside ml-4 text-[10px] text-gray-700 space-y-0.5">
                <li>
                  <strong className="text-black">AWS Certified Solutions Architect – Associate</strong> (Credential ID: AWS-SAA-C03 • Credly Authenticated via ACE Vault)
                </li>
                <li>
                  <strong className="text-black">Smart India Hackathon (SIH) National Finalist</strong> (Ranked in Top 15 out of 12,000+ engineering teams nationwide)
                </li>
                <li>
                  <strong className="text-black">ACM-ICPC Regionalist</strong> (Amritapuri Regional Onsite Qualifier, Rank 42 across collegiate division)
                </li>
              </ul>
            </div>

            {/* Document Bottom Hash */}
            <div className="mt-6 pt-3 border-t border-gray-200 text-center font-mono text-[8px] text-gray-400 uppercase tracking-widest">
              ACE VERIFIED RESUME RECORD • HASH: 87F92833 • COMPLIANT WITH GREENHOUSE / LEVER / WORKDAY STANDARD PARSERS
            </div>
          </div>

          {/* ATS Parser Status bottom bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-white border border-[#EAEAEA] text-xs shadow-2xs gap-2">
            <div className="flex items-center space-x-2 text-emerald-700 font-medium">
              <Check className="w-4 h-4 text-[#57C76F] stroke-[3]" />
              <span>ATS Parser Preview: 0 formatting hazards detected. Text is pure selectable Unicode.</span>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => toast('Diff viewer: 100% text match')}
                className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold"
              >
                Plain-Text Diff
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('Aman Kumar\nIIT Delhi\nBackend & Distributed Systems');
                  toast.success('Raw markdown copied to clipboard!');
                }}
                className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Raw Markdown</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
