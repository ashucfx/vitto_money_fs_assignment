/**
 * Axios API client.
 *
 * Reads the backend base URL from the VITE_API_URL environment variable.
 * All API calls in the app use this instance so the base URL is configured
 * in exactly one place.
 */

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('agent_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Authentication API ────────────────────────────────────────────────────────
export const login = (pin) => apiClient.post('/api/auth/login', { pin });

// ─── Applications API ─────────────────────────────────────────────────────────

/** Submit a new loan application. */
export const createApplication = (data) =>
  apiClient.post('/api/applications', data);

/** List all applications. Accepts optional { status, search } filters. */
export const fetchApplications = (params = {}) =>
  apiClient.get('/api/applications', { params });

/** Update application status to 'approved' or 'rejected'. */
export const updateStatus = (id, status) =>
  apiClient.patch(`/api/applications/${id}/status`, { status });

/** Fetch aggregated dashboard stats. */
export const fetchSummary = () =>
  apiClient.get('/api/summary');

/** Track application status by ID (Public) */
export const trackApplication = (id) =>
  apiClient.get(`/api/applications/${id}/track`);

export default apiClient;
