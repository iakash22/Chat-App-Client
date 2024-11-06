import React, { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import OpenRoute from './components/auth/OpenRoute';
import PrivateRoute from './components/auth/PrivateRoute';
import { LayoutLoaders } from './components/layouts/Loaders';
import { getMyProfile } from './services/operations/auth';
import { SocketProvider } from './socket';

// Lazily load page components for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Chat = lazy(() => import('./pages/Chat'));
const Groups = lazy(() => import('./pages/Groups'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazily load admin-specific pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const ChatManagement = lazy(() => import('./pages/admin/ChatManagement'));
const MessageManagement = lazy(() => import('./pages/admin/MessageManagement'));

const App = () => {
  // Accessing the authentication state from Redux store
  const { loading, isAuthenticate } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch the user profile if the user is authenticated
    if (isAuthenticate) {
      dispatch(getMyProfile());
    }
  }, []);

  // Display loader while data is loading
  if (loading) return <LayoutLoaders />;

  return (
    // Suspense component is used to show a fallback (loader) while lazy-loaded components are being fetched
    <Suspense fallback={<LayoutLoaders />}>

      {/* Define routes within the application */}
      <Routes>

        {/* Protected routes wrapped in SocketProvider for real-time communication */}
        <Route element={
          <SocketProvider>
            <PrivateRoute /> {/* Ensures the route is accessible only to authenticated users */}
          </SocketProvider>
        }>
          <Route path='/' element={<Home />} /> {/* Home page */}
          <Route path='/chat/:chatId' element={<Chat />} /> {/* Chat page with dynamic chat ID */}
          <Route path='/groups' element={<Groups />} /> {/* Groups page */}
        </Route>

        {/* Publicly accessible route for login */}
        <Route path='/login' element={
          <OpenRoute> {/* Open route for unauthenticated users */}
            <Login />
          </OpenRoute>
        } />

        {/* Admin routes */}
        <Route path='/admin' element={<AdminLogin />} /> {/* Admin login page */}
        <Route path='/admin/dashboard' element={<Dashboard />} /> {/* Admin dashboard */}
        <Route path='/admin/users' element={<UserManagement />} /> {/* Manage users */}
        <Route path='/admin/chats' element={<ChatManagement />} /> {/* Manage chats */}
        <Route path='/admin/messages' element={<MessageManagement />} /> {/* Manage messages */}

        {/* Fallback route for undefined paths (404 page) */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
