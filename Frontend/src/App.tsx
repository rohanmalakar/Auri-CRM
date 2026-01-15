import { Routes, Route } from "react-router-dom"
import AdminLogin from "@/Admin/Auth/Login"
import NotFound from "@/components/other/Not-found"
import AdminAppLayout from "@/Admin/Layouts/Layouts"
import AdminDashboard from "@/Admin/Pages/dashboard/Dashboard"
import Organization from "@/Admin/Pages/organization/OrganizationList"
import OrganizationView from "@/Admin/componets/organisations/OrganizationView"
import OrganizationEdit from "@/Admin/componets/organisations/OrganizationEdit"

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

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
