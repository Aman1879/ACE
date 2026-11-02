import api from './api.js';
export const getGamificationSummary = () => api.get('/gamification/summary');
export const getBadges = () => api.get('/gamification/badges');
export const getTransactions = (params) => api.get('/gamification/transactions', { params });
export const getXPHistory = () => api.get('/gamification/xp-history');

