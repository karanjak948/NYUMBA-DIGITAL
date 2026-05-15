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

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/property/:id" element={<PropertyDetailsPage />} />

      {/* Protected Routes */}
      <Route path="/landlord/dashboard" element={ <ProtectedRoute> <LandlordDashboard /> </ProtectedRoute> } />
      <Route path="/tenant/dashboard" element={ <ProtectedRoute> <TenantDashboard /> </ProtectedRoute> } />
      <Route  path="/add-property" element={ <ProtectedRoute>  <AddPropertyPage />  </ProtectedRoute> } />
      <Route  path="/edit-property/:id" element={ <ProtectedRoute>  <EditPropertyPage /> </ProtectedRoute> } />
    </Routes>
  );
}

export default App;