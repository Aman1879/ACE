import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

const safeDate = (date) => {
  if (!date) return null;
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  return isValid(d) ? d : null;
};

export const formatDate = (date, fmt = 'MMM d, yyyy') => {
  const d = safeDate(date);
  if (!d) return 'N/A';
  try { return format(d, fmt); } catch { return 'N/A'; }
};

export const formatRelativeTime = (date) => {
  const d = safeDate(date);
  if (!d) return '';
  try { return formatDistanceToNow(d, { addSuffix: true }); } catch { return ''; }
};

export const formatNumber = (n) => {
  if (n === null || n === undefined) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

export const getInitials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('') || '?';

export const truncate = (str, n = 80) =>
  str && str.length > n ? str.slice(0, n) + '…' : str || '';

export const getLevelInfo = (xp = 0, levels = []) => {
  let current = levels[0] || { level: 1, name: 'Beginner', minXP: 0, maxXP: 100 };
  for (const lvl of levels) {
    if (xp >= lvl.minXP) current = lvl;
    else break;
  }
  const next = levels.find((l) => l.level === current.level + 1);
  const range = next ? next.minXP - current.minXP : 1;
  const earned = xp - current.minXP;
  const progress = next ? Math.min(100, Math.round((earned / range) * 100)) : 100;
  return {
    current,
    next,
    progress,
    xpToNext: next ? Math.max(0, next.minXP - xp) : 0,
  };
};

export const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const formatTokens = (n = 0) => `${formatNumber(n)} Tokens`;

export const getProfileCompletionPercent = (user, profile) => {
  const fields = [
    profile?.avatar,
    profile?.bio,
    profile?.college,
    profile?.degree,
    profile?.branch,
    profile?.graduationYear,
    profile?.github,
    profile?.linkedin,
    profile?.skills?.length > 0,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
};

export const slugify = (str = '') =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

