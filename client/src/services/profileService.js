import api from './api.js';
export const getMyProfile = () => api.get('/profile/me');
export const updateProfile = (data) => api.put('/profile/me', data);
export const uploadAvatar = (formData) =>
  api.post('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getPublicProfile = (username) => api.get(`/public/users/${username}`);

