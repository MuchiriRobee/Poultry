import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';  
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/dashboard/Dashboard';
import CreateFarm from './pages/dashboard/CreateFarm';
import Flocks from './pages/dashboard/Flocks';
import EggProduction from './pages/dashboard/EggProduction';

// Import other pages later: Dashboard, Flocks, etc.


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="create-farm" element={<CreateFarm />} />
            <Route path="flocks" element={<Flocks />} />
            <Route path="create-flock" element={<Flocks />} />   {/* We'll handle create inside Flocks modal */}
            <Route path="egg-production" element={<EggProduction />} />
            {/* Other nested routes will go here later */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App