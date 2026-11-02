import React, { useState, useEffect } from 'react';
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from '../../services/certificateService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import SearchInput from '../../components/common/SearchInput';
import { Plus, Award, ExternalLink, Edit2, Trash2, Globe, Lock, Calendar } from 'lucide-react';
import { CERTIFICATE_CATEGORIES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    issuingOrg: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: '',
    category: 'Technical',
    description: '',
    isPublic: true,
  });

  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, [page, search, selectedCategory]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 9,
        ...(search && { search }),
        ...(selectedCategory && { category: selectedCategory }),
      };
      const res = await getCertificates(params);
      const items = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setCertificates(items);
      setTotalPages(res.data?.pagination?.totalPages || res.data?.pages || 1);
    } catch {
      toast.error('Failed to load certificates.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCert(null);
    setFormData({
      name: '',
      issuingOrg: '',
      issueDate: '',
      credentialId: '',
      credentialUrl: '',
      category: 'Technical',
      description: '',
      isPublic: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert) => {
    setEditingCert(cert);
    setFormData({
      name: cert.name || '',
      issuingOrg: cert.issuingOrg || '',
      issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      category: cert.category || 'Technical',
      description: cert.description || '',
      isPublic: cert.isPublic !== undefined ? cert.isPublic : true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.issuingOrg) {
      toast.error('Name and Issuing Organization are required.');
      return;
    }

    try {
      setActionLoading(true);
      if (editingCert) {
        await updateCertificate(editingCert._id, formData);
        toast.success('Certificate updated!');
      } else {
        await createCertificate(formData);
        toast.success('Certificate added! +25 XP & +8 Tokens awarded 📜');
      }
      setIsModalOpen(false);
      fetchCertificates();
    } catch {
      toast.error('Failed to save certificate.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await deleteCertificate(deleteId);
      toast.success('Certificate deleted.');
      setDeleteId(null);
      fetchCertificates();
    } catch {
      toast.error('Failed to delete certificate.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Certificates Vault</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Store and organize all your verified credentials, cloud certifications, and diplomas.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary !py-2.5 !px-5 !text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Certificate
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
          placeholder="Search certificates or organizations..."
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
          {CERTIFICATE_CATEGORIES.map((c) => (
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
      ) : certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates stored yet"
          description="Upload proofs of your technical certifications to show verified credentials on your portfolio."
          actionLabel="Add First Certificate"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F3FBF3] text-[#57C76F] font-bold">
                    {cert.category}
                  </span>
                  {cert.isPublic ? (
                    <Globe className="w-3.5 h-3.5 text-[#57C76F]" title="Public" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#6B7280]" title="Private" />
                  )}
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF1E6] text-[#FF6B00] flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1B1B1B] leading-snug">{cert.name}</h3>
                    <p className="text-xs font-semibold text-[#6B7280]">{cert.issuingOrg}</p>
                  </div>
                </div>

                {cert.issueDate && (
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Issued: {formatDate(cert.issueDate)}</span>
                  </div>
                )}

                {cert.credentialId && (
                  <p className="text-[11px] font-mono text-[#6B7280] bg-gray-50 px-2 py-1 rounded-md mb-2 truncate">
                    ID: {cert.credentialId}
                  </p>
                )}

                {cert.description && (
                  <p className="text-xs text-[#6B7280] line-clamp-2">{cert.description}</p>
                )}
              </div>

              <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between text-xs mt-4">
                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#FF6B00] hover:underline"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-gray-400">No URL</span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cert)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B7280] hover:text-[#1B1B1B]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(cert._id)}
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

      {/* Add / Edit Certificate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCert ? 'Edit Certificate' : 'Add Certificate'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Certificate Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. AWS Certified Solutions Architect"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Issuing Organization *</label>
              <input
                type="text"
                required
                value={formData.issuingOrg}
                onChange={(e) => setFormData({ ...formData, issuingOrg: e.target.value })}
                placeholder="e.g. Amazon Web Services"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="select-field"
              >
                {CERTIFICATE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Issue Date</label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Credential ID</label>
              <input
                type="text"
                value={formData.credentialId}
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                placeholder="e.g. AWS-987654"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">Credential Verification URL</label>
            <input
              type="url"
              value={formData.credentialUrl}
              onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
              placeholder="https://www.credly.com/badges/..."
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Description (Optional)</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Key skills demonstrated..."
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
              {actionLoading ? 'Saving...' : editingCert ? 'Update' : 'Add Certificate'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Certificate?"
        message="Are you sure you want to remove this certificate?"
        loading={actionLoading}
      />
    </div>
  );
}

