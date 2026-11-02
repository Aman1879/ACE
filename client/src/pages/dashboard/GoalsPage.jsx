import React, { useState, useEffect } from 'react';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  completeGoal,
} from '../../services/goalService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import ProgressBar from '../../components/common/ProgressBar';
import {
  Plus,
  CheckSquare,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  Flame,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  GOAL_CATEGORIES,
  GOAL_TYPES,
  GOAL_PRIORITIES,
  PRIORITY_COLORS,
} from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Daily', 'Weekly', 'Monthly', 'Long-term'
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Pending', 'In Progress', 'Completed'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Coding',
    priority: 'Medium',
    type: 'Weekly',
    dueDate: '',
    progress: 0,
    status: 'Pending',
  });

  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, [activeTab, statusFilter]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const params = {
        ...(activeTab !== 'All' && { type: activeTab }),
        ...(statusFilter !== 'All' && { status: statusFilter }),
      };
      const res = await getGoals(params);
      const items = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setGoals(items);
    } catch {
      toast.error('Failed to load goals.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      category: 'Coding',
      priority: 'Medium',
      type: activeTab !== 'All' ? activeTab : 'Weekly',
      dueDate: '',
      progress: 0,
      status: 'Pending',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title || '',
      description: goal.description || '',
      category: goal.category || 'Coding',
      priority: goal.priority || 'Medium',
      type: goal.type || 'Weekly',
      dueDate: goal.dueDate ? goal.dueDate.split('T')[0] : '',
      progress: goal.progress || 0,
      status: goal.status || 'Pending',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Goal title is required.');
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        ...formData,
        progress: Number(formData.progress),
      };

      if (editingGoal) {
        await updateGoal(editingGoal._id, payload);
        toast.success('Goal updated!');
      } else {
        await createGoal(payload);
        toast.success('Goal created! Track your daily progress 🎯');
      }
      setIsModalOpen(false);
      fetchGoals();
    } catch {
      toast.error('Failed to save goal.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeGoal(id);
      toast.success('Goal Completed! +40 XP & +15 Tokens earned 🎉');
      fetchGoals();
    } catch {
      toast.error('Failed to complete goal.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await deleteGoal(deleteId);
      toast.success('Goal deleted.');
      setDeleteId(null);
      fetchGoals();
    } catch {
      toast.error('Failed to delete.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Goals & Tasks</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Build discipline with daily and long-term milestones. Completing goals awards real XP and
            ACE Tokens.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary !py-2.5 !px-5 !text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Goal
        </button>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {['All', 'Daily', 'Weekly', 'Monthly', 'Long-term'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === t ? 'bg-[#FF6B00] text-white shadow-xs' : 'text-[#6B7280] hover:bg-gray-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select-field !h-10 !text-xs w-full sm:w-36"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card h-40 animate-pulse bg-gray-50" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No goals found"
          description="Setting clear goals creates momentum. Add today's coding problem or project goal."
          actionLabel="Create Your First Goal"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((g) => {
            const pc = PRIORITY_COLORS[g.priority] || PRIORITY_COLORS.Medium;
            const isDone = g.status === 'Completed';

            return (
              <div
                key={g._id}
                className={`card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between ${
                  isDone ? 'bg-white opacity-85 border-[#D4F0DA]' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFF1E6] text-[#FF6B00] font-bold">
                      {g.category}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full font-bold text-[10px]"
                      style={{ backgroundColor: pc.bg, color: pc.text }}
                    >
                      {g.priority} Priority
                    </span>
                  </div>

                  <h3
                    className={`text-base font-bold mb-1.5 ${
                      isDone ? 'line-through text-gray-500' : 'text-[#1B1B1B]'
                    }`}
                  >
                    {g.title}
                  </h3>

                  {g.description && (
                    <p className="text-xs text-[#6B7280] line-clamp-2 mb-3">{g.description}</p>
                  )}

                  {/* Progress bar */}
                  <div className="my-3">
                    <ProgressBar
                      progress={isDone ? 100 : g.progress || 0}
                      label={g.type}
                      valueText={`${isDone ? 100 : g.progress || 0}%`}
                      color={isDone ? 'bg-[#57C76F]' : 'bg-[#FF6B00]'}
                    />
                  </div>

                  {g.dueDate && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Due: {formatDate(g.dueDate)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between text-xs mt-3">
                  {isDone ? (
                    <span className="inline-flex items-center gap-1 font-bold text-[#57C76F]">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleComplete(g._id)}
                      className="btn-green !py-1.5 !px-3 !text-xs !rounded-lg flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Done
                    </button>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(g)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B7280] hover:text-[#1B1B1B]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(g._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGoal ? 'Edit Goal' : 'Create New Goal'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Goal Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Solve 5 Dynamic Programming problems"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="select-field"
              >
                {GOAL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Timeframe</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="select-field"
              >
                {GOAL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="select-field"
              >
                {GOAL_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="label !mb-0">Progress ({formData.progress}%)</label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
              className="w-full accent-[#FF6B00]"
            />
          </div>

          <div>
            <label className="label">Description / Checkpoints</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Specific notes or problem links..."
              className="textarea-field"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#EAEAEA]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary !py-2.5 !px-5 !text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="btn-primary !py-2.5 !px-6 !text-sm"
            >
              {actionLoading ? 'Saving...' : editingGoal ? 'Update' : 'Create Goal'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Goal?"
        message="Are you sure you want to remove this goal?"
        loading={actionLoading}
      />
    </div>
  );
}

