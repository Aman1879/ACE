import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateProfile } from '../../services/profileService';
import Avatar from '../../components/common/Avatar';
import ProgressBar from '../../components/common/ProgressBar';
import {
  User,
  Save,
  Globe,
  Github,
  Linkedin,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  Award,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, loadUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [badges, setBadges] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    college: '',
    degree: '',
    branch: '',
    graduationYear: 2026,
    location: '',
    timezone: 'Asia/Kolkata',
    avatar: '',
    github: '',
    linkedin: '',
    portfolio: '',
    twitter: '',
    skills: '',
    careerInterests: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfile();
      const pData = res.data?.data?.profile || res.data?.profile || res.data?.data || res.data;
      const uData = res.data?.data?.user || res.data?.user || user;
      const bList = res.data?.data?.badges || res.data?.badges || [];
      setBadges(bList);
      if (pData || uData) {
        setFormData({
          name: uData?.name || user?.name || '',
          bio: pData?.bio || '',
          phone: pData?.phone || '',
          college: pData?.college || uData?.college || '',
          degree: pData?.degree || uData?.degree || 'B.Tech',
          branch: pData?.branch || uData?.branch || '',
          graduationYear: pData?.graduationYear || uData?.graduationYear || 2026,
          location: pData?.location || '',
          timezone: pData?.timezone || 'Asia/Kolkata',
          avatar: pData?.avatar || '',
          github: pData?.github || '',
          linkedin: pData?.linkedin || '',
          portfolio: pData?.portfolio || '',
          twitter: pData?.twitter || '',
          skills: Array.isArray(pData?.skills) ? pData.skills.join(', ') : (pData?.skills || ''),
          careerInterests: Array.isArray(pData?.careerInterests) ? pData.careerInterests.join(', ') : (pData?.careerInterests || ''),
        });
      }
    } catch {
      toast.error('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const interestsArray = formData.careerInterests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await updateProfile({
        ...formData,
        skills: skillsArray,
        careerInterests: interestsArray,
        graduationYear: Number(formData.graduationYear),
      });

      toast.success('Profile saved successfully! ✨');
      await loadUser();
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const completionPercent = user?.profileCompletionPercent || 65;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">My Student Profile</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Maintain your verified academic identity and public portfolio presentation.
          </p>
        </div>

        <a
          href={`/u/${user?.username}`}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary !py-2.5 !px-4 !text-xs flex items-center gap-1.5"
        >
          <ExternalLink className="w-4 h-4 text-[#FF6B00]" />
          View Public Profile
        </a>
      </div>

      {/* Completion Tracker Card */}
      <div className="card p-6 bg-gradient-to-r from-white via-[#FFF1E6]/40 to-[#F3FBF3]/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#57C76F] text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1B1B1B]">
                Profile Strength: {completionPercent}%
              </h3>
              <p className="text-xs text-[#6B7280]">
                A complete profile ranks higher on the public recruiter directory.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-white text-xs font-bold text-[#57C76F] border border-[#D4F0DA] self-start sm:self-auto">
            {completionPercent >= 100 ? 'Verified Complete' : 'In Progress'}
          </span>
        </div>
        <ProgressBar progress={completionPercent} color="bg-[#57C76F]" height="h-2.5" />
      </div>

      {/* ─── Earned Badges & Verified Honors Showcase ──────────────── */}
      <div className="card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1B1B1B]">
                Earned Badges &amp; Verified Honors ({badges.length})
              </h3>
              <p className="text-xs text-[#6B7280]">
                Verifiable on-chain academic and coding achievements awarded to your profile.
              </p>
            </div>
          </div>
          <a
            href="/dashboard/achievements"
            className="text-xs font-bold text-[#FF6B00] hover:underline"
          >
            Explore Milestones &gt;
          </a>
        </div>

        {badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {badges.map((b) => (
              <div
                key={b._id || b.slug}
                className="p-3 rounded-xl border border-emerald-200/80 bg-gradient-to-br from-[#F3FBF3] to-white hover:border-[#57C76F] transition-all text-center space-y-1 shadow-2xs"
              >
                <div className="text-2xl filter drop-shadow-xs">{b.icon || '🏅'}</div>
                <div className="text-xs font-black text-gray-900 leading-tight">{b.name}</div>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                    b.rarity === 'Legendary'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : b.rarity === 'Epic'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : b.rarity === 'Rare'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {b.rarity || 'Common'}
                </span>
                <p className="text-[10px] text-gray-500 line-clamp-1">{b.description}</p>
                <div className="text-[9px] font-bold text-emerald-600 pt-1 border-t border-emerald-100 flex items-center justify-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Earned</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 flex items-center justify-between">
            <span>
              No badges unlocked yet. Start solving problems, maintaining streaks, or publishing projects to earn verifiable student badges!
            </span>
            <a href="/dashboard/coding" className="font-bold text-[#FF6B00] hover:underline shrink-0 ml-2">
              Start Coding &gt;
            </a>
          </div>
        )}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic & Avatar */}
        <div className="card p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-[#1B1B1B] pb-3 border-b border-[#EAEAEA]">
            Basic Information
          </h3>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar name={formData.name || user?.name} src={formData.avatar} size="xl" />
            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="label">Profile Picture URL (Direct image link)</label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/... or Cloudinary URL"
                  className="input-field"
                />
              </div>
              <p className="text-[11px] text-[#6B7280]">
                Enter an image URL for your profile photo or leave blank to show initial avatar.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Contact Phone (Kept Private)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">Bio & Professional Headline</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="e.g. Full-Stack Engineer passionate about Node.js and distributed systems."
              className="textarea-field"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Location / City</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bangalore, India"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Timezone (Used for Streak Calculation)</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="select-field"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New York (EST)</option>
                <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="card p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-[#1B1B1B] pb-3 border-b border-[#EAEAEA]">
            Academic Qualifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">College / Institute Name</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. National Institute of Technology"
                className="input-field"
              />
            </div>

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
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Branch / Department</label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                placeholder="e.g. Computer Science and Engineering"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Graduation Year</label>
              <select
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                className="select-field"
              >
                {[2023, 2024, 2025, 2026, 2027, 2028, 2029].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Developer Links */}
        <div className="card p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-[#1B1B1B] pb-3 border-b border-[#EAEAEA]">
            Online Presence & Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">GitHub Profile URL</label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/username"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">LinkedIn Profile URL</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Personal Website / Portfolio</label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                placeholder="https://mywebsite.dev"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Twitter / X Profile</label>
              <input
                type="url"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="https://twitter.com/username"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Skills & Interests */}
        <div className="card p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-[#1B1B1B] pb-3 border-b border-[#EAEAEA]">
            Skills & Target Roles
          </h3>

          <div>
            <label className="label">Highlighted Technical Skills (comma separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g. React.js, Node.js, Python, MongoDB, Docker, AWS"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Career Interests / Desired Roles</label>
            <input
              type="text"
              value={formData.careerInterests}
              onChange={(e) => setFormData({ ...formData, careerInterests: e.target.value })}
              placeholder="e.g. Software Engineer, Frontend Engineer, AI Systems"
              className="input-field"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary btn-lg shadow-orange !py-3.5 !px-8 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving Profile...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

