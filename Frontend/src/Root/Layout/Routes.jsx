import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import ProtectedRoute from '/src/components/ProtectedRoute';
import Login from '../../Pages/Login/Login';
import Register from '../../Pages/Register/Register';
import Layout from './Layout';
import Dashboard from '../../Pages/Dashboard/Dashboard';
import NotFound from '../../Pages/NotFound/NotFound';
import { CourseProvider } from '../../contexts/CourseContext';
import { ProfileProvider } from '../../contexts/ProfileContext';
import Courses from '../../Pages/Courses/Courses';
import Notes from '../../Pages/Notes/Notes';
import Calendar from '../../Pages/Calendar/Calendar';
import Profile from '../../Pages/Profile/Profile';
import { GpaProvider } from '../../contexts/GpaContext';
import { NotesProvider } from '../../contexts/NotesContext';
import { EventProvider } from '../../contexts/EventContext';
import { ToastProvider, useToastContext } from '../../contexts/ToastContext';
import MessageCard from '../../components/Cards/MessageCard';

function ToastOutlet() {
  const { toasts } = useToastContext();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col space-y-2">
      {toasts.map((t) => (
        <MessageCard key={t.id} message={t.message} type={t.type} />
      ))}
    </div>
  );
}

const AppRoutes = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <ToastOutlet/>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes with Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <CourseProvider>
                    <ProfileProvider>
                      <GpaProvider>
                        <NotesProvider>
                          <EventProvider>
                            <Layout />
                          </EventProvider>
                        </NotesProvider>
                      </GpaProvider>
                    </ProfileProvider>
                  </CourseProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default AppRoutes;
