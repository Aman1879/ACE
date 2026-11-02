import api from './api.js';
export const getResume = () => api.get('/resume');
export const updateResume = (data) => api.put('/resume', data);

