import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AlertCircle, Lock, Shield, Crown, User, Loader2 } from 'lucide-react';
import { useAppSelector } from '../../redux/hooks';

// Define the roles cleanly here or import them from a types file
export const UserRole = {
  SUPER_ADMIN: 'super_admin',
  ORG_ADMIN: 'organisation_admin',
  USER: 'user',
} as const;

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: (typeof UserRole)[keyof typeof UserRole][]; // Pass array of roles allowed to access this route
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-0-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // 2. Not Authenticated -> Redirect to Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated but Wrong Role -> Show Access Denied
  // If allowedRoles is provided, check if user's role is in the list
  // Note: Adjust `user.role` to match whatever property holds the role in your DB (e.g., user.type)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <AccessDenied 
        user={user} 
        allowedRoles={allowedRoles} 
      />
    );
  }

  // 4. Authorized -> Render Children
  return <>{children}</>;
}

// --- Reusable Access Denied Component ---
const AccessDenied = ({ user, allowedRoles }: { user: any, allowedRoles: string[] }) => {
  
  // Helper to show the user's current badge
  const getUserRoleBadge = () => {
    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            <Shield className="w-3 h-3 mr-1" /> Super Admin
          </span>
        );
      case UserRole.ORG_ADMIN:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Crown className="w-3 h-3 mr-1" /> Org Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <User className="w-3 h-3 mr-1" /> User
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center border border-gray-200">
        
        {/* User Badge */}
        <div className="mb-6 flex justify-center">
          {getUserRoleBadge()}
        </div>

        {/* Lock Icon */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-red-500" />
        </div>

        {/* Text Content */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page.
        </p>

        {/* Debug/Help Info (Optional) */}
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500 mb-6 text-left">
          <p className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4" /> <strong>Logged in as:</strong> {user.email || user.name}
          </p>
          <p className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> <strong>Required Role:</strong> {allowedRoles.join(' or ')}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Go Back
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'} // Or use navigate('/dashboard')
            className="px-5 py-2.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};