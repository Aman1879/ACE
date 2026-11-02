import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  Sliders,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user } = useAuth();

  const nav = [
    { path: '/admin', label: 'Platform Overview', icon: LayoutDashboard, end: true },
    { path: '/admin/users', label: 'Manage Students', icon: Users },
    { path: '/admin/store', label: 'Store Products', icon: ShoppingBag },
    { path: '/admin/orders', label: 'Store Orders', icon: Package },
    { path: '/admin/rewards', label: 'XP & Token Rules', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#EAEAEA] flex flex-col p-4 md:min-h-screen">
        <div className="flex items-center gap-2.5 pb-6 border-b border-[#EAEAEA] mb-6">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#1B1B1B]">ACE Admin</h3>
            <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">
              Control Center
            </span>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#1B1B1B]'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-[#EAEAEA]">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#FF6B00] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Student View
          </Link>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

