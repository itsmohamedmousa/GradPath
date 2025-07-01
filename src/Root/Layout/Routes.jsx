import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import ProtectedRoute from '/src/components/ProtectedRoute';
import Login from '../../Pages/Login/Login';
import Register from '../../Pages/Register/Register';
import Layout from './Layout';
import Dashboard from '../../Pages/Dashboard/Dashboard';
import NotFound from '../../Pages/NotFound/NotFound';
import { CourseProvider } from '../../contexts/CourseContext';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes with Layout */}
          <Route
            element={
              <CourseProvider>
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              </CourseProvider>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Add more protected routes here as needed */}
          </Route>

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRoutes;
