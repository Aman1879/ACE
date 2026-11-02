import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FolderOpen,
  Award,
  Trophy,
  Code2,
  Zap,
  FileText,
  Globe,
  Briefcase,
  Target,
  CheckSquare,
  Flame,
  ShoppingBag,
  BarChart2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-[#EAEAEA] flex flex-col transition-all duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Header & Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#EAEAEA]">
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-extrabold text-lg shadow-sm flex-shrink-0">
              A
            </div>
            {!collapsed && (
              <div>
                <span className="font-extrabold text-base text-[#1B1B1B] tracking-tight block">
                  ACE
                </span>
                <span className="text-[9px] font-bold text-[#6B7280] tracking-wider uppercase block -mt-1">
                  Academic & Career Engine
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={onToggle}
            className="hidden md:flex p-1.5 rounded-lg text-[#6B7280] hover:text-[#1B1B1B] hover:bg-gray-100 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Student Verified Status Pill */}
        {!collapsed && (
          <div className="px-4 py-2.5 mx-3 mt-3 bg-[#F3FBF3] rounded-xl border border-[#D4F0DA] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-[#57C76F] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Student Verified</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#57C76F] text-white text-[9px] font-bold">
              Active Hub
            </span>
          </div>
        )}

        {/* Navigation Section Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 hide-scrollbar">
          {/* Group 1: CORE TRACKS */}
          <div>
            {!collapsed && (
              <span className="px-3 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase block mb-1">
                Core Tracks
              </span>
            )}
            <div className="space-y-0.5">
              <NavLink
                to="/dashboard"
                end
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? '!bg-[#FF6B00] !text-white font-bold shadow-sm' : ''}`
                }
              >
                <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>Overview</span>}
              </NavLink>
              <NavLink
                to="/dashboard/profile"
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <User className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>My Profile</span>}
              </NavLink>
              <NavLink
                to="/dashboard/projects"
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <FolderOpen className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>Projects</span>}
              </NavLink>
              <NavLink
                to="/dashboard/certificates"
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <Award className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>Certificates</span>}
              </NavLink>
              <NavLink
                to="/dashboard/achievements"
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <Trophy className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>Achievements</span>}
              </NavLink>
            </div>
          </div>

          {/* Group 2: ENGINEERING & SKILLS */}
          <div>
            {!collapsed && (
              <span className="px-3 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase block mb-1">
                Engineering & Skills
              </span>
            )}
            <div className="space-y-0.5">
              <NavLink
                to="/dashboard/coding"
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <Code2 className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>Coding Tracker</span>}
              </NavLink>
              <NavLink
                to="/dashboard/skills"
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <Zap className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>Skills</span>}
              </NavLink>
              <NavLink
                to="/dashboard/resume"
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>Resume Builder</span>}
              </NavLink>
              <NavLink
                to="/dashboard/portfolio"
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <Globe className="w-4 h-4 flex-shrink-0" />
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span>Portfolio</span>
                    <span className="text-[9px] font-bold text-[#FF6B00] bg-[#FFF1E6] px-1.5 py-0.2 rounded">
                      Automan
                    </span>
                  </div>
                )}
              </NavLink>
            </div>
          </div>

          {/* Group 3: CAREER & GROWTH */}
          <div>
            {!collapsed && (
              <span className="px-3 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase block mb-1">
                Career & Growth
              </span>
            )}
            <div className="space-y-0.5">
              <NavLink
                to="/dashboard/internships"
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <Briefcase className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>Internships & Placements</span>}
              </NavLink>
              <NavLink
                to="/dashboard/goals"
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <CheckSquare className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>Goals & Tasks</span>}
              </NavLink>
              <NavLink
                to="/dashboard/streak"
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <Flame className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>Streak & Rewards</span>}
              </NavLink>
              <NavLink
                to="/dashboard/store"
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>ACE Store</span>}
              </NavLink>
              <NavLink
                to="/dashboard/leaderboard"
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                <BarChart2 className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>Leaderboard</span>}
              </NavLink>
            </div>
          </div>

          {/* Group 4: SYSTEM */}
          <div>
            {!collapsed && (
              <span className="px-3 text-[10px] font-bold tracking-wider text-[#6B7280] uppercase block mb-1">
                System
              </span>
            )}
            <NavLink
              to="/dashboard/settings"
              onClick={onMobileClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Settings</span>}
            </NavLink>
          </div>
        </div>

        {/* Bottom Placement Readiness Tier Badge */}
        {!collapsed && (
          <div className="p-3 mx-3 mb-3 bg-[#F3FBF3] border border-[#D4F0DA] rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#57C76F] text-white flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#6B7280] font-semibold block">Placement Readiness</span>
              <span className="text-xs font-extrabold text-[#57C76F]">Top 4% Tier</span>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#EAEAEA]">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
