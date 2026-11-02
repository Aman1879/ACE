import React, { useState, useEffect } from 'react';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../../services/projectService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import SearchInput from '../../components/common/SearchInput';
import {
  Plus,
  FolderOpen,
  Github,
  ExternalLink,
  Edit2,
  Trash2,
  Globe,
  Lock,
} from 'lucide-react';
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    status: 'In Progress',
    isPublic: true,
    myRole: '',
  });

  // Delete Dialog
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [page, search, selectedCategory, selectedStatus]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 9,
        ...(search && { search }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedStatus && { status: selectedStatus }),
      };
      const res = await getProjects(params);
      const items = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setProjects(items);
      setTotalPages(res.data?.pagination?.totalPages || res.data?.pages || 1);
    } catch {
      toast.error('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      category: 'Web',
      technologies: '',
      githubUrl: '',
      liveUrl: '',
      status: 'In Progress',
      isPublic: true,
      myRole: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      category: project.category || 'Web',
      technologies: (project.technologies || []).join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      status: project.status || 'In Progress',
      isPublic: project.isPublic !== undefined ? project.isPublic : true,
      myRole: project.myRole || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Project title is required.');
      return;
    }

    try {
      setActionLoading(true);
      const techArray = formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        technologies: techArray,
      };

      if (editingProject) {
        await updateProject(editingProject._id, payload);
        toast.success('Project updated successfully!');
      } else {
        await createProject(payload);
        toast.success('Project created! +30 XP & +10 Tokens awarded 🚀');
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch {
      toast.error('Error saving project.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await deleteProject(deleteId);
      toast.success('Project removed.');
      setDeleteId(null);
      fetchProjects();
    } catch {
      toast.error('Failed to delete project.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">My Projects</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Build and showcase your technical portfolio. Public projects appear on your shareable link.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary !py-2.5 !px-5 !text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Project
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
          placeholder="Search by project title..."
          className="w-full sm:w-72"
        />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="select-field !h-11 !text-xs w-full sm:w-40"
          >
            <option value="">All Categories</option>
            {PROJECT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="select-field !h-11 !text-xs w-full sm:w-36"
          >
            <option value="">All Statuses</option>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card h-64 animate-pulse bg-gray-50" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects added yet"
          description="Projects demonstrate your real engineering capabilities to hiring managers. Add your first build!"
          actionLabel="Add Your First Project"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p._id}
              className="card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Status & Visibility Row */}
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFF1E6] text-[#FF6B00] font-bold">
                    {p.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        p.status === 'Completed'
                          ? 'bg-[#F3FBF3] text-[#57C76F]'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {p.status}
                    </span>
                    {p.isPublic ? (
                      <Globe className="w-3.5 h-3.5 text-[#57C76F]" title="Public on profile" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[#6B7280]" title="Private" />
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#1B1B1B] mb-1.5">{p.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3 mb-4">
                  {p.description || 'No description provided.'}
                </p>

                {/* Tech chips */}
                {p.technologies && p.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.technologies.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-gray-100 text-[#1B1B1B] text-[10px] font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                    {p.technologies.length > 4 && (
                      <span className="text-[10px] text-[#6B7280] self-center">
                        +{p.technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-[#1B1B1B]"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-[#FF6B00]"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6B7280] hover:text-[#1B1B1B]"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(p._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Project Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. AI-Powered Resume Builder"
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
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="select-field"
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Technologies (comma separated)</label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="React, Express, MongoDB, Tailwind, Node.js"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">GitHub Repository URL</label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Live Demo URL</label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://myproject.vercel.app"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">Description & Key Features</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What does this project do? What problem did you solve?"
              className="textarea-field"
            />
          </div>

          <div>
            <label className="label">My Role / Contribution</label>
            <input
              type="text"
              value={formData.myRole}
              onChange={(e) => setFormData({ ...formData, myRole: e.target.value })}
              placeholder="e.g. Full-Stack Lead, UI Designer"
              className="input-field"
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
              Show on my public portfolio
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
              {actionLoading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project?"
        message="Are you sure you want to remove this project? This action cannot be reversed."
        loading={actionLoading}
      />
    </div>
  );
}

