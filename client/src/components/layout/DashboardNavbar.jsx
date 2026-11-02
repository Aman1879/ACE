import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Flame,
  Coins,
  CheckCheck,
  ExternalLink,
  User as UserIcon,
  Settings,
  LogOut,
  Search,
  Star,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import {
  getNotifications,
  markRead,
  markAllRead,
  getUnreadCount,
} from '../../services/notificationService';
import { formatRelativeTime } from '../../utils/formatters';

export default function DashboardNavbar({ onMobileToggle, collapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    fetchUnread();
  }, []);

  const fetchUnread = async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.data.count || 0);
    } catch {
      // ignore
    }
  };

  const handleOpenNotif = async () => {
    const next = !showNotifDropdown;
    setShowNotifDropdown(next);
    setShowUserDropdown(false);
    if (next) {
      try {
        const res = await getNotifications({ limit: 6 });
        const notifs = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
        setNotifications(notifs);
      } catch {
        // ignore
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // ignore
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await markRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        // ignore
      }
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-white border-b border-[#EAEAEA] flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ${
        collapsed ? 'left-0 md:left-20' : 'left-0 md:left-64'
      }`}
    >
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onMobileToggle}
          className="md:hidden p-2 rounded-xl text-[#1B1B1B] hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search projects, verified credentials..."
            className="w-full h-9 pl-9 pr-4 bg-[#FFFDF8] border border-[#EAEAEA] rounded-xl text-xs text-[#1B1B1B] placeholder-[#6B7280] focus:outline-none focus:border-[#FF6B00] transition-colors"
          />
        </div>
      </div>

      {/* Right: Gamification Badges, Notifications, Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Streak Pill */}
        <Link
          to="/streak"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF1E6] border border-[#FFD9B3] text-xs font-bold text-[#FF6B00] hover:scale-105 transition-transform"
          title="Daily Streak"
        >
          <Flame className="w-3.5 h-3.5 fill-[#FF6B00]" />
          <span>{(user?.streak !== undefined ? user.streak : 1)} {(user?.streak === 1 ? 'Day' : 'Days')} Streak</span>
        </Link>

        {/* Token Balance Pill */}
        <Link
          to="/store"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF1E6] border border-[#FFD9B3] text-xs font-bold text-[#FF6B00] hover:scale-105 transition-transform"
          title="ACE Tokens Balance"
        >
          <Coins className="w-3.5 h-3.5 text-[#FF6B00]" />
          <span>{(user?.tokenBalance !== undefined ? user.tokenBalance : 50).toLocaleString()} Tokens</span>
        </Link>

        {/* Level Badge Pill */}
        <Link
          to="/streak"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3FBF3] border border-[#D4F0DA] text-xs font-bold text-[#57C76F] hover:scale-105 transition-transform"
          title="XP Level"
        >
          <Star className="w-3.5 h-3.5 fill-[#57C76F]" />
          <span>Level {user?.level || 1} • {(user?.xp !== undefined ? user.xp : 100).toLocaleString()} XP</span>
        </Link>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={handleOpenNotif}
            className="relative p-2 rounded-xl text-[#6B7280] hover:text-[#1B1B1B] hover:bg-gray-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#FF6B00] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#EAEAEA] p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA] mb-3">
                <h4 className="text-sm font-bold text-[#1B1B1B]">Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-semibold text-[#57C76F] hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-center text-[#6B7280] py-6">
                    No notifications yet.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        n.isRead
                          ? 'bg-white border-[#EAEAEA] opacity-80'
                          : 'bg-[#FFF1E6]/40 border-[#FFD9B3]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-[#1B1B1B]">{n.title}</span>
                        <span className="text-[10px] text-[#6B7280]">
                          {formatRelativeTime(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-[#6B7280] leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Pill with Institution */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifDropdown(false);
            }}
            className="flex items-center gap-2 p-1 pl-2 rounded-full border border-[#EAEAEA] bg-white hover:border-[#FF6B00]/40 transition-all text-left"
          >
            <div className="hidden lg:block pr-1">
              <p className="text-[11px] font-bold text-[#1B1B1B] leading-tight">
                {user?.name || 'Student'} <span className="text-[10px] font-semibold text-[#FF6B00]">({user?.role === 'admin' ? 'Admin' : 'Student'})</span>
              </p>
              <p className="text-[9px] text-[#6B7280] leading-none">
                {user?.college || user?.profile?.college || 'Collegiate Track'} • {user?.branch || user?.profile?.branch || 'CS'}
              </p>
            </div>
            <Avatar name={user?.name || 'Student'} size="sm" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#EAEAEA] py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-[#EAEAEA] mb-1">
                <p className="text-xs font-bold text-[#1B1B1B] truncate">{user?.name}</p>
                <p className="text-[11px] text-[#6B7280] truncate">@{user?.username || 'aman-kumar'}</p>
              </div>

              <Link
                to="/dashboard/profile"
                onClick={() => setShowUserDropdown(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1B1B1B] hover:bg-[#FFF1E6] hover:text-[#FF6B00] transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                My Profile
              </Link>

              <Link
                to={`/u/${user?.username || 'aman-kumar'}`}
                target="_blank"
                onClick={() => setShowUserDropdown(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1B1B1B] hover:bg-[#F3FBF3] hover:text-[#57C76F] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Public Portfolio
              </Link>

              <Link
                to="/dashboard/settings"
                onClick={() => setShowUserDropdown(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1B1B1B] hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>

              <div className="border-t border-[#EAEAEA] my-1" />

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
