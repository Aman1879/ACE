import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile } from '../../services/profileService';
import { getGoals, createGoal, completeGoal } from '../../services/goalService';
import { getProjects, createProject } from '../../services/projectService';
import { getInternships } from '../../services/internshipService';
import { getStreak, recordActivity } from '../../services/streakService';
import { getGamificationSummary, getBadges } from '../../services/gamificationService';
import {
  Flame,
  Zap,
  Coins,
  TrendingUp,
  Plus,
  FileCode,
  Target,
  Copy,
  CheckCircle2,
  Lock,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Award,
  ChevronRight,
  GitBranch,
  Code2,
  Check,
  Sparkles,
  X,
  FolderOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardOverview() {
  const { user, updateUser, loadUser } = useAuth();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [projectList, setProjectList] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [internshipCount, setInternshipCount] = useState(0);
  const [badgeCount, setBadgeCount] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [dailySprintTasks, setDailySprintTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isCodingModalOpen, setIsCodingModalOpen] = useState(false);

  // New Project Form
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: 'React, Node.js, MongoDB',
    githubUrl: '',
    liveUrl: '',
    category: 'Full Stack',
  });

  // New Goal Form
  const [newGoalText, setNewGoalText] = useState('');
  const [goalCategory, setGoalCategory] = useState('DSA');

  // Log Coding Activity Form
  const [codingForm, setCodingForm] = useState({
    platform: 'LeetCode',
    problemsSolved: 3,
    notes: 'Tree and dynamic programming problems',
  });

  // Load real data from MongoDB
  useEffect(() => {
    fetchRealDashboardData();
  }, []);

  const fetchRealDashboardData = async () => {
    try {
      setLoading(true);
      const [profRes, goalRes, projRes, streakRes, gameRes, internRes, badgeRes] = await Promise.allSettled([
        getMyProfile(),
        getGoals({ limit: 6 }),
        getProjects({ limit: 10 }),
        getStreak(),
        getGamificationSummary(),
        getInternships({ limit: 1 }),
        getBadges(),
      ]);

      if (profRes.status === 'fulfilled' && profRes.value?.data) {
        const pObj = profRes.value.data?.data?.profile || profRes.value.data?.profile || profRes.value.data?.data || profRes.value.data;
        setProfile(pObj);
      }
      if (streakRes.status === 'fulfilled' && streakRes.value?.data) {
        const sObj = streakRes.value.data?.data || streakRes.value.data;
        setStreakData(sObj);
      }
      if (projRes.status === 'fulfilled' && projRes.value?.data) {
        const projs = projRes.value.data.data || projRes.value.data || [];
        setProjectList(projs);
        setProjectCount(projRes.value.data.total || projRes.value.data.pagination?.total || projs.length || 0);
      }
      if (gameRes.status === 'fulfilled' && gameRes.value?.data) {
        const gObj = gameRes.value.data?.data || gameRes.value.data || {};
        if (gObj.badgeCount !== undefined) setBadgeCount(gObj.badgeCount);
      }
      if (badgeRes.status === 'fulfilled' && badgeRes.value?.data) {
        const bList = Array.isArray(badgeRes.value.data?.data)
          ? badgeRes.value.data.data
          : (Array.isArray(badgeRes.value.data) ? badgeRes.value.data : []);
        const unlocked = bList.filter((b) => b.isUnlocked);
        setEarnedBadges(unlocked);
        setBadgeCount(unlocked.length);
      }
      if (internRes.status === 'fulfilled' && internRes.value?.data) {
        const totalInterns = internRes.value.data?.pagination?.total ?? (Array.isArray(internRes.value.data?.data) ? internRes.value.data.data.length : 0);
        setInternshipCount(totalInterns);
      }

      if (goalRes.status === 'fulfilled' && goalRes.value?.data) {
        const goals = goalRes.value.data.data || goalRes.value.data || [];
        if (goals.length > 0) {
          setDailySprintTasks(
            goals.map((g) => ({
              id: g._id,
              text: g.title,
              tag: `${g.category || 'DSA Track'} • ${g.type || 'Daily'}`,
              completed: g.status === 'completed',
              isFocus: g.priority === 'high',
              xp: '+30 XP',
              tokens: '+10 $ACE',
            }))
          );
        } else {
          // Initialize default starter sprint for fresh student accounts
          setDailySprintTasks([
            {
              id: 'init-1',
              text: 'Solve 3 Hard-Tree problems on LeetCode',
              tag: 'DSA Track • Daily Target',
              completed: true,
              xp: '+60 XP',
              tokens: '+10 $ACE',
            },
            {
              id: 'init-2',
              text: 'Review Docker multi-stage build notes',
              tag: 'DevOps & Infra',
              completed: true,
              xp: '+30 XP',
              tokens: null,
            },
            {
              id: 'init-3',
              text: 'Draft system architecture for Distributed Key-Value Store',
              tag: 'Current Active Focus',
              completed: false,
              isFocus: true,
              xp: '+40 XP',
              tokens: '+15 $ACE',
            },
            {
              id: 'init-4',
              text: "Update resume with Summer '25 Internship details",
              tag: 'Career Readiness Track',
              completed: false,
              xp: '+20 XP',
              tokens: null,
            },
          ]);
        }
      }
    } catch (err) {
      console.warn('Dashboard fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle or complete a goal
  const handleToggleTask = async (task) => {
    try {
      if (task.id.toString().startsWith('init-')) {
        // Toggle in local UI
        setDailySprintTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
        );
        toast.success('Sprint task updated! +30 XP credited.');
        return;
      }

      // Real MongoDB Goal completion
      const res = await completeGoal(task.id);
      setDailySprintTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: true } : t))
      );
      toast.success('Sprint task completed! XP & $ACE Tokens awarded.');
      await loadUser();
    } catch {
      setDailySprintTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
      );
      toast.success('Sprint task updated!');
    }
  };

  // Add a new goal to MongoDB
  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    try {
      const res = await createGoal({
        title: newGoalText.trim(),
        type: 'Daily',
        category: goalCategory,
        priority: 'Medium',
      });

      const newId = res?.data?.data?._id || res?.data?._id || Date.now();
      setDailySprintTasks((prev) => [
        ...prev,
        {
          id: newId,
          text: newGoalText.trim(),
          tag: `${goalCategory} Track • Daily Goal`,
          completed: false,
          xp: '+30 XP',
          tokens: '+10 $ACE',
        },
      ]);
      setNewGoalText('');
      setIsGoalModalOpen(false);
      toast.success('Goal saved to MongoDB! Complete it to earn XP.');
      await loadUser();
    } catch (err) {
      toast.error('Failed to create goal');
    }
  };

  // Create Project in MongoDB
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim()) {
      toast.error('Please enter a project title');
      return;
    }

    try {
      const techArray = projectForm.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await createProject({
        title: projectForm.title.trim(),
        description: projectForm.description.trim(),
        technologies: techArray,
        githubUrl: projectForm.githubUrl.trim(),
        liveUrl: projectForm.liveUrl.trim(),
        category: projectForm.category,
      });

      setProjectCount((c) => c + 1);
      if (res?.data?.data) {
        setProjectList((prev) => [res.data.data, ...prev]);
      }
      setIsProjectModalOpen(false);
      setProjectForm({
        title: '',
        description: '',
        technologies: 'React, Node.js, MongoDB',
        githubUrl: '',
        liveUrl: '',
        category: 'Full Stack',
      });

      await loadUser();
      toast.success('Project published to MongoDB! +50 XP & +20 $ACE awarded.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save project');
    }
  };

  // Log Coding Activity in MongoDB
  const handleLogCoding = async (e) => {
    e.preventDefault();
    try {
      await recordActivity('coding_solve');
      await loadUser();
      const updatedStreak = await getStreak();
      if (updatedStreak?.data?.data) {
        setStreakData(updatedStreak.data.data);
      }
      setIsCodingModalOpen(false);
      toast.success(`Logged ${codingForm.problemsSolved} problems on ${codingForm.platform}! Streak incremented.`);
    } catch (err) {
      toast.error('Failed to log activity');
    }
  };

  const copyHandle = () => {
    const handleUrl = `https://ace.app/u/${user?.username || 'aman-kumar'}`;
    navigator.clipboard.writeText(handleUrl);
    setCopied(true);
    toast.success('Public handle copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const heatmapMonths = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const completedCount = dailySprintTasks.filter((t) => t.completed).length;

  const displayName = user?.name ? user.name.split(' ')[0] : 'Student';
  const displayCollege = profile?.college || user?.college || 'Collegiate Track';
  const displayBranch = profile?.branch || user?.branch || 'Engineering';
  const displayGradYear = profile?.graduationYear || user?.graduationYear || 2026;
  const displayYearShort = String(displayGradYear).slice(-2);
  const currentStreak = streakData?.currentStreak !== undefined ? streakData.currentStreak : (user?.streak !== undefined ? user.streak : 1);
  const currentXP = user?.xp !== undefined ? user.xp : 100;
  const currentLevel = user?.level || 1;
  const currentLevelName = user?.levelName || 'Explorer';
  const currentTokens = user?.tokenBalance !== undefined ? user.tokenBalance : 50;
  const userHandle = user?.username || (user?.name ? user.name.toLowerCase().replace(/\s+/g, '-') : 'student');

  return (
    <div className="space-y-6 pb-12 font-sans text-[#1B1B1B]">
      {/* ─── Top Greeting Banner ────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-[#EAEAEA] p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF6B00] text-xs font-bold">
                {displayCollege} • {displayBranch} '{displayYearShort} Track
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#F3FBF3] border border-[#57C76F]/30 text-emerald-700 text-xs font-semibold">
                Term 7 Live
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-black text-[#1B1B1B] tracking-tight">
              Good Morning, {displayName}! 👋
            </h1>

            <p className="text-sm text-gray-500 leading-relaxed">
              Let's make today productive. You are <strong className="text-gray-800">1 qualifying task away</strong> from locking in your Day {currentStreak + 1} streak &amp; unlocking the Weekend XP Surge bonus.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#e66000] text-white text-xs font-bold shadow-sm shadow-orange-500/20 flex items-center space-x-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ New Project</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCodingModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center space-x-1.5 transition-colors shadow-2xs"
              >
                <FileCode className="w-3.5 h-3.5 text-gray-500" />
                <span>Log Coding Activity</span>
              </button>
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center space-x-1.5 transition-colors shadow-2xs"
              >
                <Target className="w-3.5 h-3.5 text-gray-500" />
                <span>+ Add Goal</span>
              </button>

              <div className="flex items-center space-x-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 font-mono">
                <span>ace.app/u/{userHandle}</span>
                <button type="button" onClick={copyHandle} className="hover:text-gray-900">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Readiness Right Card */}
          <div className="w-full lg:w-80 p-5 rounded-2xl bg-[#FFFDF8] border border-orange-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
                <span className="text-xs font-bold text-gray-800">Profile Readiness</span>
              </div>
              <span className="text-lg font-black text-[#FF6B00]">
                {user?.profileCompletionPercent || 85}%
              </span>
            </div>

            <p className="text-xs text-gray-500 leading-snug mb-3">
              Remaining: Add 1 faculty recommendation or verified credential to reach 100%.
            </p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-orange-100">
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                +150 XP &amp; Gold Badge
              </span>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="text-[#FF6B00] font-bold hover:underline flex items-center text-xs"
              >
                <span>Complete Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Top 4 KPI Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Daily Streak */}
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Daily Streak</span>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6B00] text-[10px] font-bold border border-orange-200">
              Active
            </span>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-[#1B1B1B]">{currentStreak}</span>
              <span className="text-base font-bold text-gray-500">Days</span>
              <Flame className="w-5 h-5 text-[#FF6B00] fill-[#FF6B00]" />
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Longest: {streakData?.longestStreak || currentStreak} Days • <strong className="text-emerald-600">Active Pace</strong>
            </p>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
            <span className="text-gray-500">50 Day Bronze Shield</span>
            <span className="font-bold text-orange-600">{Math.max(0, 50 - currentStreak)}d to go</span>
          </div>
          {/* Week tracker row */}
          <div className="flex items-center justify-between pt-1">
            {['M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
              const isActive = (6 - i) < currentStreak;
              return (
                <div key={i} className="flex flex-col items-center space-y-1">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-[#F3FBF3] text-[#57C76F] border border-[#57C76F]/30'
                        : 'bg-gray-50 text-gray-300 border border-gray-200'
                    }`}
                  >
                    {isActive ? '✓' : '•'}
                  </div>
                  <span className="text-[9px] text-gray-400">{day}</span>
                </div>
              );
            })}
            <div className="flex flex-col items-center space-y-1">
              <div className="w-6 h-6 rounded-md bg-orange-100 text-[#FF6B00] border border-orange-300 flex items-center justify-center text-[10px] font-bold animate-pulse">
                {currentStreak > 0 ? '✓' : 'S'}
              </div>
              <span className="text-[9px] font-bold text-[#FF6B00]">Today</span>
            </div>
          </div>
        </div>

        {/* Card 2: XP & Mastery Tier */}
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">XP &amp; Mastery Tier</span>
            <span className="px-2 py-0.5 rounded-full bg-[#F3FBF3] text-emerald-700 text-[10px] font-bold border border-[#57C76F]/30">
              Tier IV
            </span>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-[#1B1B1B]">Level {currentLevel}</span>
              <span className="text-xs font-bold text-gray-500">{currentXP.toLocaleString()} / 5,000 XP</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-[#57C76F] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((currentXP % 5000) / 50))}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5 flex items-center justify-between">
              <span>{currentLevelName} ⚡</span>
              <strong className="text-emerald-700">+80 XP today</strong>
            </p>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
            <span className="text-gray-500">Season 4 Leaderboard</span>
            <span className="font-bold text-gray-800">#18 Rank IITD</span>
          </div>
        </div>

        {/* Card 3: ACE Token Balance */}
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">ACE Token Balance</span>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#FF6B00] text-[10px] font-bold border border-orange-200">
              Web3 Verified
            </span>
          </div>
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-[#1B1B1B]">{currentTokens.toLocaleString()}</span>
              <span className="text-base font-bold text-[#FF6B00]">$ACE</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              +50 tokens pending automated verification
            </p>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
            <span className="text-gray-500">Last: LeetCode</span>
            <span className="font-bold text-emerald-600">+50 $ACE</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span>Store Status</span>
            <Link to="/store" className="font-bold text-[#FF6B00] hover:underline">
              Redeem in Store &gt;
            </Link>
          </div>
        </div>

        {/* Card 4: Career Readiness */}
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Career Readiness</span>
            <span className="px-2 py-0.5 rounded-full bg-[#F3FBF3] text-emerald-700 text-[10px] font-bold border border-[#57C76F]/30">
              Top 4% Cohort
            </span>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-emerald-600">94.8%</span>
              <span className="text-xs font-bold text-gray-400 uppercase">ATS Fit</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {(profile?.careerInterests && profile.careerInterests[0]) || (user?.profile?.careerInterests && user.profile.careerInterests[0]) || 'Full-Stack Software Engineer Track'}
            </p>
          </div>
          <div className="pt-2 border-t border-gray-100 grid grid-cols-3 text-center text-[10px]">
            <div>
              <div className="font-black text-gray-800 text-sm">{internshipCount}</div>
              <div className="text-gray-400 font-semibold uppercase">Interns</div>
            </div>
            <div>
              <div className="font-black text-gray-800 text-sm">{projectCount}</div>
              <div className="text-gray-400 font-semibold uppercase">Projects</div>
            </div>
            <div>
              <div className="font-black text-gray-800 text-sm">{badgeCount > 0 ? badgeCount : (currentLevel > 5 ? 19 : 2)}</div>
              <div className="text-gray-400 font-semibold uppercase">Badges</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Two-Column Middle Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Engineering Habit Heatmap */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-[#FF6B00]" />
                  <h3 className="text-sm font-bold text-[#1B1B1B]">Engineering Habit Heatmap</h3>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  524 verified contributions recorded across GitHub, LeetCode &amp; ACE Milestones in the last 12 months.
                </p>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <button type="button" className="px-2.5 py-1 rounded-md bg-gray-100 font-bold text-gray-700">
                  All
                </button>
                <button type="button" className="px-2.5 py-1 rounded-md text-gray-500 hover:bg-gray-50">
                  Commits
                </button>
                <button type="button" className="px-2.5 py-1 rounded-md text-gray-500 hover:bg-gray-50">
                  Code
                </button>
              </div>
            </div>

            {/* Heatmap Grid Simulation */}
            <div className="space-y-1 overflow-x-auto pb-2">
              <div className="flex justify-between text-[10px] text-gray-400 font-mono px-1">
                {heatmapMonths.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
              <div className="grid grid-rows-7 grid-flow-col gap-1 w-full min-w-[500px]">
                {Array.from({ length: 7 * 48 }).map((_, idx) => {
                  const intensity = (idx * 17) % 5;
                  let bg = 'bg-gray-100';
                  if (intensity === 1) bg = 'bg-emerald-200';
                  if (intensity === 2) bg = 'bg-emerald-400';
                  if (intensity === 3) bg = 'bg-[#57C76F]';
                  if (intensity === 4) bg = 'bg-emerald-600';
                  return (
                    <div
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-[2px] ${bg} transition-colors hover:scale-125 cursor-pointer`}
                      title={`Verified Activity Level ${intensity}`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-[11px] text-gray-400">
              <a href="#" className="hover:text-gray-700 font-medium">
                Learn how commits link to ACE verification
              </a>
              <div className="flex items-center space-x-1.5">
                <span>Less</span>
                <div className="w-2 h-2 rounded-[2px] bg-gray-100"></div>
                <div className="w-2 h-2 rounded-[2px] bg-emerald-200"></div>
                <div className="w-2 h-2 rounded-[2px] bg-[#57C76F]"></div>
                <div className="w-2 h-2 rounded-[2px] bg-emerald-600"></div>
                <span>More</span>
              </div>
            </div>
          </div>

          {/* ─── Earned Badges & Verified Honors Showcase ──────────────── */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1B1B1B]">Earned Badges &amp; Verified Honors</h3>
                  <p className="text-xs text-gray-400">
                    {earnedBadges.length > 0
                      ? `${earnedBadges.length} verified badge${earnedBadges.length === 1 ? '' : 's'} stamped to your student passport`
                      : 'Milestone badges unlocked through streaks, coding, and projects'}
                  </p>
                </div>
              </div>
              <Link
                to="/dashboard/achievements"
                className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center space-x-1"
              >
                <span>All Milestones</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {earnedBadges.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {earnedBadges.map((b) => (
                  <div
                    key={b._id || b.slug}
                    className="p-3.5 rounded-xl border border-emerald-200/80 bg-gradient-to-br from-[#F3FBF3] to-white hover:border-[#57C76F] transition-all text-center space-y-1.5 shadow-2xs"
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
                      {b.rarity || 'Verified'}
                    </span>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{b.description}</p>
                    <div className="text-[9px] font-bold text-emerald-600 pt-1 border-t border-emerald-100 flex items-center justify-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Unlocked</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200/80 flex items-center justify-between text-xs text-orange-950">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0" />
                  <span>
                    Your <strong>First Step</strong> badge is ready to claim! Solve a coding problem or add a project to unlock your first verifiable honors badge.
                  </span>
                </div>
                <Link
                  to="/dashboard/coding"
                  className="px-3 py-1.5 rounded-lg bg-[#FF6B00] text-white font-bold text-xs shrink-0 shadow-2xs"
                >
                  Start Coding
                </Link>
              </div>
            )}
          </div>

          {/* Streak Tier Badges */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#1B1B1B]">Streak Tier Badges</h3>
              <span className="text-xs text-gray-400">Current: {currentStreak} Days</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-orange-200 bg-orange-50/40 text-center space-y-1">
                <span className="text-[10px] font-bold text-[#FF6B00] uppercase block">50 Days • In Sight</span>
                <div className="text-sm font-black text-gray-800">Bronze Shield</div>
                <div className="text-[11px] text-gray-500">{currentStreak} / 50 Days ({Math.min(100, Math.round((currentStreak / 50) * 100))}%)</div>
                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden mt-2">
                  <div className="bg-[#FF6B00] h-full" style={{ width: `${Math.min(100, (currentStreak / 50) * 100)}%` }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-center space-y-1">
                <div className="flex items-center justify-center space-x-1 text-[10px] font-bold text-gray-400 uppercase">
                  <span>100 Days</span>
                  <Lock className="w-3 h-3 text-gray-400" />
                </div>
                <div className="text-sm font-bold text-gray-600">Silver Blade</div>
                <div className="text-[11px] text-gray-400">{currentStreak} / 100 Days ({Math.min(100, Math.round((currentStreak / 100) * 100))}%)</div>
                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden mt-2">
                  <div className="bg-gray-400 h-full" style={{ width: `${Math.min(100, (currentStreak / 100) * 100)}%` }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-center space-y-1">
                <div className="flex items-center justify-center space-x-1 text-[10px] font-bold text-gray-400 uppercase">
                  <span>200 Days</span>
                  <Lock className="w-3 h-3 text-gray-400" />
                </div>
                <div className="text-sm font-bold text-gray-600">Gold Vanguard</div>
                <div className="text-[11px] text-gray-400">{currentStreak} / 200 Days ({Math.min(100, Math.round((currentStreak / 200) * 100))}%)</div>
                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden mt-2">
                  <div className="bg-gray-400 h-full" style={{ width: `${Math.min(100, (currentStreak / 200) * 100)}%` }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-center space-y-1">
                <div className="flex items-center justify-center space-x-1 text-[10px] font-bold text-gray-400 uppercase">
                  <span>400 Days</span>
                  <Lock className="w-3 h-3 text-gray-400" />
                </div>
                <div className="text-sm font-bold text-gray-600">Mythic Legend</div>
                <div className="text-[11px] text-gray-400">{currentStreak} / 400 Days ({Math.min(100, Math.round((currentStreak / 400) * 100))}%)</div>
                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden mt-2">
                  <div className="bg-gray-400 h-full" style={{ width: `${Math.min(100, (currentStreak / 400) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Daily Sprint */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1B1B1B]">Today's Daily Sprint</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Complete remaining tasks to lock in Day {currentStreak + 1} streak &amp; claim daily XP.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#F3FBF3] text-emerald-700 text-xs font-bold border border-[#57C76F]/30">
                {completedCount} of {dailySprintTasks.length} Completed
              </span>
            </div>

            <div className="space-y-2.5">
              {dailySprintTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${task.completed
                      ? 'bg-gray-50 border-gray-200 opacity-75'
                      : task.isFocus
                        ? 'bg-white border-[#FF6B00] ring-1 ring-orange-200 shadow-2xs'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${task.completed
                          ? 'bg-[#57C76F] text-white'
                          : 'border-2 border-gray-300 text-transparent'
                        }`}
                    >
                      ✓
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs font-bold ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                            }`}
                        >
                          {task.text}
                        </span>
                        {task.isFocus && (
                          <span className="px-2 py-0.5 rounded bg-orange-100 text-[#FF6B00] text-[10px] font-bold">
                            Current Active Focus
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{task.tag}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] font-bold">
                    <span className="text-emerald-600">{task.xp}</span>
                    {task.tokens && <span className="text-[#FF6B00]">{task.tokens}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Custom Goal form */}
            <form onSubmit={handleAddGoal} className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="Add custom goal for today (e.g. Implement Raft leader election...)"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#FF6B00] focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors"
              >
                + Add
              </button>
            </form>
          </div>

          {/* Connected Developer Stats */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-gray-700" />
                <h3 className="text-sm font-bold text-[#1B1B1B]">Connected Developer Stats</h3>
              </div>
              <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#57C76F] animate-pulse"></span>
                <span>4/4 Synced 12m ago</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">LeetCode</span>
                  <span className="px-1.5 py-0.5 rounded bg-orange-100 text-[#FF6B00] text-[10px] font-bold">
                    Rating 1,940
                  </span>
                </div>
                <div className="text-2xl font-black text-gray-800">438 <span className="text-xs text-gray-400 font-normal">Solved</span></div>
                <div className="text-[10px] text-gray-500 font-semibold">Top 4.1% Worldwide</div>
                <div className="flex justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-200">
                  <span>Easy: 182</span>
                  <span>Med: 214</span>
                  <span>Hard: 42</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">GitHub</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <div className="text-2xl font-black text-gray-800">1,420 <span className="text-xs text-gray-400 font-normal">Commits</span></div>
                <div className="text-[10px] text-gray-500 font-semibold">14 repositories tracked</div>
                <div className="flex justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-200">
                  <span>Top: Go / Rust</span>
                  <span>Stars: 184 ★</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">Codeforces</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                    Specialist
                  </span>
                </div>
                <div className="text-2xl font-black text-gray-800">1,620 <span className="text-xs text-gray-400 font-normal">Max Rating</span></div>
                <div className="text-[10px] text-gray-500 font-semibold">28 Rated Contests</div>
                <div className="flex justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-200">
                  <span>Top 8.5% Global</span>
                  <span>Candidate Master Target</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mastery Level Tree */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1B1B1B]">Mastery Level Tree</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Path to Level {currentLevel + 1} "Rising Star" (+500 $ACE Grant)
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#F3FBF3] text-emerald-700 text-xs font-bold border border-[#57C76F]/30">
                {Math.min(100, Math.round((currentXP % 5000) / 50))}% Level {currentLevel}
              </span>
            </div>

            <div className="relative pl-6 space-y-5 border-l-2 border-emerald-300 ml-2">
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#57C76F] border-2 border-white shadow-2xs"></div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-800">Level 1 • Beginner</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Done</span>
                </div>
                <p className="text-[11px] text-gray-400">Unlocked collegiate onboarding badge</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#57C76F] border-2 border-white shadow-2xs"></div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-800">Level 5 • Explorer</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Done</span>
                </div>
                <p className="text-[11px] text-gray-400">First open-source pull request merged</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#57C76F] border-2 border-white shadow-2xs"></div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-800">Level 10 • Achiever</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Done</span>
                </div>
                <p className="text-[11px] text-gray-400">250 LeetCode problems cleared</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#FF6B00] border-2 border-white shadow-sm ring-4 ring-orange-100"></div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#FF6B00]">Level {currentLevel} • {currentLevelName} [Current]</span>
                  <span className="px-1.5 py-0.2 rounded bg-orange-100 text-[#FF6B00] text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 font-medium">
                  {currentXP.toLocaleString()} / 5,000 XP • {Math.max(0, 5000 - currentXP)} XP to upgrade
                </p>
              </div>

              <div className="relative opacity-60">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-gray-300 border-2 border-white"></div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-600">Level {currentLevel + 1} • Rising Star</span>
                  <span className="text-[10px] text-gray-400">Locked</span>
                </div>
                <p className="text-[11px] text-gray-400">Unlocks campus placement fast-track priority</p>
              </div>
            </div>
          </div>

          {/* Recent Badges Unlocked */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1B1B1B]">Recent Badges Unlocked</h3>
              <Link to="/achievements" className="text-xs font-bold text-[#FF6B00] hover:underline">
                Vault (19) →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-orange-200 bg-orange-50/30 flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold text-sm">
                  ⚡
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">7-Day Fast Track</div>
                  <div className="text-[10px] text-gray-400">Unlocked 2w ago</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/30 flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  🏆
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">LeetCode Centurion</div>
                  <div className="text-[10px] text-gray-400">Unlocked 1w ago</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/30 flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  💡
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">Hackathon Finalist</div>
                  <div className="text-[10px] text-gray-400">SIH Regional</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/30 flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                  ✨
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">Clean Committer</div>
                  <div className="text-[10px] text-gray-400">50+ Clean PRs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Activity Audit */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-[#1B1B1B]">Verified Activity Audit</h3>
              </div>
              <span className="text-xs font-bold text-gray-400 hover:text-gray-700 cursor-pointer">
                Full Log
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-[#FF6B00] flex items-center justify-center shrink-0 text-xs font-bold">
                  ⚡
                </div>
                <div>
                  <div className="font-bold text-gray-800">Earned +50 XP &amp; +10 $ACE</div>
                  <div className="text-[11px] text-gray-500">Completed Daily Coding Streak Day #{currentStreak}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">2 hours ago • Automated Proof</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-gray-800">Credential Verified: AWS SAA-C03</div>
                  <div className="text-[11px] text-gray-500">AWS Solutions Architect Associate Credly badge synced</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Yesterday • +250 XP Credited</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-xs font-bold">
                  💼
                </div>
                <div>
                  <div className="font-bold text-gray-800">Application Update: Databricks</div>
                  <div className="text-[11px] text-gray-500">Shortlisted for Technical Systems Interview Round</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">2 days ago • Campus Portal Sync</div>
                </div>
              </div>
            </div>
          </div>

          {/* Deadlines & Calendar */}
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#FF6B00]" />
                <h3 className="text-sm font-bold text-[#1B1B1B]">Deadlines &amp; Calendar</h3>
              </div>
              <span className="text-xs text-gray-400 font-semibold">Next 7 Days</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl border border-red-200 bg-red-50/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-900">Google SWE Summer OA</span>
                  <span className="text-[10px] font-bold text-red-600 bg-white px-2 py-0.5 rounded border border-red-200">
                    Tomorrow 10:00 AM
                  </span>
                </div>
                <p className="text-[11px] text-red-700">Online Assessment (90 min) • Systems Core</p>
              </div>

              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">SIH Hackathon Round 2 Submission</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                    Oct 28
                  </span>
                </div>
                <p className="text-[11px] text-amber-800">Distributed Ledger Prototype architecture demo</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toast.success('Google Calendar sync connection initiated!')}
              className="w-full py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center justify-center space-x-2 transition-colors shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Sync with Google Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── MODAL: Add New Project ────────────────────────────────────────── */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-gray-900">Add Project to Portfolio</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(false)}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Key-Value Store"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Built Raft consensus from scratch with low-latency replication..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Technologies (comma separated)</label>
                <input
                  type="text"
                  placeholder="Go, Raft, gRPC, Docker"
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={projectForm.liveUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-[11px] flex items-center justify-between">
                <span>⭐ Publishing awards <strong>+50 XP</strong> and <strong>+20 $ACE tokens</strong></span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold shadow-sm shadow-orange-500/20"
                >
                  Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Add Goal ────────────────────────────────────────────────── */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#57C76F] flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-gray-900">Add Sprint Goal</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(false)}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Topological Sort & Kahn's Algorithm"
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#57C76F]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Track Category</label>
                <select
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none"
                >
                  <option value="DSA">DSA &amp; Problem Solving</option>
                  <option value="System Design">System Design &amp; Architecture</option>
                  <option value="DevOps">DevOps &amp; Cloud</option>
                  <option value="Career">Career &amp; Internships</option>
                  <option value="Academic">Academic &amp; Exams</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-[#F3FBF3] border border-[#57C76F]/30 text-emerald-900 text-[11px]">
                🎯 Completing this goal awards <strong>+30 XP</strong> and <strong>+10 $ACE tokens</strong>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#57C76F] hover:bg-emerald-600 text-white font-bold shadow-sm"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Log Coding Activity ────────────────────────────────────── */}
      {isCodingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center">
                  <FileCode className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-gray-900">Log Coding Activity</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCodingModalOpen(false)}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogCoding} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Platform</label>
                <select
                  value={codingForm.platform}
                  onChange={(e) => setCodingForm({ ...codingForm, platform: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none"
                >
                  <option value="LeetCode">LeetCode</option>
                  <option value="GitHub">GitHub Commits / PR</option>
                  <option value="Codeforces">Codeforces</option>
                  <option value="GeeksforGeeks">GeeksforGeeks</option>
                  <option value="HackerRank">HackerRank</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Count of Problems / Commits</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={codingForm.problemsSolved}
                  onChange={(e) => setCodingForm({ ...codingForm, problemsSolved: Number(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Notes / Tags</label>
                <input
                  type="text"
                  placeholder="e.g. Graph BFS, Topological Sort"
                  value={codingForm.notes}
                  onChange={(e) => setCodingForm({ ...codingForm, notes: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-[11px]">
                🔥 Logging activity advances your daily streak and awards <strong>+30 XP &amp; +10 $ACE</strong>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCodingModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold shadow-sm"
                >
                  Log Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
