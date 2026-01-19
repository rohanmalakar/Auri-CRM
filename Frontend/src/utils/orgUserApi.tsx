import axios from 'axios';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const orgUserApi = axios.create({
  baseURL: `${backendURL}/api/v1/orgUser`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for org user authentication
orgUserApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('orgToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for org user
orgUserApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('401 Error Details:', {
        url: error.config?.url,
        method: error.config?.method,
        message: error.response?.data?.message,
      });

      if (error.response?.data?.message?.includes('token') || 
          error.response?.data?.message?.includes('login') ||
          error.response?.data?.message?.includes('Authentication')) {
        
        localStorage.removeItem('orgToken');
        localStorage.removeItem('orgUser');
        localStorage.removeItem('orgRefreshToken');
        
        if (!window.location.pathname.includes('/org/login')) {
          window.location.href = '/org/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// Org User API Functions
export const orgUserApiService = {
  // Login org user
  login: (data: { email: string; password: string }) => 
    orgUserApi.post('/login', data),

  // Create org user (admin only)
  createUser: (data: FormData | {
    org_id: string;
    branch_id?: string;
    name: string;
    email: string;
    password: string;
    tel?: string;
    address?: string;
    picture?: string;
    designation?: 'Cashier' | 'Manager' | 'Admin' | 'Other';
  }) => {
    const config = data instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    return orgUserApi.post('/create', data, config);
  },

  // Get all org users
  getAllUsers: () => {
    return orgUserApi.get('/by-org');
  },

  // Get single org user
  getUser: (userId: string) => 
    orgUserApi.get(`/${userId}`),

  // Update org user
  updateUser: (userId: string, data: any) => 
    orgUserApi.put(`/${userId}`, data),

  // Delete org user
  deleteUser: (userId: string) => 
    orgUserApi.delete(`/${userId}`),
};

// Branch API Functions (uses /api/v1/branch endpoint)
export const branchApiService = {
  // Create branch
  createBranch: (orgId: string, data: {
    name_en: string;
    name_ar: string;
    branch_phone_number: string;
    city: string;
    address: string;
    location_link?: string;
  }) => axios.post(`${backendURL}/api/v1/branch/${orgId}`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('orgToken')}`
    }
  }),

  // Get all branches (Active and Inactive)
  getAllBranches: (orgId: string) => 
    axios.get(`${backendURL}/api/v1/branch/${orgId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('orgToken')}` }
    }),

  // Get active branches only
  getActiveBranches: (orgId: string) => 
    axios.get(`${backendURL}/api/v1/branch/${orgId}/active`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('orgToken')}` }
    }),

  // Get branch by ID
  getBranchById: (branchId: string) => 
    axios.get(`${backendURL}/api/v1/branch/detail/${branchId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('orgToken')}` }
    }),

  // Update branch
  updateBranch: (branchId: string, data: {
    name_en?: string;
    name_ar?: string;
    branch_phone_number?: string;
    city?: string;
    address?: string;
    location_link?: string;
    status?: 'Active' | 'Inactive';
  }) => axios.put(`${backendURL}/api/v1/branch/${branchId}`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('orgToken')}`
    }
  }),

  // Delete branch (soft delete)
  deleteBranch: (branchId: string) => 
    axios.delete(`${backendURL}/api/v1/branch/${branchId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('orgToken')}` }
    }),
};

export default orgUserApi;
