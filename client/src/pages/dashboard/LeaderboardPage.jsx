import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../../services/leaderboardService';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/common/Avatar';
import { Trophy, Flame, FolderOpen, Star, Crown, Medal } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [rankingType, setRankingType] = useState('xp'); // 'xp', 'streak', 'projects'
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings();
  }, [rankingType]);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const res = await getLeaderboard({ type: rankingType, limit: 30 });
      const items = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setLeaderboard(items);
    } catch {
      toast.error('Failed to load leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Student Leaderboard</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Celebrate active learners across the ACE network. Only students with public profiles are
            ranked.
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center bg-white border border-[#EAEAEA] rounded-2xl p-1 shadow-xs">
          {[
            { id: 'xp', label: 'Top Experience', icon: Star },
            { id: 'streak', label: 'Longest Streaks', icon: Flame },
            { id: 'projects', label: 'Most Projects', icon: FolderOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setRankingType(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  rankingType === tab.id
                    ? 'bg-[#FF6B00] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#1B1B1B]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 3 Podium (if >= 3 users) */}
      {!loading && leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 pb-2">
          {/* #2 */}
          <div className="card text-center p-6 flex flex-col items-center justify-center order-2 md:order-1 border-gray-200">
            <span className="text-xs font-extrabold text-gray-500 uppercase mb-2">2nd Place</span>
            <div className="relative mb-3">
              <Avatar name={leaderboard[1].name} src={leaderboard[1].avatar} size="lg" />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-300 text-gray-800 text-xs font-black flex items-center justify-center border-2 border-white">
                2
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#1B1B1B]">{leaderboard[1].name}</h4>
            <p className="text-xs text-[#6B7280]">{leaderboard[1].college || 'Scholar'}</p>
            <div className="mt-3 px-3 py-1 rounded-full bg-gray-100 text-xs font-extrabold text-gray-800">
              {leaderboard[1].scoreLabel}
            </div>
          </div>

          {/* #1 Winner */}
          <div className="card text-center p-6 sm:p-8 flex flex-col items-center justify-center order-1 md:order-2 border-[#FF6B00]/40 shadow-card bg-gradient-to-b from-[#FFF1E6]/50 to-white">
            <div className="flex items-center gap-1 text-xs font-extrabold text-[#FF6B00] uppercase mb-2">
              <Crown className="w-4 h-4 text-[#FF6B00] fill-[#FF6B00]" />
              Rank #1 Leader
            </div>
            <div className="relative mb-3">
              <Avatar name={leaderboard[0].name} src={leaderboard[0].avatar} size="xl" />
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#FF6B00] text-white text-xs font-black flex items-center justify-center border-2 border-white">
                1
              </span>
            </div>
            <h4 className="text-base font-extrabold text-[#1B1B1B]">{leaderboard[0].name}</h4>
            <p className="text-xs text-[#6B7280]">{leaderboard[0].college || 'Scholar'}</p>
            <div className="mt-3 px-4 py-1.5 rounded-full bg-[#FF6B00] text-white text-xs font-extrabold shadow-orange">
              {leaderboard[0].scoreLabel}
            </div>
          </div>

          {/* #3 */}
          <div className="card text-center p-6 flex flex-col items-center justify-center order-3 md:order-3 border-gray-200">
            <span className="text-xs font-extrabold text-amber-600 uppercase mb-2">3rd Place</span>
            <div className="relative mb-3">
              <Avatar name={leaderboard[2].name} src={leaderboard[2].avatar} size="lg" />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-200 text-amber-900 text-xs font-black flex items-center justify-center border-2 border-white">
                3
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#1B1B1B]">{leaderboard[2].name}</h4>
            <p className="text-xs text-[#6B7280]">{leaderboard[2].college || 'Scholar'}</p>
            <div className="mt-3 px-3 py-1 rounded-full bg-amber-50 text-xs font-extrabold text-amber-800">
              {leaderboard[2].scoreLabel}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table List */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#6B7280]">Loading ranking table...</div>
        ) : leaderboard.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6B7280]">
            No public profiles ranked yet. Make your profile public to appear here!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFDF8] border-b border-[#EAEAEA] text-[#6B7280] uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4 w-16 text-center">Rank</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">College</th>
                  <th className="p-4">Level</th>
                  <th className="p-4 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {leaderboard.map((item) => {
                  const isCurrent = item.userId === user?._id;
                  return (
                    <tr
                      key={item.rank}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-[#FFF1E6]/40 font-bold border-l-4 border-l-[#FF6B00]'
                          : 'hover:bg-gray-50/50'
                      }`}
                    >
                      <td className="p-4 text-center">
                        <span
                          className={`w-7 h-7 inline-flex items-center justify-center rounded-full text-xs font-extrabold ${
                            item.rank === 1
                              ? 'bg-[#FF6B00] text-white'
                              : item.rank === 2
                              ? 'bg-gray-300 text-gray-800'
                              : item.rank === 3
                              ? 'bg-amber-200 text-amber-900'
                              : 'text-[#6B7280]'
                          }`}
                        >
                          {item.rank}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={item.name} src={item.avatar} size="sm" />
                          <div>
                            <span className="font-bold text-[#1B1B1B] text-sm block">
                              {item.name}
                              {isCurrent && (
                                <span className="ml-2 text-[10px] font-extrabold text-[#FF6B00] bg-[#FFF1E6] px-2 py-0.5 rounded-full">
                                  YOU
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] text-[#6B7280]">@{item.username}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-[#6B7280] font-medium">{item.college || '—'}</td>

                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F3FBF3] text-[#57C76F] font-bold text-[11px]">
                          Lvl {item.level || 1}
                        </span>
                      </td>

                      <td className="p-4 text-right font-extrabold text-sm text-[#FF6B00]">
                        {item.scoreLabel}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

