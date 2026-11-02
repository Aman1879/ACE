// XP Level thresholds
export const XP_LEVELS = [
  { level: 1,  name: 'Beginner',    minXP: 0,     maxXP: 100 },
  { level: 2,  name: 'Curious',     minXP: 100,   maxXP: 300 },
  { level: 3,  name: 'Learner',     minXP: 300,   maxXP: 600 },
  { level: 4,  name: 'Coder',       minXP: 600,   maxXP: 1000 },
  { level: 5,  name: 'Explorer',    minXP: 1000,  maxXP: 1500 },
  { level: 6,  name: 'Builder',     minXP: 1500,  maxXP: 2200 },
  { level: 7,  name: 'Creator',     minXP: 2200,  maxXP: 3000 },
  { level: 8,  name: 'Developer',   minXP: 3000,  maxXP: 4000 },
  { level: 9,  name: 'Innovator',   minXP: 4000,  maxXP: 5500 },
  { level: 10, name: 'Achiever',    minXP: 5500,  maxXP: 7500 },
  { level: 11, name: 'Specialist',  minXP: 7500,  maxXP: 10000 },
  { level: 12, name: 'Expert',      minXP: 10000, maxXP: 13000 },
  { level: 13, name: 'Master',      minXP: 13000, maxXP: 17000 },
  { level: 14, name: 'Legend',      minXP: 17000, maxXP: 22000 },
  { level: 15, name: 'Rising Star', minXP: 22000, maxXP: 28000 },
  { level: 16, name: 'Visionary',   minXP: 28000, maxXP: 35000 },
  { level: 17, name: 'Elite',       minXP: 35000, maxXP: 43000 },
  { level: 18, name: 'Prodigy',     minXP: 43000, maxXP: 52000 },
  { level: 19, name: 'Genius',      minXP: 52000, maxXP: 62000 },
  { level: 20, name: 'Pro Learner', minXP: 62000, maxXP: Infinity },
];

export const STREAK_MILESTONES = [7, 30, 50, 100, 200, 400];

export const SKILL_CATEGORIES = [
  'Programming Language',
  'Frontend',
  'Backend',
  'Database',
  'Tool',
  'Framework',
  'Soft Skill',
  'Other',
];

export const PROJECT_CATEGORIES = [
  'Web', 'Mobile', 'AI/ML', 'Data Science',
  'Blockchain', 'IoT', 'Game', 'Desktop', 'API', 'Other',
];

export const PROJECT_STATUSES = ['In Progress', 'Completed', 'On Hold', 'Planned'];

export const CERTIFICATE_CATEGORIES = [
  'Technical', 'Professional', 'Academic', 'Language', 'Other',
];

export const ACHIEVEMENT_CATEGORIES = [
  'Hackathon', 'Competition', 'Academic', 'Award',
  'Scholarship', 'Leadership', 'Research', 'Sports', 'Other',
];

export const CODING_PLATFORMS = [
  'LeetCode', 'GeeksforGeeks', 'HackerRank',
  'CodeChef', 'Codeforces', 'GitHub', 'Other',
];

export const GOAL_CATEGORIES = [
  'Coding', 'Projects', 'Certificates', 'Skills',
  'Career', 'Health', 'Learning', 'Other',
];

export const GOAL_TYPES = ['Daily', 'Weekly', 'Monthly', 'Long-term'];

export const GOAL_PRIORITIES = ['Low', 'Medium', 'High'];

export const PLACEMENT_STATUSES = [
  'Saved', 'Applied', 'Online Assessment',
  'Technical Interview', 'HR Interview',
  'Selected', 'Rejected', 'Offer Received',
];

export const INTERNSHIP_STATUSES = [
  'Interested', 'Applied', 'Assessment',
  'Interview', 'Selected', 'Rejected', 'Completed',
];

export const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export const LEARNING_STATUSES = ['Learning', 'Practicing', 'Confident', 'Expert'];

export const NOTE_COLORS = [
  '#FFFFFF', '#FFF1E6', '#F3FBF3', '#EFF6FF',
  '#FEF3C7', '#FCE7F3',
];

export const NOTE_CATEGORIES = [
  'Study', 'Career', 'Project', 'Interview', 'General', 'Other',
];

export const DASHBOARD_NAV = [
  { path: '/dashboard',              label: 'Overview',          icon: 'LayoutDashboard', end: true },
  { path: '/dashboard/profile',      label: 'My Profile',        icon: 'User' },
  { path: '/dashboard/projects',     label: 'Projects',          icon: 'FolderOpen' },
  { path: '/dashboard/certificates', label: 'Certificates',      icon: 'Award' },
  { path: '/dashboard/achievements', label: 'Achievements',      icon: 'Trophy' },
  { path: '/dashboard/coding',       label: 'Coding Tracker',    icon: 'Code2' },
  { path: '/dashboard/skills',       label: 'Skills',            icon: 'Zap' },
  { path: '/dashboard/resume',       label: 'Resume Builder',    icon: 'FileText' },
  { path: '/dashboard/portfolio',    label: 'Portfolio',         icon: 'Globe' },
  { path: '/dashboard/internships',  label: 'Internships',       icon: 'Briefcase' },
  { path: '/dashboard/placements',   label: 'Placements',        icon: 'Target' },
  { path: '/dashboard/goals',        label: 'Goals & Tasks',     icon: 'CheckSquare' },
  { path: '/dashboard/notes',        label: 'Notes',             icon: 'StickyNote' },
  { path: '/dashboard/streak',       label: 'Streak & Rewards',  icon: 'Flame' },
  { path: '/dashboard/store',        label: 'ACE Store',         icon: 'ShoppingBag' },
  { path: '/dashboard/leaderboard',  label: 'Leaderboard',       icon: 'BarChart2' },
  { path: '/dashboard/settings',     label: 'Settings',          icon: 'Settings' },
];

export const PLATFORM_COLORS = {
  LeetCode:      { bg: '#FFF7ED', color: '#EA580C', icon: '🧩' },
  GeeksforGeeks: { bg: '#F0FDF4', color: '#16A34A', icon: '🌿' },
  HackerRank:    { bg: '#F0FDF4', color: '#15803D', icon: '🏆' },
  CodeChef:      { bg: '#FFF7ED', color: '#C2410C', icon: '👨‍🍳' },
  Codeforces:    { bg: '#EFF6FF', color: '#2563EB', icon: '⚡' },
  GitHub:        { bg: '#F9FAFB', color: '#111827', icon: '🐙' },
  Other:         { bg: '#F5F3FF', color: '#7C3AED', icon: '💻' },
};

export const STATUS_COLORS = {
  // Placement
  Saved:                { bg: '#F9FAFB',  text: '#6B7280' },
  Applied:              { bg: '#EFF6FF',  text: '#2563EB' },
  'Online Assessment':  { bg: '#FFF7ED',  text: '#C2410C' },
  'Technical Interview':{ bg: '#FEF9C3',  text: '#92400E' },
  'HR Interview':       { bg: '#F5F3FF',  text: '#6D28D9' },
  Selected:             { bg: '#F0FDF4',  text: '#15803D' },
  'Offer Received':     { bg: '#F0FDF4',  text: '#15803D' },
  Rejected:             { bg: '#FEF2F2',  text: '#DC2626' },
  // Internship
  Interested:           { bg: '#EFF6FF',  text: '#2563EB' },
  Assessment:           { bg: '#FFF7ED',  text: '#C2410C' },
  Interview:            { bg: '#F5F3FF',  text: '#6D28D9' },
  Completed:            { bg: '#F0FDF4',  text: '#15803D' },
  // Project
  'In Progress':        { bg: '#EFF6FF',  text: '#2563EB' },
  'On Hold':            { bg: '#FEF9C3',  text: '#92400E' },
  Planned:              { bg: '#F5F3FF',  text: '#6D28D9' },
  // Goal
  Pending:              { bg: '#FFF7ED',  text: '#C2410C' },
  'In Progress':        { bg: '#EFF6FF',  text: '#2563EB' },
};

export const PRIORITY_COLORS = {
  Low:    { bg: '#F0FDF4', text: '#15803D' },
  Medium: { bg: '#FFF7ED', text: '#C2410C' },
  High:   { bg: '#FEF2F2', text: '#DC2626' },
};

