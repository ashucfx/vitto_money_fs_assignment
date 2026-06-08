/**
 * App root — sets up React Router and the main layout.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar    from './components/Navbar';
import Home      from './pages/Home';
import Apply     from './pages/Apply';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/apply"     element={<Apply />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Catch-all redirect */}
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
