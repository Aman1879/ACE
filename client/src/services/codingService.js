import api from './api.js';
export const getCodingProfiles = () => api.get('/coding');
export const createCodingProfile = (data) => api.post('/coding', data);
export const updateCodingProfile = (id, data) => api.put(`/coding/${id}`, data);
export const deleteCodingProfile = (id) => api.delete(`/coding/${id}`);

