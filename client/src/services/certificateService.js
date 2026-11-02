import api from './api.js';
export const getCertificates = (params) => api.get('/certificates', { params });
export const createCertificate = (data) =>
  api.post('/certificates', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateCertificate = (id, data) => api.put(`/certificates/${id}`, data);
export const deleteCertificate = (id) => api.delete(`/certificates/${id}`);

