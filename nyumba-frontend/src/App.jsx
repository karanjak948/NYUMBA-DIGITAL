import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import LandlordDashboard from "./pages/LandlordDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AddPropertyPage from "./pages/AddPropertyPage";
import EditPropertyPage from "./pages/EditPropertyPage";
import ProfilePage from "./pages/ProfilePage";
import LandlordReports from "./pages/LandlordReports";
import LandlordInquiries from "./pages/LandlordInquiries";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import NotificationsPage from "./pages/NotificationsPage";
// import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/property/:id" element={<PropertyDetailsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/reports" element={ <LandlordReports /> } />
      <Route path="/landlord/inquiries" element={ <LandlordInquiries /> } />
      <Route path="/change-password" element={ <ChangePasswordPage /> } />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/admin/dashboard" element={ <AdminRoute> <AdminDashboard /> </AdminRoute> }/>
      
      

      {/* Protected Routes */}
      <Route path="/landlord/dashboard" element={ <ProtectedRoute> <LandlordDashboard /> </ProtectedRoute> } />
      <Route path="/tenant/dashboard" element={ <ProtectedRoute> <TenantDashboard /> </ProtectedRoute> } />
      <Route  path="/add-property" element={ <ProtectedRoute>  <AddPropertyPage />  </ProtectedRoute> } />
      <Route  path="/edit-property/:id" element={ <ProtectedRoute>  <EditPropertyPage /> </ProtectedRoute> } />
      <Route path="/admin/dashboard" element={ <ProtectedRoute allowedRoles={["admin"]}> <AdminDashboard /> </ProtectedRoute> } />
    </Routes>
  );
}

export default App;