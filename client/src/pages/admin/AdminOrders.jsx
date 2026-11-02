import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Pagination from '../../components/common/Pagination';
import { Package, CheckCircle2, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders', { params: { page, limit: 15 } });
      setOrders(res.data.data || []);
      setTotalPages(res.data.pages || 1);
    } catch {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status: newStatus });
      toast.success('Order status updated!');
      fetchOrders();
    } catch {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">Store Orders</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Track student reward fulfillment, shipping addresses, and digital perk activations.
          </p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFFDF8] border-b border-[#EAEAEA] text-[#6B7280] uppercase font-bold">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Product Redeemed</th>
                <th className="p-4">Tokens</th>
                <th className="p-4">Date</th>
                <th className="p-4">Delivery Info</th>
                <th className="p-4 text-right">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-bold text-[#1B1B1B]">
                    {o.user?.name}
                    <span className="block text-[10px] text-gray-400 font-normal">
                      {o.user?.email}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-[#1B1B1B]">
                    {o.product?.name || 'Store Item'}
                  </td>
                  <td className="p-4 font-extrabold text-[#FF6B00]">{o.tokensSpent} Tokens</td>
                  <td className="p-4 text-[#6B7280]">{formatDate(o.createdAt)}</td>
                  <td className="p-4 text-[11px] text-[#6B7280]">
                    {o.deliveryInfo?.address ? (
                      <div>
                        <p className="font-semibold text-[#1B1B1B]">{o.deliveryInfo.name}</p>
                        <p>{o.deliveryInfo.address}, {o.deliveryInfo.city}</p>
                        <p>{o.deliveryInfo.phone}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">Digital Fulfillment</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="select-field !h-9 !py-1 !px-2 !text-xs w-32"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
    </div>
  );
}

