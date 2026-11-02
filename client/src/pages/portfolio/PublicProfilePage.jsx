import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicProfile } from '../../services/profileService';
import Avatar from '../../components/common/Avatar';
import LoadingScreen from '../../components/common/LoadingScreen';
import {
  Github,
  Linkedin,
  Globe,
  Flame,
  Star,
  Award,
  ExternalLink,
  Briefcase,
  Trophy,
  Code2,
  Calendar,
  Share2,
  Lock,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function PublicProfilePage() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPublicProfile(username);
      setData(res.data?.data || res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Profile is private or does not exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Profile URL copied to clipboard! 📋');
  };

  if (loading) return <LoadingScreen message="Loading student portfolio..." />;

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF1E6] text-[#FF6B00] flex items-center justify-center mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#1B1B1B] mb-2">Profile Unavailable</h2>
        <p className="text-sm text-[#6B7280] max-w-md mb-6">{error || 'This student profile is private.'}</p>
        <Link to="/" className="btn-primary !py-2.5 !px-6 !text-sm">
          Explore ACE Platform
        </Link>
      </div>
    );
  }

  const { user, profile, streak, projects, certificates, achievements, internships, codingProfiles, skills, badges } =
    data;

  return (
    <div className="min-h-screen bg-[#FFFDF8] pb-24">
      {/* Top Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#EAEAEA] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF6B00] to-[#FF8C1A] text-white flex items-center justify-center font-extrabold text-sm">
              A
            </div>
            <span className="font-extrabold text-base text-[#1B1B1B] tracking-tight">ACE Engine</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="btn-secondary !py-2 !px-3.5 !text-xs flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-[#FF6B00]" />
              Share Profile
            </button>
            <Link to="/register" className="btn-primary !py-2 !px-4 !text-xs">
              Join ACE Free
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
        {/* Profile Hero Card */}
        <div className="card p-6 sm:p-10 relative overflow-hidden bg-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left">
            <Avatar name={user?.name} src={profile?.avatar} size="2xl" />

            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">{user?.name}</h1>
                <p className="text-sm font-semibold text-[#6B7280] mt-0.5">
                  {profile?.degree} {profile?.branch ? `in ${profile?.branch}` : ''}
                  {profile?.college ? ` · ${profile?.college}` : ''}
                </p>
                {profile?.graduationYear && (
                  <p className="text-xs text-[#57C76F] font-bold mt-0.5">
                    Class of {profile.graduationYear}
                  </p>
                )}
              </div>

              {profile?.bio && (
                <p className="text-sm text-[#1B1B1B] leading-relaxed max-w-3xl">{profile.bio}</p>
              )}

              {/* Social Links */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl border border-[#EAEAEA] bg-[#FFFDF8] text-[#1B1B1B] hover:border-[#FF6B00] transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl border border-[#EAEAEA] bg-[#FFFDF8] text-blue-600 hover:border-blue-500 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile?.portfolio && (
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl border border-[#EAEAEA] bg-[#FFFDF8] text-[#57C76F] hover:border-[#57C76F] transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex sm:flex-col gap-2.5 sm:min-w-[140px] w-full sm:w-auto">
              {streak && (
                <div className="flex-1 p-3 rounded-2xl bg-[#FFF1E6] border border-[#FFD9B3] text-center">
                  <div className="flex items-center justify-center gap-1 text-[#FF6B00]">
                    <Flame className="w-4 h-4 fill-[#FF6B00]" />
                    <span className="text-sm font-extrabold">{streak.currentStreak} Days</span>
                  </div>
                  <span className="text-[10px] text-[#6B7280] font-semibold">Activity Streak</span>
                </div>
              )}
              <div className="flex-1 p-3 rounded-2xl bg-[#F3FBF3] border border-[#D4F0DA] text-center">
                <div className="flex items-center justify-center gap-1 text-[#57C76F]">
                  <Star className="w-4 h-4 fill-[#57C76F]" />
                  <span className="text-sm font-extrabold">Lvl {user?.level || 1}</span>
                </div>
                <span className="text-[10px] text-[#6B7280] font-semibold">{user?.levelName || 'Beginner'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Badges & Honors Showcase */}
        {badges && badges.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1B1B1B]">Earned Badges &amp; Verified Honors</h2>
                <p className="text-xs text-[#6B7280]">
                  Cryptographically stamped achievements and milestone badges awarded to this student.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#F3FBF3] text-xs font-bold text-[#57C76F] border border-[#D4F0DA]">
                {badges.length} Verified Badge{badges.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {badges.map((b) => (
                <div
                  key={b._id || b.slug}
                  className="card p-3.5 text-center space-y-1.5 hover:border-[#FF6B00] transition-all bg-white shadow-2xs"
                >
                  <div className="text-3xl filter drop-shadow-xs">{b.icon || '🏅'}</div>
                  <div className="text-xs font-black text-[#1B1B1B] leading-tight">{b.name}</div>
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
                    {b.rarity || 'Verified'}
                  </span>
                  <p className="text-[10px] text-[#6B7280] line-clamp-2">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Skills Chips */}
        {skills && skills.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#1B1B1B]">Technical Proficiencies</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s._id}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#EAEAEA] text-xs font-semibold text-[#1B1B1B] shadow-xs"
                >
                  {s.name}
                  <span className="text-[10px] text-[#6B7280] ml-1.5 font-normal">({s.proficiency})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Public Projects */}
        {projects && projects.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#1B1B1B]">Featured Projects ({projects.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <div key={p._id} className="card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#FF6B00]">{p.category}</span>
                      <span className="text-[11px] font-semibold text-[#57C76F]">{p.status}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#1B1B1B] mb-2">{p.title}</h3>
                    <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3 mb-4">
                      {p.description}
                    </p>
                    {p.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.technologies.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-semibold text-gray-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#EAEAEA] flex items-center gap-3 text-xs">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#1B1B1B] hover:text-[#FF6B00] flex items-center gap-1"
                      >
                        <Github className="w-3.5 h-3.5" />
                        Code
                      </a>
                    )}
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#57C76F] hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coding Platform Stats */}
        {codingProfiles && codingProfiles.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#1B1B1B]">Competitive Programming & Coding</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {codingProfiles.map((cp) => (
                <div key={cp._id} className="card p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-[#1B1B1B]">{cp.platform}</span>
                    {cp.profileUrl && (
                      <a
                        href={cp.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#FF6B00] hover:underline text-xs flex items-center gap-1"
                      >
                        Profile
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs text-[#6B7280]">Total Solved:</span>
                    <span className="text-base font-extrabold text-[#1B1B1B]">{cp.totalSolved}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[11px] text-center pt-2 border-t border-[#EAEAEA]">
                    <div>
                      <span className="text-gray-500 block">Easy</span>
                      <span className="font-bold text-[#57C76F]">{cp.easySolved || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Med</span>
                      <span className="font-bold text-[#FF6B00]">{cp.mediumSolved || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Hard</span>
                      <span className="font-bold text-red-500">{cp.hardSolved || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Public Certificates */}
        {certificates && certificates.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#1B1B1B]">Verified Credentials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <div key={cert._id} className="card p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F3FBF3] text-[#57C76F] flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-[#1B1B1B]">{cert.name}</h4>
                      <p className="text-xs text-[#6B7280]">{cert.issuingOrg}</p>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B00] hover:underline mt-2"
                        >
                          Verify Credential
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Public Achievements Timeline */}
        {achievements && achievements.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#1B1B1B]">Achievements & Honors</h2>
            <div className="space-y-3">
              {achievements.map((ach) => (
                <div key={ach._id} className="card p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1B1B1B]">{ach.title}</h4>
                      <p className="text-xs text-[#6B7280]">
                        {ach.organization} {ach.position ? `· ${ach.position}` : ''}
                      </p>
                    </div>
                  </div>
                  {ach.date && (
                    <span className="text-xs text-[#6B7280] whitespace-nowrap">
                      {formatDate(ach.date)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

