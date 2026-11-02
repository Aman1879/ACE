import api from './api.js';
export const getNotifications = (params) => api.get('/notifications', { params });
export const markRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllRead = () => api.put('/notifications/read-all');
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
export const getUnreadCount = () => api.get('/notifications/unread-count');

