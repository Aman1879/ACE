import React, { useState, useEffect } from 'react';
import { getProducts, redeemProduct, getOrders } from '../../services/storeService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import {
  ShoppingBag,
  Coins,
  Package,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function StorePage() {
  const { user, loadUser } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redemption Modal
  const [redeemProductItem, setRedeemProductItem] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [redeemLoading, setRedeemLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchOrders();
    }
  }, [activeTab, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts({ category: selectedCategory });
      const items = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setProducts(items);
    } catch {
      toast.error('Failed to load store products.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      const items = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setOrders(items);
    } catch {
      toast.error('Failed to load order history.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRedeem = (product) => {
    if ((user?.tokenBalance || 0) < product.tokenPrice) {
      toast.error(
        `Insufficient tokens! You need ${product.tokenPrice} ACE Tokens (Balance: ${user?.tokenBalance || 0}).`
      );
      return;
    }
    setRedeemProductItem(product);
    setDeliveryInfo({
      name: user?.name || '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
    });
  };

  const handleConfirmRedeem = async (e) => {
    e.preventDefault();
    if (!redeemProductItem) return;

    if (redeemProductItem.category === 'Physical' && !deliveryInfo.address) {
      toast.error('Shipping address is required for physical merchandise.');
      return;
    }

    try {
      setRedeemLoading(true);
      await redeemProduct({
        productId: redeemProductItem._id,
        deliveryInfo: redeemProductItem.category === 'Physical' ? deliveryInfo : undefined,
      });

      toast.success(`Redeemed ${redeemProductItem.name} successfully! 🎉`);
      setRedeemProductItem(null);
      await loadUser(); // refresh token balance
      if (activeTab === 'orders') fetchOrders();
      else fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Redemption failed.');
    } finally {
      setRedeemLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B1B]">ACE Reward Store</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Redeem the ACE Tokens you earned from projects, streaks, and goals for real merchandise
            and perks.
          </p>
        </div>

        {/* Live Token Balance Display */}
        <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-[#FFF1E6] border border-[#FFD9B3]">
          <Coins className="w-5 h-5 text-[#FF6B00]" />
          <div>
            <span className="text-[10px] text-[#6B7280] uppercase font-bold block -mb-0.5">
              Available Balance
            </span>
            <span className="text-base font-extrabold text-[#FF6B00]">
              {(user?.tokenBalance || 0).toLocaleString()} Tokens
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-[#FF6B00] text-white shadow-xs'
                : 'text-[#6B7280] hover:bg-gray-100'
            }`}
          >
            Store Catalog
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-[#FF6B00] text-white shadow-xs'
                : 'text-[#6B7280] hover:bg-gray-100'
            }`}
          >
            My Orders
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['All', 'Physical', 'Digital', 'Theme', 'Premium'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#F3FBF3] text-[#57C76F] font-bold border border-[#D4F0DA]'
                    : 'text-[#6B7280] hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Catalog */}
      {activeTab === 'products' ? (
        loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="card h-60 animate-pulse bg-gray-50" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No products available in this category"
            description="Check back soon! New merchandise and digital themes are added regularly."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => {
              const canAfford = (user?.tokenBalance || 0) >= p.tokenPrice;
              return (
                <div
                  key={p._id}
                  className="card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-36 bg-[#FFFDF8] rounded-xl border border-[#EAEAEA] flex items-center justify-center text-4xl mb-3 relative overflow-hidden">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <span>
                          {p.category === 'Physical' ? '📦' : p.category === 'Theme' ? '🎨' : '⭐'}
                        </span>
                      )}
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white text-[10px] font-bold text-[#6B7280] shadow-xs">
                        {p.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1B1B1B] mb-1">{p.name}</h3>
                    <p className="text-xs text-[#6B7280] line-clamp-2 mb-3">{p.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#EAEAEA]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-sm font-black text-[#FF6B00]">
                        <Coins className="w-4 h-4" />
                        <span>{p.tokenPrice} Tokens</span>
                      </div>
                      {p.stock >= 0 && (
                        <span className="text-[10px] text-[#6B7280]">{p.stock} left</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenRedeem(p)}
                      disabled={!canAfford || p.stock === 0}
                      className={`w-full !py-2 !text-xs font-bold rounded-xl transition-all ${
                        canAfford && p.stock !== 0
                          ? 'btn-primary shadow-none'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {p.stock === 0
                        ? 'Out of Stock'
                        : canAfford
                        ? 'Redeem Now'
                        : `Need ${p.tokenPrice - (user?.tokenBalance || 0)} More`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Orders Tab */
        <div className="space-y-4">
          {loading ? (
            <div className="card h-40 animate-pulse bg-gray-50" />
          ) : orders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No redemptions yet"
              description="Browse the store catalog and redeem your tokens to see your orders here."
              actionLabel="Browse Catalog"
              onAction={() => setActiveTab('products')}
            />
          ) : (
            <div className="card p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFFDF8] border-b border-[#EAEAEA] text-[#6B7280] uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-4">Item</th>
                      <th className="p-4">Tokens Spent</th>
                      <th className="p-4">Redeemed Date</th>
                      <th className="p-4">Delivery Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAEAEA]">
                    {orders.map((o) => (
                      <tr key={o._id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-bold text-[#1B1B1B]">
                          {o.product?.name || 'Store Item'}
                        </td>
                        <td className="p-4 font-bold text-[#FF6B00]">{o.tokensSpent} Tokens</td>
                        <td className="p-4 text-[#6B7280]">{formatDate(o.createdAt)}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                              o.status === 'completed'
                                ? 'bg-[#F3FBF3] text-[#57C76F]'
                                : 'bg-[#FFF1E6] text-[#FF6B00]'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Redemption Confirmation Modal */}
      <Modal
        isOpen={!!redeemProductItem}
        onClose={() => setRedeemProductItem(null)}
        title="Confirm Redemption"
        maxWidth="max-w-md"
      >
        {redeemProductItem && (
          <form onSubmit={handleConfirmRedeem} className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#EAEAEA] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#1B1B1B]">{redeemProductItem.name}</h4>
                <p className="text-xs text-[#6B7280]">{redeemProductItem.category} Reward</p>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-[#FF6B00]">
                  {redeemProductItem.tokenPrice} Tokens
                </span>
                <span className="block text-[10px] text-[#57C76F]">Available</span>
              </div>
            </div>

            {redeemProductItem.category === 'Physical' && (
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#1B1B1B]">
                  Shipping Address
                </h5>
                <input
                  type="text"
                  required
                  placeholder="Recipient Full Name"
                  value={deliveryInfo.name}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, name: e.target.value })}
                  className="input-field"
                />
                <input
                  type="text"
                  required
                  placeholder="Street Address / Hostel / Room No."
                  value={deliveryInfo.address}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                  className="input-field"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={deliveryInfo.city}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="text"
                    required
                    placeholder="PIN Code"
                    value={deliveryInfo.pincode}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, pincode: e.target.value })}
                    className="input-field"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Contact Phone Number"
                  value={deliveryInfo.phone}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                  className="input-field"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-[#EAEAEA]">
              <button
                type="button"
                onClick={() => setRedeemProductItem(null)}
                className="btn-secondary !py-2.5 !px-5 !text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={redeemLoading}
                className="btn-primary !py-2.5 !px-6 !text-sm"
              >
                {redeemLoading ? 'Processing...' : `Redeem for ${redeemProductItem.tokenPrice} Tokens`}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

