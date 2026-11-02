import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  ShieldCheck,
  Zap,
  Coins,
  Flame,
  Award,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: 'Indian Institute of Technology (IIT)',
    degree: 'B.Tech',
    branch: 'Computer Science and Engineering',
    graduationYear: 2026,
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password criteria
  const hasMinLength = formData.password.length >= 8;
  const hasSpecial = /[^A-Za-z0-9]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!hasMinLength) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service & Honor Code.');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        college: formData.college,
        degree: formData.degree,
        branch: formData.branch,
        graduationYear: Number(formData.graduationYear),
      });

      toast.success('Genesis account initialized! Welcome to ACE.');
      navigate('/onboarding');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Email may already exist.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col justify-between">
      {/* Top Header */}
      <header className="h-16 border-b border-[#EAEAEA] bg-white px-6 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center font-extrabold text-sm">
              A
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#1B1B1B] tracking-tight block">ACE</span>
              <span className="text-[8px] font-bold text-[#6B7280] uppercase tracking-wider block -mt-1">
                Academic & Career Engine
              </span>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-[10px] text-gray-600 font-semibold">
            <ShieldCheck className="w-3 h-3 text-[#57C76F]" />
            <span>256-bit Encrypted</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link to="/login" className="text-[#6B7280] hover:text-[#1B1B1B]">
            Sign In
          </Link>
          <span className="px-3 py-1 rounded-full bg-[#FFF1E6] text-[#FF6B00] font-bold">
            Onboarding Wizard
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-[#6B7280]">
            <Zap className="w-3 h-3 text-[#FF6B00]" />
            Setup: 3 Steps
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-10 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start w-full">
          {/* Left Column: Social Proof & Flywheel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3FBF3] border border-[#D4F0DA] text-xs font-bold text-[#57C76F]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>VERIFIED COLLEGIATE NETWORK</span>
            </div>

            <h1 className="heading-lg text-[#1B1B1B] font-extrabold tracking-tight">
              Join <span className="text-[#FF6B00]">14,000+</span> ambitious students building their
              career flywheel.
            </h1>

            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
              Transform coursework, competitive coding, and micro-internships into an algorithmic
              portfolio that catches top recruiters automatically.
            </p>

            {/* Genesis Welcome Kit Card */}
            <div className="p-5 rounded-2xl bg-white border border-[#EAEAEA] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                  <span className="text-xs font-bold text-[#1B1B1B]">Genesis Welcome Kit</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#FFF1E6] text-[9px] font-bold text-[#FF6B00] tracking-wider uppercase">
                  Auto-Credited
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-[#FFFDF8] border border-[#EAEAEA]">
                  <span className="text-[10px] text-[#6B7280] block">Starter XP</span>
                  <span className="text-base font-extrabold text-[#FF6B00]">+100 XP</span>
                  <span className="text-[9px] text-gray-400 block">Direct to profile</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FFFDF8] border border-[#EAEAEA]">
                  <span className="text-[10px] text-[#6B7280] block">Token Grant</span>
                  <span className="text-base font-extrabold text-[#57C76F]">50 $ACE</span>
                  <span className="text-[9px] text-gray-400 block">Unlocked immediately</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FFFDF8] border border-[#EAEAEA]">
                  <span className="text-[10px] text-[#6B7280] block">Milestone</span>
                  <span className="text-xs font-bold text-[#1B1B1B]">Lvl 1 Explorer</span>
                  <span className="text-[9px] text-[#57C76F] block font-semibold">Ready to claim</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FFFDF8] border border-[#EAEAEA]">
                  <span className="text-[10px] text-[#6B7280] block">Momentum</span>
                  <span className="text-xs font-bold text-[#1B1B1B]">Day 1 🔥</span>
                  <span className="text-[9px] text-[#FF6B00] block font-semibold">Auto-initialized</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F3FBF3] border border-[#D4F0DA] text-[10px] text-[#57C76F] font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#57C76F] animate-pulse" />
                <span>Priya S. from BITS Pilani unlocked SWE Fast-Track 4m ago</span>
              </div>
            </div>

            {/* Fast Setup Workflow */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280]">
                Fast Setup Workflow
              </span>
              <div className="space-y-2.5">
                {[
                  {
                    num: '1',
                    title: 'Register Account',
                    desc: 'Instant institutional identity clearance',
                    active: true,
                  },
                  {
                    num: '2',
                    title: 'Quick Diagnostic (3 min)',
                    desc: 'Skill strengths, targets, and career lane matching',
                  },
                  {
                    num: '3',
                    title: 'Personalized Career Engine',
                    desc: 'Live radar charts, sprint tracks, and recruiter syndication',
                  },
                ].map((s) => (
                  <div key={s.num} className="flex items-start gap-3 text-xs">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                        s.active ? 'bg-[#FF6B00] text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {s.num}
                    </span>
                    <div>
                      <p className="font-bold text-[#1B1B1B]">{s.title}</p>
                      <p className="text-[11px] text-[#6B7280]">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Quote */}
            <div className="p-4 rounded-2xl bg-white border border-[#EAEAEA] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFF1E6] text-[#FF6B00] flex items-center justify-center font-bold flex-shrink-0 text-sm">
                SR
              </div>
              <p className="text-xs text-[#6B7280] italic leading-relaxed">
                "ACE surfaced mock technical rounds and recruiter referrals I didn't know existed
                outside tier-1 campuses." —{' '}
                <strong className="text-[#1B1B1B] not-italic">Sneha R. • IIT Bombay '26</strong>
              </p>
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EAEAEA] shadow-xl p-6 sm:p-10 space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-[#1B1B1B]">
                Create your ACE Student Account
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#57C76F] font-bold mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero setup fees • 100% free for students forever</span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aman Kumar"
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">University / College Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="aman.kumar@iitd.ac.in or .edu"
                  className="input-field"
                />
                <span className="text-[10px] text-[#6B7280] mt-1 block">
                  We use this to verify student status & unlock campus cohort access.
                </span>
              </div>

              <div>
                <label className="label">College / University</label>
                <input
                  type="text"
                  required
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="Search e.g. Indian Institute of Technology / BITS / NIT"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Degree</label>
                  <select
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="select-field"
                  >
                    <option value="B.Tech">B.Tech / B.E.</option>
                    <option value="BCA">BCA</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>

                <div>
                  <label className="label">Department</label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="select-field"
                  >
                    <option value="Computer Science and Engineering">Computer Science & Eng</option>
                    <option value="Information Technology">Information Tech</option>
                    <option value="Electronics & Communication">Electronics & Comm</option>
                    <option value="Data Science & AI">Data Science & AI</option>
                    <option value="Mechanical Engineering">Mechanical</option>
                  </select>
                </div>
              </div>

              {/* Graduation Year Pills */}
              <div>
                <label className="label">Expected Graduation Year</label>
                <div className="grid grid-cols-4 gap-2">
                  {[2025, 2026, 2027, '2028+'].map((yr) => {
                    const isSelected =
                      formData.graduationYear === (yr === '2028+' ? 2028 : yr);
                    return (
                      <button
                        type="button"
                        key={yr}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            graduationYear: yr === '2028+' ? 2028 : yr,
                          })
                        }
                        className={`h-11 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-sm'
                            : 'bg-white text-[#1B1B1B] border-[#EAEAEA] hover:border-gray-300'
                        }`}
                      >
                        {yr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create a strong password"
                    className="input-field pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-[#6B7280] mt-1.5">
                  <span className={hasMinLength ? 'text-[#57C76F] font-bold' : ''}>
                    ○ 8+ characters
                  </span>
                  <span className={hasSpecial ? 'text-[#57C76F] font-bold' : ''}>
                    ○ Special character
                  </span>
                  <span className={hasNumber ? 'text-[#57C76F] font-bold' : ''}>
                    ○ Number
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="label">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className="input-field"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#6B7280]">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="mt-0.5 rounded text-[#FF6B00] focus:ring-[#FF6B00]"
                  />
                  <span>
                    I agree to the <span className="font-bold text-[#1B1B1B]">ACE Terms of Service</span>,{' '}
                    <span className="font-bold text-[#1B1B1B]">Privacy Policy</span>, and the{' '}
                    <span className="font-bold text-[#1B1B1B]">Academic Integrity Honor Code</span>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full shadow-orange !py-3.5 !mt-2 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Clearing Identity...' : 'Create Account & Start Onboarding'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-center text-xs text-[#6B7280]">
              Already have an ACE account?{' '}
              <Link to="/login" className="font-bold text-[#FF6B00] hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAEAEA] bg-white py-4 px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#6B7280]">
        <span>© 2025 Academic & Career Engine. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#1B1B1B]">Privacy Policy</a>
          <a href="#" className="hover:text-[#1B1B1B]">Terms of Service</a>
          <a href="#" className="hover:text-[#1B1B1B]">Help Center</a>
        </div>
      </footer>
    </div>
  );
}
