import api from './api.js';
export const getProducts = (params) => api.get('/store/products', { params });
export const getProduct = (id) => api.get(`/store/products/${id}`);
export const redeemProduct = (data) => api.post('/store/redeem', data);
export const getOrders = () => api.get('/store/orders');

