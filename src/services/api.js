// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor to handle auth errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Auth API
// export const authAPI = {
//   setToken: (token) => {
//     if (token) {
//       api.defaults.headers.Authorization = `Bearer ${token}`;
//     } else {
//       delete api.defaults.headers.Authorization;
//     }
//   },

//   login: (email, password) => api.post('/auth/login', { email, password }),
//   register: (name, email, password) => api.post('/auth/register', { name, email, password }),
//   getCurrentUser: () => api.get('/auth/me'),
//   updateProfile: (data) => api.put('/auth/profile', data),
//   changePassword: (currentPassword, newPassword) => 
//     api.post('/auth/change-password', { currentPassword, newPassword }),
// };

// // Habits API
// export const habitsAPI = {
//   getHabits: (params) => api.get('/habits', { params }),
//   getHabit: (id) => api.get(`/habits/${id}`),
//   createHabit: (data) => api.post('/habits', data),
//   updateHabit: (id, data) => api.put(`/habits/${id}`, data),
//   deleteHabit: (id) => api.delete(`/habits/${id}`),
//   completeHabit: (id, data) => api.post(`/habits/${id}/complete`, data),
//   removeCompletion: (id) => api.delete(`/habits/${id}/complete`),
//   getHabitAnalytics: (id, params) => api.get(`/habits/${id}/analytics`, { params }),
//   getTodayHabits: () => api.get('/habits/dashboard/today'),
// };

// // Moods API
// export const moodsAPI = {
//   getMoods: (params) => api.get('/moods', { params }),
//   getMood: (id) => api.get(`/moods/${id}`),
//   createMood: (data) => api.post('/moods', data),
//   updateMood: (id, data) => api.put(`/moods/${id}`, data),
//   deleteMood: (id) => api.delete(`/moods/${id}`),
//   getMoodTrends: (params) => api.get('/moods/analytics/trends', { params }),
//   getMoodCorrelation: (params) => api.get('/moods/analytics/correlation', { params }),
// };

// // Goals API
// export const goalsAPI = {
//   getGoals: (params) => api.get('/goals', { params }),
//   getGoal: (id) => api.get(`/goals/${id}`),
//   createGoal: (data) => api.post('/goals', data),
//   updateGoal: (id, data) => api.put(`/goals/${id}`, data),
//   deleteGoal: (id) => api.delete(`/goals/${id}`),
//   updateProgress: (id, data) => api.post(`/goals/${id}/progress`, data),
//   getGoalAnalytics: (id, params) => api.get(`/goals/${id}/analytics`, { params }),
//   getGoalsOverview: () => api.get('/goals/dashboard/overview'),
// };

// // Analytics API
// export const analyticsAPI = {
//   getDashboard: (params) => api.get('/analytics/dashboard', { params }),
//   getTrends: (params) => api.get('/analytics/trends', { params }),
//   getInsights: (params) => api.get('/analytics/insights', { params }),
// };

// // Social API
// export const socialAPI = {
//   getLeaderboard: (params) => api.get('/social/leaderboard', { params }),
//   getSocialStats: () => api.get('/social/stats'),
//   shareProgress: (data) => api.post('/social/share', data),
// };

// // AI API
// export const aiAPI = {
//   getSuggestions: (params) => api.get('/ai/suggestions', { params }),
//   analyze: (data, params) => api.post('/ai/analyze', data, { params }),
//   getMotivation: () => api.get('/ai/motivation'),
// };

// export default api;
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  setToken: (token) => {
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.Authorization;
    }
  },

  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (currentPassword, newPassword) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

// ==================== HABITS API ====================
export const habitsAPI = {
  getHabits: (params) => api.get('/habits', { params }).then(res => res.data?.data ?? []),
  getHabit: (id) => api.get(`/habits/${id}`).then(res => res.data?.data ?? null),
  createHabit: (data) => api.post('/habits', data).then(res => res.data),
  updateHabit: (id, data) => api.put(`/habits/${id}`, data).then(res => res.data),
  deleteHabit: (id) => api.delete(`/habits/${id}`).then(res => res.data),
  completeHabit: (id, data) => api.post(`/habits/${id}/complete`, data).then(res => res.data),
  removeCompletion: (id) => api.delete(`/habits/${id}/complete`).then(res => res.data),
  getHabitAnalytics: (id, params) => api.get(`/habits/${id}/analytics`, { params }).then(res => res.data),
  getTodayHabits: () => api.get('/habits/dashboard/today').then(res => res.data?.data ?? []),
};

// ==================== MOODS API ====================
export const moodsAPI = {
  getMoods: (params) => api.get('/moods', { params }).then(res => res.data?.data ?? []),
  getMood: (id) => api.get(`/moods/${id}`).then(res => res.data?.data ?? null),
  createMood: (data) => api.post('/moods', data).then(res => res.data),
  updateMood: (id, data) => api.put(`/moods/${id}`, data).then(res => res.data),
  deleteMood: (id) => api.delete(`/moods/${id}`).then(res => res.data),
  getMoodTrends: (params) => api.get('/moods/analytics/trends', { params }).then(res => res.data),
  getMoodCorrelation: (params) => api.get('/moods/analytics/correlation', { params }).then(res => res.data),
};

// ==================== GOALS API ====================
export const goalsAPI = {
  getGoals: (params) => api.get('/goals', { params }).then(res => res.data?.data ?? []),
  getGoal: (id) => api.get(`/goals/${id}`).then(res => res.data?.data ?? null),
  createGoal: (data) => api.post('/goals', data).then(res => res.data),
  updateGoal: (id, data) => api.put(`/goals/${id}`, data).then(res => res.data),
  deleteGoal: (id) => api.delete(`/goals/${id}`).then(res => res.data),
  updateProgress: (id, data) => api.post(`/goals/${id}/progress`, data).then(res => res.data),
  getGoalAnalytics: (id, params) => api.get(`/goals/${id}/analytics`, { params }).then(res => res.data),
  getGoalsOverview: () => api.get('/goals/dashboard/overview').then(res => res.data ?? {}),
};

// ==================== ANALYTICS API ====================
export const analyticsAPI = {
  getDashboard: (params) => api.get('/analytics/dashboard', { params }).then(res => res.data),
  getTrends: (params) => api.get('/analytics/trends', { params }).then(res => res.data),
  getInsights: (params) => api.get('/analytics/insights', { params }).then(res => res.data),
};

// ==================== SOCIAL API ====================
export const socialAPI = {
  getLeaderboard: (params) => api.get('/social/leaderboard', { params }).then(res => res.data),
  getSocialStats: () => api.get('/social/stats').then(res => res.data),
  shareProgress: (data) => api.post('/social/share', data).then(res => res.data),
};

// ==================== AI API ====================
export const aiAPI = {
  getSuggestions: (params) => api.get('/ai/suggestions', { params }).then(res => res.data),
  analyze: (data, params) => api.post('/ai/analyze', data, { params }).then(res => res.data),
  getMotivation: () => api.get('/ai/motivation').then(res => res.data),
};

export default api;
