import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import { Sliders, Edit2, Coins, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminRewardRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    xpAmount: 0,
    tokenAmount: 0,
    isActive: true,
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/reward-rules');
      setRules(res.data.data || []);
    } catch {
      toast.error('Failed to load reward rules.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (r) => {
    setEditingRule(r);
    setFormData({
      description: r.description || '',
      xpAmount: r.xpAmount || 0,
      tokenAmount: r.tokenAmount || 0,
      isActive: r.isActive !== undefined ? r.isActive : true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingRule) return;

    try {
      setActionLoading(true);
      await api.put(`/admin/reward-rules/${editingRule._id}`, {
        ...formData,
        xpAmount: Number(formData.xpAmount),
        tokenAmount: Number(formData.tokenAmount),
      });

      toast.success('Reward rule updated!');
      setEditingRule(null);
      fetchRules();
    } catch {
      toast.error('Failed to update reward rule.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">XP & Token Reward Rules</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Configure the exact XP and Token rewards granted dynamically for each student activity.
          </p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFDF8] border-b border-[#EAEAEA] text-[#6B7280] uppercase font-bold">
              <tr>
                <th className="p-4">Activity Key</th>
                <th className="p-4">Description</th>
                <th className="p-4">XP Reward</th>
                <th className="p-4">Token Reward</th>
                <th className="p-4">Active</th>
                <th className="p-4 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {rules.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-mono font-bold text-purple-700">{r.activityType}</td>
                  <td className="p-4 text-[#1B1B1B] font-medium">{r.description}</td>
                  <td className="p-4 font-bold text-[#57C76F]">+{r.xpAmount} XP</td>
                  <td className="p-4 font-bold text-[#FF6B00]">+{r.tokenAmount} Tokens</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        r.isActive ? 'bg-[#F3FBF3] text-[#57C76F]' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {r.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(r)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Rule Modal */}
      <Modal
        isOpen={!!editingRule}
        onClose={() => setEditingRule(null)}
        title="Configure Activity Reward Rule"
        maxWidth="max-w-md"
      >
        {editingRule && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Activity</label>
              <input
                type="text"
                disabled
                value={editingRule.activityType}
                className="input-field bg-gray-50 font-mono text-xs"
              />
            </div>

            <div>
              <label className="label">Rule Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label text-[#57C76F]">XP Amount</label>
                <input
                  type="number"
                  value={formData.xpAmount}
                  onChange={(e) => setFormData({ ...formData, xpAmount: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label text-[#FF6B00]">Token Amount</label>
                <input
                  type="number"
                  value={formData.tokenAmount}
                  onChange={(e) => setFormData({ ...formData, tokenAmount: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1B1B1B]">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-600"
                />
                Rule Active
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#EAEAEA]">
              <button
                type="button"
                onClick={() => setEditingRule(null)}
                className="btn-secondary !py-2.5 !px-5 !text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="btn-primary !py-2.5 !px-6 !text-sm"
              >
                {actionLoading ? 'Saving...' : 'Update Reward Rule'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

