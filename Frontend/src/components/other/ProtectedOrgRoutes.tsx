import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

interface ProtectedOrgRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedOrgRoute({ 
  children, 
  requireAdmin = false 
}: ProtectedOrgRouteProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.orgAuth);

  if (!isAuthenticated) {
    return <Navigate to="/org/login" replace />;
  }

  // Check if admin/manager access is required (using new designation-based system)
  if (requireAdmin) {
    const isAdminOrManager = user?.designation === 'Admin' || user?.designation === 'Manager';
    if (!isAdminOrManager) {
      return <Navigate to="/org/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
