import React, { useState, useEffect } from 'react';
import {
  getInternships,
  createInternship,
  updateInternship,
  deleteInternship,
} from '../../services/internshipService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import SearchInput from '../../components/common/SearchInput';
import { Plus, Briefcase, Calendar, MapPin, Edit2, Trash2, IndianRupee } from 'lucide-react';
import { INTERNSHIP_STATUSES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function InternshipsPage() {
  const [internships, setInternships] = useState([]);
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
    type: 'Remote',
    location: '',
    startDate: '',
    endDate: '',
    stipend: '',
    description: '',
    skillsUsed: '',
    status: 'Completed',
    isPublic: true,
  });

  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchInternships();
  }, [page, search, selectedStatus]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 9,
        ...(search && { search }),
        ...(selectedStatus && { status: selectedStatus }),
      };
      const res = await getInternships(params);
      const items = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setInternships(items);
      setTotalPages(res.data?.pagination?.totalPages || res.data?.pages || 1);
    } catch {
      toast.error('Failed to load internships.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      company: '',
      role: '',
      type: 'Remote',
      location: '',
      startDate: '',
      endDate: '',
      stipend: '',
      description: '',
      skillsUsed: '',
      status: 'Completed',
      isPublic: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      company: item.company || '',
      role: item.role || '',
      type: item.type || 'Remote',
      location: item.location || '',
      startDate: item.startDate ? item.startDate.split('T')[0] : '',
      endDate: item.endDate ? item.endDate.split('T')[0] : '',
      stipend: item.stipend || '',
      description: item.description || '',
      skillsUsed: (item.skillsUsed || []).join(', '),
      status: item.status || 'Completed',
      isPublic: item.isPublic !== undefined ? item.isPublic : true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role) {
      toast.error('Company and role are required.');
      return;
    }

    try {
      setActionLoading(true);
      const skillsArray = formData.skillsUsed
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        skillsUsed: skillsArray,
        stipend: formData.stipend ? Number(formData.stipend) : undefined,
      };

      if (editingItem) {
        await updateInternship(editingItem._id, payload);
        toast.success('Internship updated!');
      } else {
        await createInternship(payload);
        toast.success('Internship logged! +20 XP awarded 💼');
      }
      setIsModalOpen(false);
      fetchInternships();
    } catch {
      toast.error('Failed to save internship.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await deleteInternship(deleteId);
      toast.success('Internship deleted.');
      setDeleteId(null);
      fetchInternships();
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Internship Tracker</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Track your corporate internships, research apprenticeships, and application statuses.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary !py-2.5 !px-5 !text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Internship
        </button>
      </div>

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
          className="select-field !h-11 !text-xs w-full sm:w-44"
        >
          <option value="">All Statuses</option>
          {INTERNSHIP_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card h-48 animate-pulse bg-gray-50" />
          ))}
        </div>
      ) : internships.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No internships recorded yet"
          description="Log previous internships or manage open applications to stay on top of offers and reviews."
          actionLabel="Log Internship"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((item) => (
            <div
              key={item._id}
              className="card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold ${
                      item.status === 'Completed' || item.status === 'Selected'
                        ? 'bg-[#F3FBF3] text-[#57C76F]'
                        : item.status === 'Rejected'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-[#FFF1E6] text-[#FF6B00]'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-[11px] font-semibold text-[#6B7280]">{item.type}</span>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1B1B1B]">{item.role}</h3>
                    <p className="text-xs font-semibold text-[#6B7280]">{item.company}</p>
                  </div>
                </div>

                {item.startDate && (
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {formatDate(item.startDate)} -{' '}
                      {item.endDate ? formatDate(item.endDate) : 'Present'}
                    </span>
                  </div>
                )}

                {item.stipend && (
                  <p className="text-xs font-bold text-[#57C76F] mb-2">
                    ₹{item.stipend.toLocaleString()} / month
                  </p>
                )}

                {item.description && (
                  <p className="text-xs text-[#6B7280] line-clamp-3 mb-3">{item.description}</p>
                )}

                {item.skillsUsed?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.skillsUsed.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-semibold text-gray-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-end gap-2 text-xs mt-3">
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
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Internship' : 'Log Internship Experience'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Company Name *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Microsoft"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Role Title *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. SDE Intern"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Work Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="select-field"
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="select-field"
              >
                {INTERNSHIP_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Stipend (₹ / month)</label>
              <input
                type="number"
                value={formData.stipend}
                onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                placeholder="e.g. 45000"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Hyderabad / Remote"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">Skills Used (comma separated)</label>
            <input
              type="text"
              value={formData.skillsUsed}
              onChange={(e) => setFormData({ ...formData, skillsUsed: e.target.value })}
              placeholder="e.g. React, Docker, Python, AWS"
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Description / Responsibilities</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Key accomplishments and learnings..."
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
              {actionLoading ? 'Saving...' : editingItem ? 'Update' : 'Save Experience'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Internship?"
        message="Are you sure you want to remove this internship record?"
        loading={actionLoading}
      />
    </div>
  );
}

