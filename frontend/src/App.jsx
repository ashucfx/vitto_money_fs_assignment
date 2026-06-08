/**
 * App root — sets up React Router and the main layout.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar    from './components/Navbar';
import Home      from './pages/Home';
import Apply     from './pages/Apply';
import Dashboard from './pages/Dashboard';
import Login     from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/apply"     element={<Apply />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          {/* Catch-all redirect */}
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}
