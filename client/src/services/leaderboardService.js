import api from './api.js';
export const getLeaderboard = (params) => api.get('/leaderboard', { params });

