import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { token, user } = useSelector((state: any) => state.auth);
  const location = useLocation();

  // If user is not logged in, redirect to login page
  if (!token || !user) {
    return <Navigate 
      to="/login" 
      replace 
      state={{ from: location }} 
    />;
  }

  // User is authenticated → allow access to dashboard routes
  return <Outlet />;
};

export default ProtectedRoute;