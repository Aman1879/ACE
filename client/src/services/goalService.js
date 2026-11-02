import api from './api.js';
export const getGoals = (params) => api.get('/goals', { params });
export const createGoal = (data) => api.post('/goals', data);
export const updateGoal = (id, data) => api.put(`/goals/${id}`, data);
export const deleteGoal = (id) => api.delete(`/goals/${id}`);
export const completeGoal = (id) => api.post(`/goals/${id}/complete`);

