import React, { useState, useEffect } from 'react';
import {
  getPlacements,
  createPlacement,
  updatePlacement,
  deletePlacement,
} from '../../services/placementService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import SearchInput from '../../components/common/SearchInput';
import {
  Plus,
  Target,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { PLACEMENT_STATUSES, STATUS_COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function PlacementsPage() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    jobType: 'Full-time',
    location: '',
    package: '',
    appliedDate: '',
    status: 'Applied',
    interviewDate: '',
    jobUrl: '',
    notes: '',
  });

  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPlacements();
  }, [page, search, selectedStatus]);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...(search && { search }),
        ...(selectedStatus && { status: selectedStatus }),
      };
      const res = await getPlacements(params);
      const items = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setPlacements(items);
      setTotalPages(res.data?.pagination?.totalPages || res.data?.pages || 1);
    } catch {
      toast.error('Failed to load placement applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      company: '',
      role: '',
      jobType: 'Full-time',
      location: '',
      package: '',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      interviewDate: '',
      jobUrl: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      company: item.company || '',
      role: item.role || '',
      jobType: item.jobType || 'Full-time',
      location: item.location || '',
      package: item.package || '',
      appliedDate: item.appliedDate ? item.appliedDate.split('T')[0] : '',
      status: item.status || 'Applied',
      interviewDate: item.interviewDate ? item.interviewDate.split('T')[0] : '',
      jobUrl: item.jobUrl || '',
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role) {
      toast.error('Company and job role are required.');
      return;
    }

    try {
      setActionLoading(true);
      if (editingItem) {
        await updatePlacement(editingItem._id, formData);
        toast.success('Placement application updated!');
      } else {
        await createPlacement(formData);
        toast.success('Application tracked! 🎯');
      }
      setIsModalOpen(false);
      fetchPlacements();
    } catch {
      toast.error('Failed to save application.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await deletePlacement(deleteId);
      toast.success('Application removed.');
      setDeleteId(null);
      fetchPlacements();
    } catch {
      toast.error('Failed to delete.');
    } finally {
      setActionLoading(false);
    }
  };

  // Funnel calculations
  const totalApps = placements.length;
  const activeApps = placements.filter(
    (p) => !['Rejected', 'Offer Received'].includes(p.status)
  ).length;
  const interviews = placements.filter((p) =>
    ['Technical Interview', 'HR Interview'].includes(p.status)
  ).length;
  const offers = placements.filter((p) =>
    ['Selected', 'Offer Received'].includes(p.status)
  ).length;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Placement Tracker</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Organize full-time job drives, campus recruitment stages, packages, and interviews.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary !py-2.5 !px-5 !text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Track Job Application
        </button>
      </div>

      {/* Analytics Funnel Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center p-4">
          <span className="text-xs font-semibold text-[#6B7280]">Total Applications</span>
          <h3 className="text-2xl font-extrabold text-[#1B1B1B] mt-1">{totalApps}</h3>
        </div>
        <div className="card text-center p-4">
          <span className="text-xs font-semibold text-blue-600">Active In-Pipeline</span>
          <h3 className="text-2xl font-extrabold text-blue-600 mt-1">{activeApps}</h3>
        </div>
        <div className="card text-center p-4">
          <span className="text-xs font-semibold text-[#FF6B00]">Interviews Scheduled</span>
          <h3 className="text-2xl font-extrabold text-[#FF6B00] mt-1">{interviews}</h3>
        </div>
        <div className="card text-center p-4">
          <span className="text-xs font-semibold text-[#57C76F]">Offers Received</span>
          <h3 className="text-2xl font-extrabold text-[#57C76F] mt-1">{offers}</h3>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by company or role..."
          className="w-full sm:w-72"
        />

        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setPage(1);
          }}
          className="select-field !h-11 !text-xs w-full sm:w-48"
        >
          <option value="">All Statuses</option>
          {PLACEMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table / List View */}
      {loading ? (
        <div className="card h-48 animate-pulse bg-gray-50" />
      ) : placements.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No job applications tracked yet"
          description="Log campus placements or off-campus applications to keep dates and statuses organized."
          actionLabel="Track First Application"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFDF8] border-b border-[#EAEAEA] text-[#6B7280] uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4">Company & Role</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4">CTC / Package</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {placements.map((p) => {
                  const sc = STATUS_COLORS[p.status] || { bg: '#F3F4F6', text: '#374151' };
                  return (
                    <tr key={p._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-[#1B1B1B] text-sm">{p.company}</div>
                        <div className="text-[#6B7280] font-medium">{p.role}</div>
                        {p.location && <div className="text-[11px] text-gray-400">{p.location}</div>}
                      </td>
                      <td className="p-4 font-semibold text-[#6B7280]">{p.jobType}</td>
                      <td className="p-4 text-[#6B7280]">{formatDate(p.appliedDate)}</td>
                      <td className="p-4 font-bold text-[#1B1B1B]">{p.package || '—'}</td>
                      <td className="p-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                          style={{ backgroundColor: sc.bg, color: sc.text }}
                        >
                          {p.status}
                        </span>
                        {p.interviewDate && (
                          <div className="text-[10px] text-[#FF6B00] font-bold mt-1">
                            Interview: {formatDate(p.interviewDate)}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-1">
                        {p.jobUrl && (
                          <a
                            href={p.jobUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 inline-block text-gray-500 hover:text-[#FF6B00]"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 inline-block text-gray-500 hover:text-[#1B1B1B]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(p._id)}
                          className="p-1.5 inline-block text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Job Application' : 'Track Job Application'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Company *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Google, Atlassian"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Job Role *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Graduate Software Engineer"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Job Type</label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="select-field"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="label">Current Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="select-field"
              >
                {PLACEMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Salary / CTC (e.g. 18 LPA)</label>
              <input
                type="text"
                value={formData.package}
                onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                placeholder="e.g. ₹15 LPA"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bangalore, Remote"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Application Date</label>
              <input
                type="date"
                value={formData.appliedDate}
                onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Interview Date (if any)</label>
              <input
                type="date"
                value={formData.interviewDate}
                onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">Job Post URL</label>
            <input
              type="url"
              value={formData.jobUrl}
              onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
              placeholder="https://..."
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Application Notes / Questions</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Interview round details or prep reminders..."
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
              {actionLoading ? 'Saving...' : editingItem ? 'Update' : 'Save Application'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Record?"
        message="Are you sure you want to remove this job application?"
        loading={actionLoading}
      />
    </div>
  );
}

