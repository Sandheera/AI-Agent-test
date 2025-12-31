import api from './api';

// Auth Service
export const authService = {
  register: (name, email, password, role = 'Employee') =>
    api.post('/auth/register', { name, email, password, role }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  getCurrentUser: () =>
    api.get('/auth/me'),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Employee Service
export const employeeService = {
  getAll: (page = 1, limit = 10, department = '', status = '') =>
    api.get('/employees', { 
      params: { page, limit, department, status } 
    }),

  getById: (id) =>
    api.get(`/employees/${id}`),

  search: (query) =>
    api.get(`/employees/search/${query}`),

  create: (employeeData) =>
    api.post('/employees', employeeData),

  update: (id, employeeData) =>
    api.put(`/employees/${id}`, employeeData),

  delete: (id) =>
    api.delete(`/employees/${id}`),
};

// Job Service
export const jobService = {
  getAll: (page = 1, limit = 10, status = '', department = '') =>
    api.get('/jobs', { 
      params: { page, limit, status, department } 
    }),

  getById: (id) =>
    api.get(`/jobs/${id}`),

  create: (jobData) =>
    api.post('/jobs', jobData),

  update: (id, jobData) =>
    api.put(`/jobs/${id}`, jobData),

  delete: (id) =>
    api.delete(`/jobs/${id}`),
};

// Leave Service
export const leaveService = {
  getAll: (page = 1, limit = 10, status = '', employeeId = '') =>
    api.get('/leave', { 
      params: { page, limit, status, employeeId } 
    }),

  getById: (id) =>
    api.get(`/leave/${id}`),

  getBalance: (employeeId) =>
    api.get(`/leave/balance/${employeeId}`),

  request: (leaveData) =>
    api.post('/leave', leaveData),

  approve: (id, approvalData) =>
    api.put(`/leave/${id}/approve`, approvalData),

  cancel: (id) =>
    api.delete(`/leave/${id}`),
};
