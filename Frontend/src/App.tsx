import { Routes, Route } from "react-router-dom"
import AdminLogin from "@/Admin/Auth/Login"
import NotFound from "@/components/other/Not-found"
import AdminAppLayout from "@/Admin/Layouts/Layouts"
import AdminDashboard from "@/Admin/Pages/dashboard/Dashboard"
import Organization from "@/Admin/Pages/organization/OrganizationList"
import OrganizationView from "@/Admin/componets/organisations/OrganizationView"
import OrganizationEdit from "@/Admin/componets/organisations/OrganizationEdit"

// Org User Imports
import OrgUserLogin from "@/OrgUser/Auth/Login"
import OrgUserLayout from "@/OrgUser/Layouts/Layouts"
import OrgUserDashboard from "@/OrgUser/Pages/dashboard/Dashboard"
import UserManagement from "@/OrgUser/Pages/users/UserManagement"
import BranchManagement from "@/OrgUser/Pages/branches/BranchManagement"
import OrganizationInfo from "@/OrgUser/Pages/organization/OrganizationInfo"
import OrgUserOrganizationEdit from "@/OrgUser/Pages/organization/OrganizationEdit"
import Reports from "@/OrgUser/Pages/reports/Reports"
import ProtectedOrgRoute from "@/components/other/ProtectedOrgRoutes"
import AddLoyaltyProgram from "./OrgUser/Pages/loyalty/AddLoyaltyProgram"
import LoyaltyProgramList from "./OrgUser/Pages/loyalty/LoyaltyProgramList"

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/" element={<AdminLogin />} />
      
      {/* Admin Layout Routes */}
      <Route element={<AdminAppLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* Add more admin routes here */}
        <Route path="/admin/organization" element={<Organization />} />
        <Route path="/admin/organization/view/:id" element={<OrganizationView />} />
        <Route path="/admin/organization/edit/:id" element={<OrganizationEdit />} />
      </Route>

      {/* Org User Routes */}
      <Route path="/org/login" element={<OrgUserLogin />} />
      
      {/* Org User Protected Routes */}
      <Route element={<ProtectedOrgRoute><OrgUserLayout /></ProtectedOrgRoute>}>
        <Route path="/org/dashboard" element={<OrgUserDashboard />} />
        <Route 
          path="/org/users" 
          element={
            <ProtectedOrgRoute requireAdmin>
              <UserManagement />
            </ProtectedOrgRoute>
          } 
        />
        <Route 
          path="/org/loyalty" 
          element={
            <ProtectedOrgRoute requireAdmin>
              <LoyaltyProgramList />
            </ProtectedOrgRoute>
          } 
        />
        <Route 
          path="/org/loyalty/program/create" 
          element={
            <ProtectedOrgRoute requireAdmin>
              <AddLoyaltyProgram />
            </ProtectedOrgRoute>
          } 
        />
        <Route 
          path="/org/branches" 
          element={
            <ProtectedOrgRoute requireAdmin>
              <BranchManagement />
            </ProtectedOrgRoute>
          } 
        />
        <Route path="/org/organization" element={<OrganizationInfo />} />
        <Route 
          path="/org/organization/edit" 
          element={
            <ProtectedOrgRoute requireAdmin>
              <OrgUserOrganizationEdit />
            </ProtectedOrgRoute>
          } 
        />
        <Route path="/org/reports" element={<Reports />} />
        <Route path="/org/profile" element={<div className="p-6">Profile Coming Soon</div>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
