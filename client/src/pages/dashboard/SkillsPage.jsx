import React, { useState, useEffect } from 'react';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../services/skillService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { Plus, Zap, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import {
  SKILL_CATEGORIES,
  PROFICIENCY_LEVELS,
  LEARNING_STATUSES,
} from '../../utils/constants';
import toast from 'react-hot-toast';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming Language',
    proficiency: 'Intermediate',
    learningStatus: 'Confident',
    relatedProject: '',
  });

  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await getSkills();
      const items = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setSkills(items);
    } catch {
      toast.error('Failed to load skills.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Programming Language',
      proficiency: 'Intermediate',
      learningStatus: 'Confident',
      relatedProject: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      category: skill.category || 'Programming Language',
      proficiency: skill.proficiency || 'Intermediate',
      learningStatus: skill.learningStatus || 'Confident',
      relatedProject: skill.relatedProject || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Skill name is required.');
      return;
    }

    try {
      setActionLoading(true);
      if (editingSkill) {
        await updateSkill(editingSkill._id, formData);
        toast.success('Skill updated!');
      } else {
        await createSkill(formData);
        toast.success('Skill added! ⚡');
      }
      setIsModalOpen(false);
      fetchSkills();
    } catch {
      toast.error('Failed to save skill.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await deleteSkill(deleteId);
      toast.success('Skill removed.');
      setDeleteId(null);
      fetchSkills();
    } catch {
      toast.error('Failed to delete skill.');
    } finally {
      setActionLoading(false);
    }
  };

  // Group skills by category
  const groupedSkills = SKILL_CATEGORIES.reduce((acc, cat) => {
    const list = skills.filter((s) => s.category === cat);
    if (list.length > 0) acc[cat] = list;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Skills Matrix</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Organize your technical toolkit by languages, frameworks, databases, and proficiency.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary !py-2.5 !px-5 !text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="card h-32 animate-pulse bg-gray-50" />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No skills added yet"
          description="Document your languages, frontend tools, backend stacks, and cloud technologies."
          actionLabel="Add First Skill"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([cat, list]) => (
            <div key={cat} className="card p-6">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#EAEAEA]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                <h3 className="text-base font-bold text-[#1B1B1B]">{cat}</h3>
                <span className="text-xs text-[#6B7280] font-semibold">({list.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {list.map((skill) => (
                  <div
                    key={skill._id}
                    className="p-3 rounded-xl bg-[#FFFDF8] border border-[#EAEAEA] flex items-center justify-between group hover:border-[#FF6B00]/40 transition-all"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[#1B1B1B]">{skill.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            skill.proficiency === 'Advanced'
                              ? 'bg-[#F3FBF3] text-[#57C76F]'
                              : skill.proficiency === 'Intermediate'
                              ? 'bg-[#FFF1E6] text-[#FF6B00]'
                              : 'bg-gray-100 text-[#6B7280]'
                          }`}
                        >
                          {skill.proficiency}
                        </span>
                        <span className="text-[10px] text-[#6B7280]">• {skill.learningStatus}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(skill)}
                        className="p-1 rounded-md hover:bg-gray-100 text-[#6B7280]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(skill._id)}
                        className="p-1 rounded-md hover:bg-red-50 text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Skill Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. React.js, Python, PostgreSQL"
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
              {SKILL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Proficiency</label>
              <select
                value={formData.proficiency}
                onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                className="select-field"
              >
                {PROFICIENCY_LEVELS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Learning Status</label>
              <select
                value={formData.learningStatus}
                onChange={(e) => setFormData({ ...formData, learningStatus: e.target.value })}
                className="select-field"
              >
                {LEARNING_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Related Project (Optional)</label>
            <input
              type="text"
              value={formData.relatedProject}
              onChange={(e) => setFormData({ ...formData, relatedProject: e.target.value })}
              placeholder="e.g. Built E-Commerce store using this"
              className="input-field"
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
              {actionLoading ? 'Saving...' : editingSkill ? 'Update' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Skill?"
        message="Are you sure you want to delete this skill?"
        loading={actionLoading}
      />
    </div>
  );
}

