
import api from './api';

// Org User API Functions
export const orgUserApiService = {
  // Login org user
  login: (data: { email: string; password: string }) => 
    api.post('/orgUser/login', data),

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
    return api.post('/orgUser/create', data, config);
  },

  // Get all org users
  getAllUsers: () => {
    return api.get('/orgUser/by-org');
  },

  // Get single org user
  getUser: (userId: string) => 
    api.get(`/orgUser/${userId}`),

  // Update org user
  updateUser: (userId: string, data: any) => 
    api.put(`/orgUser/${userId}`, data),
  // Delete org user
  deleteUser: (userId: string) => 
    api.delete(`/orgUser/${userId}`),
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
  }) => api.post(`/branch/${orgId}`, data),

  // Get all branches (Active and Inactive)
  getAllBranches: (orgId: string) => 
    api.get(`/branch/${orgId}`),

  // Get active branches only
  getActiveBranches: (orgId: string) => 
    api.get(`/branch/${orgId}/active`),

  // Get branch by ID
  getBranchById: (branchId: string) => 
    api.get(`/branch/detail/${branchId}`),

  // Update branch
  updateBranch: (branchId: string, data: {
    name_en?: string;
    name_ar?: string;
    branch_phone_number?: string;
    city?: string;
    address?: string;
    location_link?: string;
    status?: 'Active' | 'Inactive';
  }) => api.put(`/branch/${branchId}`,data),

  // Delete branch (soft delete)
  deleteBranch: (branchId: string) => 
    api.delete(`/branch/${branchId}`),
};

