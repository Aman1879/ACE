import React, { useState, useEffect } from 'react';
import {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../../services/achievementService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import SearchInput from '../../components/common/SearchInput';
import { Plus, Trophy, ExternalLink, Edit2, Trash2, Globe, Lock, Medal } from 'lucide-react';
import { ACHIEVEMENT_CATEGORIES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Hackathon',
    date: '',
    organization: '',
    position: '',
    proofUrl: '',
    isPublic: true,
  });

  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, [page, search, selectedCategory]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 9,
        ...(search && { search }),
        ...(selectedCategory && { category: selectedCategory }),
      };
      const res = await getAchievements(params);
      const items = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setAchievements(items);
      setTotalPages(res.data?.pagination?.totalPages || res.data?.pages || 1);
    } catch {
      toast.error('Failed to load achievements.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      category: 'Hackathon',
      date: '',
      organization: '',
      position: '',
      proofUrl: '',
      isPublic: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      category: item.category || 'Hackathon',
      date: item.date ? item.date.split('T')[0] : '',
      organization: item.organization || '',
      position: item.position || '',
      proofUrl: item.proofUrl || '',
      isPublic: item.isPublic !== undefined ? item.isPublic : true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Title is required.');
      return;
    }

    try {
      setActionLoading(true);
      if (editingItem) {
        await updateAchievement(editingItem._id, formData);
        toast.success('Achievement updated!');
      } else {
        await createAchievement(formData);
        toast.success('Achievement added! +20 XP & +5 Tokens awarded 🏆');
      }
      setIsModalOpen(false);
      fetchAchievements();
    } catch {
      toast.error('Failed to save achievement.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await deleteAchievement(deleteId);
      toast.success('Achievement removed.');
      setDeleteId(null);
      fetchAchievements();
    } catch {
      toast.error('Failed to delete achievement.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Achievements</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Log your hackathon wins, research milestones, coding contest ranks, and awards.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary !py-2.5 !px-5 !text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Achievement
        </button>
      </div>

      {/* Filter Controls */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search achievements..."
          className="w-full sm:w-72"
        />

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
          className="select-field !h-11 !text-xs w-full sm:w-48"
        >
          <option value="">All Categories</option>
          {ACHIEVEMENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card h-48 animate-pulse bg-gray-50" />
          ))}
        </div>
      ) : achievements.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No achievements logged yet"
          description="Hackathons, awards, or college leadership? Document them here to build your competitive profile."
          actionLabel="Log First Achievement"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item) => (
            <div
              key={item._id}
              className="card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {item.isPublic ? (
                      <Globe className="w-3.5 h-3.5 text-[#57C76F]" title="Public" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[#6B7280]" title="Private" />
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1B1B1B] leading-snug">{item.title}</h3>
                    {item.organization && (
                      <p className="text-xs font-semibold text-[#6B7280]">{item.organization}</p>
                    )}
                  </div>
                </div>

                {item.position && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF1E6] text-[#FF6B00] text-xs font-bold mb-3">
                    <Medal className="w-3.5 h-3.5" />
                    <span>{item.position}</span>
                  </div>
                )}

                {item.description && (
                  <p className="text-xs text-[#6B7280] line-clamp-3 mb-2">{item.description}</p>
                )}

                {item.date && (
                  <p className="text-[11px] text-[#6B7280]">Achieved: {formatDate(item.date)}</p>
                )}
              </div>

              <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between text-xs mt-4">
                {item.proofUrl ? (
                  <a
                    href={item.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#FF6B00] hover:underline"
                  >
                    <span>View Proof</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-gray-400">No proof link</span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B7280] hover:text-[#1B1B1B]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(item._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Achievement' : 'Add Achievement'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Achievement Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 1st Place - Smart India Hackathon"
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
                {ACHIEVEMENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Position / Rank</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="e.g. Winner / Top 10"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Organizing Body</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. Ministry of Education"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">Proof Link (Post, Certificate, URL)</label>
            <input
              type="url"
              value={formData.proofUrl}
              onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
              placeholder="https://..."
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Summary / Details</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what you built or achieved..."
              className="textarea-field"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1B1B1B]">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="rounded text-[#FF6B00] focus:ring-[#FF6B00]"
              />
              Show on public portfolio
            </label>
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
              {actionLoading ? 'Saving...' : editingItem ? 'Update' : 'Save Achievement'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Achievement?"
        message="Are you sure you want to delete this achievement record?"
        loading={actionLoading}
      />
    </div>
  );
}

