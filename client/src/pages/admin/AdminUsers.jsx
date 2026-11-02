import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import SearchInput from '../../components/common/SearchInput';
import Pagination from '../../components/common/Pagination';
import { Users, Shield, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users', { params: { page, limit: 15, search } });
      setUsers(res.data.data || []);
      setTotalPages(res.data.pages || 1);
    } catch {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'student' : 'admin';
    try {
      await api.put(`/admin/users/${userId}`, { role: nextRole });
      toast.success(`Role updated to ${nextRole}`);
      fetchUsers();
    } catch {
      toast.error('Failed to update role.');
    }
  };

  const handleToggleActive = async (userId, currentActive) => {
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !currentActive });
      toast.success('User status updated');
      fetchUsers();
    } catch {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Manage Students</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Search, view, and manage role-based authorization for all registered student accounts.
          </p>
        </div>
      </div>

      <div className="card p-4">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by name, email, or username..."
          className="max-w-md"
        />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFDF8] border-b border-[#EAEAEA] text-[#6B7280] uppercase font-bold">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Role</th>
                <th className="p-4">XP & Level</th>
                <th className="p-4">Tokens</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Loading students...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="font-bold text-[#1B1B1B] text-sm">{u.name}</div>
                      <div className="text-[#6B7280]">{u.email}</div>
                      <div className="text-[10px] text-gray-400">@{u.username}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-[#57C76F]">Lvl {u.level || 1}</span>
                      <span className="text-gray-400 block text-[11px]">{u.xp || 0} XP</span>
                    </td>
                    <td className="p-4 font-bold text-[#FF6B00]">{u.tokenBalance || 0}</td>
                    <td className="p-4 text-[#6B7280]">{formatDate(u.createdAt)}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleRole(u._id, u.role)}
                        className="px-2.5 py-1 rounded-lg border border-[#EAEAEA] font-semibold hover:border-purple-600 text-purple-600"
                      >
                        {u.role === 'admin' ? 'Demote to Student' : 'Promote to Admin'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
    </div>
  );
}

