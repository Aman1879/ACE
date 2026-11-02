import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateProfile } from '../../services/profileService';
import {
  Globe,
  Copy,
  ExternalLink,
  Eye,
  CheckCircle2,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PortfolioPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    isPublic: true,
    showProjects: true,
    showCertificates: true,
    showAchievements: true,
    showCoding: true,
    showInternships: true,
    showResume: false,
  });

  const portfolioUrl = `${window.location.origin}/u/${user?.username}`;

  useEffect(() => {
    fetchProfileSettings();
  }, []);

  const fetchProfileSettings = async () => {
    try {
      setLoading(true);
      const res = await getMyProfile();
      const pData = res.data?.data?.profile || res.data?.profile || res.data?.data || res.data;
      if (pData) {
        setProfile(pData);
        setSettings({
          isPublic: pData.isPublic !== undefined ? pData.isPublic : true,
          showProjects: pData.showProjects !== undefined ? pData.showProjects : true,
          showCertificates:
            pData.showCertificates !== undefined ? pData.showCertificates : true,
          showAchievements:
            pData.showAchievements !== undefined ? pData.showAchievements : true,
          showCoding: pData.showCoding !== undefined ? pData.showCoding : true,
          showInternships:
            pData.showInternships !== undefined ? pData.showInternships : true,
          showResume: pData.showResume !== undefined ? pData.showResume : false,
        });
      }
    } catch {
      toast.error('Failed to load portfolio settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await updateProfile(settings);
      toast.success('Portfolio privacy settings updated!');
    } catch {
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    toast.success('Public portfolio link copied to clipboard! 📋');
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Public Portfolio</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Every ACE student gets a verified public link to showcase achievements to recruiters and
            companies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button onClick={handleCopyLink} className="btn-secondary !py-2.5 !px-4 !text-xs flex items-center gap-1.5">
            <Copy className="w-4 h-4 text-[#FF6B00]" />
            Copy Share Link
          </button>
          <a
            href={`/u/${user?.username}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary !py-2.5 !px-5 !text-xs flex items-center gap-1.5 shadow-none"
          >
            <Eye className="w-4 h-4" />
            Live Preview
          </a>
        </div>
      </div>

      {/* Share Link Banner */}
      <div className="bg-[#F3FBF3] border border-[#D4F0DA] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#57C76F] uppercase tracking-wider">
            Your Verified Recruiter URL
          </span>
          <h3 className="text-xl font-bold text-[#1B1B1B] font-mono break-all">{portfolioUrl}</h3>
          <p className="text-xs text-[#6B7280]">
            Anyone with this link can view your permitted projects, coding progress, and
            credentials without logging in.
          </p>
        </div>

        <button
          onClick={handleCopyLink}
          className="btn-green !py-3 !px-6 !text-xs flex items-center gap-2 self-start md:self-auto flex-shrink-0"
        >
          <Share2 className="w-4 h-4" />
          Share with Recruiters
        </button>
      </div>

      {/* Privacy & Section Controls */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
          <div>
            <h3 className="text-lg font-bold text-[#1B1B1B]">Section Visibility Controls</h3>
            <p className="text-xs text-[#6B7280]">
              Control exactly which parts of your academic journey are shown publicly.
            </p>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="btn-primary !py-2 !px-5 !text-xs shadow-none"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        <div className="divide-y divide-[#EAEAEA]">
          {[
            {
              key: 'isPublic',
              title: 'Master Public Profile',
              desc: 'Make your portfolio accessible via your URL. If turned off, visitors see a private profile message.',
            },
            {
              key: 'showProjects',
              title: 'Projects Section',
              desc: 'Showcase your public projects with tech stack and live demo links.',
            },
            {
              key: 'showCertificates',
              title: 'Certificates Vault',
              desc: 'Display your verified certifications and credentials.',
            },
            {
              key: 'showAchievements',
              title: 'Achievements & Hackathons',
              desc: 'Show awards, coding competitions, and leadership timeline.',
            },
            {
              key: 'showCoding',
              title: 'Coding Platform Stats',
              desc: 'Display problem counts across LeetCode, CodeChef, and GeeksforGeeks.',
            },
            {
              key: 'showInternships',
              title: 'Internship Experience',
              desc: 'Show professional internships and company roles.',
            },
            {
              key: 'showResume',
              title: 'Downloadable Resume Button',
              desc: 'Allow visitors to download your latest ATS resume version.',
            },
          ].map((item) => (
            <div key={item.key} className="py-4 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-[#1B1B1B]">{item.title}</h4>
                <p className="text-xs text-[#6B7280] mt-0.5">{item.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => handleToggle(item.key)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings[item.key] ? 'bg-[#57C76F]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings[item.key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

