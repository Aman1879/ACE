import React, { useState, useEffect } from 'react';
import { getStreak } from '../../services/streakService';
import { getBadges, getTransactions } from '../../services/gamificationService';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import ProgressBar from '../../components/common/ProgressBar';
import {
  Flame,
  Trophy,
  Star,
  Coins,
  Calendar,
  Lock,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { STREAK_MILESTONES, XP_LEVELS } from '../../utils/constants';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function StreakPage() {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState(null);
  const [badges, setBadges] = useState([]);
  const [transactions, setTransactions] = useState({ xp: [], tokens: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreakCenter();
  }, []);

  const fetchStreakCenter = async () => {
    try {
      setLoading(true);
      const [sRes, bRes, tRes] = await Promise.all([
        getStreak(),
        getBadges(),
        getTransactions(),
      ]);
      setStreakData(sRes.data?.data || sRes.data || {});
      setBadges(
        Array.isArray(bRes.data?.data)
          ? bRes.data.data
          : Array.isArray(bRes.data)
          ? bRes.data
          : []
      );
      setTransactions(tRes.data?.data || tRes.data || { xp: [], tokens: [] });
    } catch {
      toast.error('Failed to load gamification center data.');
    } finally {
      setLoading(false);
    }
  };

  const currentStreak = streakData?.currentStreak || 0;
  const longestStreak = streakData?.longestStreak || 0;
  const totalActiveDays = streakData?.totalActiveDays || 0;

  // Next milestone calculation
  const nextMilestone = STREAK_MILESTONES.find((m) => m > currentStreak) || 400;
  const milestoneProgress = Math.min(100, Math.round((currentStreak / nextMilestone) * 100));

  // Heatmap generator (simulated 52 weeks or real activity log)
  const activityDates = new Set(
    (streakData?.activityLog || []).map((item) => item.date)
  );

  // Generate last 180 days for clean UI
  const daysArray = [];
  const today = new Date();
  for (let i = 180; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const hasActivity = activityDates.has(dateStr);
    daysArray.push({ date: dateStr, active: hasActivity });
  }

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Streak & Rewards</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Build unshakeable daily habits. Consistency rewards you with XP, badges, and ACE Tokens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#FFF1E6] text-xs font-bold text-[#FF6B00] border border-[#FFD9B3]">
            Server Verified Consistency
          </span>
        </div>
      </div>

      {/* Main Streak Banner */}
      <div className="bg-gradient-to-r from-[#FFF1E6] via-white to-[#F3FBF3] border border-[#EAEAEA] rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#FF6B00] text-white flex items-center justify-center shadow-orange flex-shrink-0 animate-pulse-soft">
            <Flame className="w-12 h-12 fill-white" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-[#FF6B00] uppercase tracking-wider">
              Current Consistency
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#1B1B1B] mt-1">
              {currentStreak} <span className="text-2xl font-bold text-[#6B7280]">Days Streak</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Personal Record: <strong className="text-[#1B1B1B]">{longestStreak} Days</strong> · Total
              Active Days: <strong className="text-[#57C76F]">{totalActiveDays}</strong>
            </p>
          </div>
        </div>

        {/* Milestone Progress */}
        <div className="w-full md:w-72 bg-white rounded-2xl p-5 border border-[#EAEAEA] shadow-sm">
          <div className="flex justify-between items-center text-xs font-bold mb-2">
            <span className="text-[#1B1B1B]">Next Milestone</span>
            <span className="text-[#FF6B00]">{nextMilestone} Days</span>
          </div>
          <ProgressBar progress={milestoneProgress} color="bg-[#FF6B00]" height="h-3" />
          <p className="text-[11px] text-[#6B7280] mt-2">
            {nextMilestone - currentStreak} days to unlock the {nextMilestone}-Day Champion Badge!
          </p>
        </div>
      </div>

      {/* Contribution Calendar Heatmap */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-[#1B1B1B]">Activity Calendar Heatmap</h3>
            <p className="text-xs text-[#6B7280]">
              Each colored square represents verified academic or coding actions on that calendar day.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <span>Less</span>
            <div className="w-3 h-3 rounded-xs bg-[#EAEAEA]" />
            <div className="w-3 h-3 rounded-xs bg-[#D4F0DA]" />
            <div className="w-3 h-3 rounded-xs bg-[#57C76F]" />
            <div className="w-3 h-3 rounded-xs bg-[#2E7F40]" />
            <span>More</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1.5 min-w-[700px]">
            {daysArray.map((day, idx) => (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-xs transition-transform hover:scale-125 cursor-pointer ${
                  day.active
                    ? 'bg-[#57C76F] hover:ring-2 hover:ring-[#57C76F]/50'
                    : 'bg-[#EAEAEA] hover:bg-gray-300'
                }`}
                title={`${day.date}: ${day.active ? 'Activity recorded' : 'No activity'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EAEAEA]">
          <div>
            <h3 className="text-lg font-bold text-[#1B1B1B]">Badges & Achievements Collection</h3>
            <p className="text-xs text-[#6B7280]">
              Unlocked: {badges.filter((b) => b.isUnlocked).length} of {badges.length}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#F3FBF3] text-xs font-bold text-[#57C76F]">
            Automatic Unlock
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {badges.map((b) => (
            <div
              key={b._id}
              className={`p-4 rounded-2xl border text-center transition-all ${
                b.isUnlocked
                  ? 'bg-white border-[#57C76F]/40 shadow-sm'
                  : 'bg-gray-50/70 border-gray-200 opacity-60'
              }`}
            >
              <div
                className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-3 ${
                  b.isUnlocked ? 'bg-[#F3FBF3]' : 'bg-gray-200 grayscale'
                }`}
              >
                {b.isUnlocked ? b.icon || '🏆' : <Lock className="w-5 h-5 text-gray-500" />}
              </div>
              <h4 className="text-xs font-bold text-[#1B1B1B] truncate">{b.name}</h4>
              <p className="text-[10px] text-[#6B7280] line-clamp-2 mt-1">{b.description}</p>
              {b.isUnlocked && b.earnedAt && (
                <span className="text-[9px] font-semibold text-[#57C76F] block mt-2">
                  Unlocked {formatDate(b.earnedAt)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Ledger History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Ledger */}
        <div className="card p-5">
          <h4 className="text-sm font-bold text-[#1B1B1B] mb-3">Recent XP Ledger</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {transactions.xp?.length > 0 ? (
              transactions.xp.map((tx) => (
                <div
                  key={tx._id}
                  className="p-2.5 rounded-xl bg-[#FFFDF8] border border-[#EAEAEA] flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-[#1B1B1B]">{tx.description}</span>
                  <div className="text-right">
                    <span className="font-bold text-[#57C76F]">+{tx.amount} XP</span>
                    <span className="text-[10px] text-[#6B7280] block">
                      {formatRelativeTime(tx.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#6B7280] py-4 text-center">No transactions recorded yet.</p>
            )}
          </div>
        </div>

        {/* Token Ledger */}
        <div className="card p-5">
          <h4 className="text-sm font-bold text-[#1B1B1B] mb-3">Recent Token Transactions</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {transactions.tokens?.length > 0 ? (
              transactions.tokens.map((tx) => (
                <div
                  key={tx._id}
                  className="p-2.5 rounded-xl bg-[#FFFDF8] border border-[#EAEAEA] flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-[#1B1B1B]">{tx.reason}</span>
                  <div className="text-right">
                    <span
                      className={`font-bold ${
                        tx.type === 'earned' ? 'text-[#FF6B00]' : 'text-red-500'
                      }`}
                    >
                      {tx.type === 'earned' ? `+${tx.amount}` : `-${tx.amount}`} Tokens
                    </span>
                    <span className="text-[10px] text-[#6B7280] block">
                      {formatRelativeTime(tx.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#6B7280] py-4 text-center">No token transactions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

