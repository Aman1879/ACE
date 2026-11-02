import api from './api.js';
export const getNotes = (params) => api.get('/notes', { params });
export const createNote = (data) => api.post('/notes', data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const pinNote = (id) => api.put(`/notes/${id}/pin`);
export const archiveNote = (id) => api.put(`/notes/${id}/archive`);

