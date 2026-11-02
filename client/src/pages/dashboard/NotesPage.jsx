import React, { useState, useEffect } from 'react';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  pinNote,
  archiveNote,
} from '../../services/noteService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import SearchInput from '../../components/common/SearchInput';
import {
  Plus,
  StickyNote,
  Pin,
  Archive,
  Edit2,
  Trash2,
  Tag,
} from 'lucide-react';
import { NOTE_CATEGORIES, NOTE_COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Study',
    tags: '',
    color: '#FFFFFF',
    isPinned: false,
  });

  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [search, selectedCategory, showArchived]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const params = {
        ...(search && { search }),
        ...(selectedCategory && { category: selectedCategory }),
        isArchived: showArchived,
      };
      const res = await getNotes(params);
      const items = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setNotes(items);
    } catch {
      toast.error('Failed to load notes.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingNote(null);
    setFormData({
      title: '',
      content: '',
      category: 'Study',
      tags: '',
      color: '#FFFFFF',
      isPinned: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title || '',
      content: note.content || '',
      category: note.category || 'Study',
      tags: (note.tags || []).join(', '),
      color: note.color || '#FFFFFF',
      isPinned: !!note.isPinned,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Note title is required.');
      return;
    }

    try {
      setActionLoading(true);
      const tagsArray = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        tags: tagsArray,
      };

      if (editingNote) {
        await updateNote(editingNote._id, payload);
        toast.success('Note updated!');
      } else {
        await createNote(payload);
        toast.success('Note saved! 📝');
      }
      setIsModalOpen(false);
      fetchNotes();
    } catch {
      toast.error('Failed to save note.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await pinNote(id);
      fetchNotes();
    } catch {
      toast.error('Failed to update pin.');
    }
  };

  const handleToggleArchive = async (id) => {
    try {
      await archiveNote(id);
      toast.success('Note status updated.');
      fetchNotes();
    } catch {
      toast.error('Failed to update archive status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await deleteNote(deleteId);
      toast.success('Note deleted.');
      setDeleteId(null);
      fetchNotes();
    } catch {
      toast.error('Failed to delete note.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Personal Notes</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Private notebook for interview preparation, system design sketches, and lecture points.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary !py-2.5 !px-5 !text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Note
        </button>
      </div>

      {/* Filter Controls */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <SearchInput
          value={search}
          onChange={(val) => setSearch(val)}
          placeholder="Search note content or title..."
          className="w-full sm:w-72"
        />

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select-field !h-11 !text-xs w-full sm:w-40"
          >
            <option value="">All Categories</option>
            {NOTE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`btn-secondary !h-11 !text-xs flex items-center gap-1.5 whitespace-nowrap ${
              showArchived ? '!bg-[#FFF1E6] !text-[#FF6B00] !border-[#FFD9B3]' : ''
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            {showArchived ? 'Viewing Archived' : 'Show Archived'}
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card h-44 animate-pulse bg-gray-50" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title="No notes found"
          description="Maintain code snippets, behavioral interview answers, and daily learnings."
          actionLabel="Create Note"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              style={{ backgroundColor: note.color || '#FFFFFF' }}
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-black/5 text-[#1B1B1B] font-bold">
                    {note.category}
                  </span>
                  <button
                    onClick={() => handleTogglePin(note._id)}
                    className={`p-1 rounded-md transition-colors ${
                      note.isPinned ? 'text-[#FF6B00] fill-[#FF6B00]' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={note.isPinned ? 'Unpin' : 'Pin to top'}
                  >
                    <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <h3 className="text-base font-bold text-[#1B1B1B] mb-2">{note.title}</h3>

                <p className="text-xs text-[#1B1B1B]/80 leading-relaxed whitespace-pre-wrap line-clamp-5 mb-4 font-normal">
                  {note.content}
                </p>

                {note.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {note.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-black/5 text-[10px] font-semibold text-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs mt-3">
                <span className="text-[10px] text-[#6B7280]">
                  {formatDate(note.updatedAt || note.createdAt)}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleArchive(note._id)}
                    className="p-1 rounded-md hover:bg-black/5 text-gray-500"
                    title={note.isArchived ? 'Unarchive' : 'Archive'}
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(note)}
                    className="p-1 rounded-md hover:bg-black/5 text-gray-500"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(note._id)}
                    className="p-1 rounded-md hover:bg-red-50 text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNote ? 'Edit Note' : 'Create Note'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Note Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. System Design: Rate Limiter Algorithms"
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
                {NOTE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Card Color</label>
              <div className="flex items-center gap-2 pt-1.5">
                {NOTE_COLORS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: col })}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      formData.color === col ? 'scale-110 border-[#FF6B00]' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="label">Content (Markdown supported)</label>
            <textarea
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Type your notes, code snippets, or revision points..."
              className="textarea-field"
            />
          </div>

          <div>
            <label className="label">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. dsa, redis, interview"
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
              {actionLoading ? 'Saving...' : editingNote ? 'Update' : 'Save Note'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Note?"
        message="Are you sure you want to delete this note?"
        loading={actionLoading}
      />
    </div>
  );
}

