import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      toast.success('Welcome back to ACE!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex">
      {/* Left Column: Branding & Value Props (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-[#FFF1E6] to-[#F3FBF3] border-r border-[#EAEAEA] p-12 flex-col justify-between relative overflow-hidden">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-[#FF8C1A] text-white flex items-center justify-center font-extrabold text-xl shadow-sm">
            A
          </div>
          <div>
            <span className="font-extrabold text-xl text-[#1B1B1B] tracking-tight">ACE</span>
            <span className="block text-[10px] font-semibold text-[#6B7280] uppercase -mt-1">
              Academic & Career Engine
            </span>
          </div>
        </Link>

        <div className="max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-bold text-[#FF6B00] border border-[#EAEAEA]">
            Student Growth Platform
          </div>
          <h2 className="heading-lg text-[#1B1B1B] font-extrabold leading-tight">
            Manage your entire student journey in one place.
          </h2>
          <div className="space-y-4 pt-2">
            {[
              'Track projects, certificates, and coding challenges',
              'Build verified, ATS-compliant resumes with 1 click',
              'Maintain daily streaks and earn redeemable ACE tokens',
              'Share a permanent recruiter portfolio link',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#57C76F] text-white flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-[#1B1B1B]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#6B7280]">
          © {new Date().getFullYear()} ACE Platform · Built for academic and career excellence.
        </p>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex lg:hidden items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-extrabold text-lg">
                A
              </div>
              <span className="font-extrabold text-xl text-[#1B1B1B]">ACE</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Welcome back! 👋</h1>
            <p className="text-sm text-[#6B7280] mt-2">
              Log in to your student dashboard to track today's progress.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">College / Student Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="aman@college.edu"
                className="input-field"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label !mb-0">Password</label>
                <button
                  type="button"
                  onClick={() => toast('Please contact admin@ace.dev to reset password.')}
                  className="text-xs font-bold text-[#FF6B00] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1B1B1B]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full shadow-orange !py-3.5"
            >
              {loading ? 'Authenticating...' : 'Sign In to ACE'}
              {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
            </button>
          </form>

          <p className="text-center text-xs text-[#6B7280]">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#FF6B00] hover:underline">
              Register free now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

