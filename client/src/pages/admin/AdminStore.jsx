import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Plus, ShoppingBag, Edit2, Trash2, Coins } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Physical',
    tokenPrice: 500,
    stock: -1,
    image: '',
    isAvailable: true,
  });

  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/store/products');
      setProducts(res.data.data || []);
    } catch {
      toast.error('Failed to load store products.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category: 'Physical',
      tokenPrice: 500,
      stock: -1,
      image: '',
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingItem(p);
    setFormData({
      name: p.name || '',
      description: p.description || '',
      category: p.category || 'Physical',
      tokenPrice: p.tokenPrice || 500,
      stock: p.stock !== undefined ? p.stock : -1,
      image: p.image || '',
      isAvailable: p.isAvailable !== undefined ? p.isAvailable : true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const payload = {
        ...formData,
        tokenPrice: Number(formData.tokenPrice),
        stock: Number(formData.stock),
      };

      if (editingItem) {
        await api.put(`/admin/store/products/${editingItem._id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/admin/store/products', payload);
        toast.success('Product created!');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch {
      toast.error('Failed to save product.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await api.delete(`/admin/store/products/${deleteId}`);
      toast.success('Product deleted.');
      setDeleteId(null);
      fetchProducts();
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Store Inventory</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Create and manage redeemable merchandise, subscriptions, and platform themes.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary !py-2.5 !px-5 !text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Store Item
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFDF8] border-b border-[#EAEAEA] text-[#6B7280] uppercase font-bold">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Token Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Available</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-bold text-[#1B1B1B] text-sm">{p.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-[#FFF1E6] text-[#FF6B00] font-bold text-[10px]">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 font-extrabold text-[#FF6B00]">{p.tokenPrice} Tokens</td>
                  <td className="p-4">{p.stock === -1 ? 'Unlimited' : p.stock}</td>
                  <td className="p-4 font-semibold text-[#57C76F]">
                    {p.isAvailable ? 'Yes' : 'No'}
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(p._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Product' : 'Add Store Product'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Product Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <option value="Physical">Physical</option>
                <option value="Digital">Digital</option>
                <option value="Theme">Theme</option>
                <option value="Badge">Badge</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="label">Token Price *</label>
              <input
                type="number"
                required
                value={formData.tokenPrice}
                onChange={(e) => setFormData({ ...formData, tokenPrice: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Stock (-1 for unlimited)</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              {actionLoading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product?"
        message="Are you sure you want to delete this store product?"
        loading={actionLoading}
      />
    </div>
  );
}

