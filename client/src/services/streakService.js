import api from './api.js';
export const getStreak = () => api.get('/streak');
export const recordActivity = (activityType) =>
  api.post('/streak/activity', { activityType });

