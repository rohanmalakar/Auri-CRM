import type { OrgUser } from '@/redux/features/orgAuth/orgAuthSlice';

/**
 * Role-based access control helper functions for OrgUser
 * These functions determine user permissions based on their designation
 */

/**
 * Check if user is Admin
 * Admins have full access to all features
 */
export const isAdmin = (user: OrgUser | null): boolean => {
  return user?.designation === 'Admin';
};

/**
 * Check if user is Manager
 * Managers have elevated permissions but less than Admin
 */
export const isManager = (user: OrgUser | null): boolean => {
  return user?.designation === 'Manager';
};

/**
 * Check if user is Admin or Manager
 * These roles typically have similar access levels
 */
export const isAdminOrManager = (user: OrgUser | null): boolean => {
  return user?.designation === 'Admin' || user?.designation === 'Manager';
};

/**
 * Check if user is Cashier
 * Cashiers typically have restricted access
 */
export const isCashier = (user: OrgUser | null): boolean => {
  return user?.designation === 'Cashier';
};

/**
 * Get user designation label in specified language
 */
export const getDesignationLabel = (
  designation?: 'Cashier' | 'Manager' | 'Admin' | 'Other',
  language: 'en' | 'ar' = 'en'
): string => {
  if (!designation) return language === 'ar' ? 'مستخدم' : 'User';
  
  const labels = {
    Admin: { en: 'Admin', ar: 'مسؤول' },
    Manager: { en: 'Manager', ar: 'مدير' },
    Cashier: { en: 'Cashier', ar: 'كاشير' },
    Other: { en: 'Other', ar: 'آخر' },
  };
  
  return labels[designation][language];
};

/**
 * Permission checks for specific features
 */
export const permissions = {
  // User Management
  canManageUsers: (user: OrgUser | null): boolean => isAdminOrManager(user),
  canCreateUser: (user: OrgUser | null): boolean => isAdminOrManager(user),
  canEditUser: (user: OrgUser | null): boolean => isAdminOrManager(user),
  canDeleteUser: (user: OrgUser | null): boolean => isAdmin(user),
  
  // Organization Management
  canEditOrganization: (user: OrgUser | null): boolean => isAdminOrManager(user),
  canViewOrganization: (_user: OrgUser | null): boolean => true, // All can view
  
  // Reports
  canViewReports: (_user: OrgUser | null): boolean => true, // All can view
  canExportReports: (user: OrgUser | null): boolean => isAdminOrManager(user),
  
  // Financial Operations
  canProcessRefunds: (user: OrgUser | null): boolean => isAdminOrManager(user),
  canApproveTransactions: (user: OrgUser | null): boolean => isAdminOrManager(user),
  
  // Settings
  canAccessSettings: (user: OrgUser | null): boolean => isAdminOrManager(user),
  
  // Dashboard
  canViewFullDashboard: (user: OrgUser | null): boolean => isAdminOrManager(user),
  canViewCashierDashboard: (user: OrgUser | null): boolean => isCashier(user),
};

/**
 * Example usage:
 * 
 * import { permissions, isCashier } from '@/utils/roleHelpers';
 * import { useAppSelector } from '@/redux/hooks';
 * 
 * const { user } = useAppSelector((state) => state.orgAuth);
 * 
 * // Check if user can manage users
 * if (permissions.canManageUsers(user)) {
 *   // Show user management UI
 * }
 * 
 * // Restrict button for cashiers
 * <Button disabled={isCashier(user)}>
 *   Delete User
 * </Button>
 */
