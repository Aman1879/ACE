import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import { Users, FolderOpen, Award, Package, ShoppingBag, Trophy } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/overview');
      setStats(res.data.data);
    } catch {
      toast.error('Failed to load admin stats.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Platform Overview</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          High-level metrics across student registrations, projects, certifications, and store
          activity.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Registered Students"
          value={stats?.totalUsers || 0}
          icon={Users}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Projects Added"
          value={stats?.totalProjects || 0}
          icon={FolderOpen}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Certificates Uploaded"
          value={stats?.totalCertificates || 0}
          icon={Award}
          iconBg="bg-[#F3FBF3]"
          iconColor="text-[#57C76F]"
        />
        <StatCard
          title="Achievements Logged"
          value={stats?.totalAchievements || 0}
          icon={Trophy}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Store Orders"
          value={stats?.totalOrders || 0}
          icon={Package}
          iconBg="bg-[#FFF1E6]"
          iconColor="text-[#FF6B00]"
        />
        <StatCard
          title="Store Products"
          value={stats?.totalProducts || 0}
          icon={ShoppingBag}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
        />
      </div>

      {/* Recent Students Table */}
      <div className="card p-6">
        <h3 className="text-base font-bold text-[#1B1B1B] mb-4">Recently Registered Students</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFDF8] border-b border-[#EAEAEA] text-[#6B7280] uppercase font-bold">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Joined Date</th>
                <th className="p-3 text-right">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {(stats?.recentUsers || []).map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50">
                  <td className="p-3 font-bold text-[#1B1B1B]">{u.name}</td>
                  <td className="p-3 text-[#6B7280]">{u.email}</td>
                  <td className="p-3 uppercase font-semibold text-purple-600">{u.role}</td>
                  <td className="p-3 text-[#6B7280]">{formatDate(u.createdAt)}</td>
                  <td className="p-3 text-right font-bold text-[#FF6B00]">{u.xp || 0} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

