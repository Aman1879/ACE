import api from './api.js';
export const getMe = () => api.get('/auth/me');
export const changePassword = (data) => api.post('/auth/change-password', data);
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);

