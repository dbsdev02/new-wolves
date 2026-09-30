import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Only attach the admin's token on /admin pages. Without this, every public
// page (properties, communities, ...) silently sent a logged-in admin's
// Bearer token too, since this same `api` instance is shared everywhere —
// and the backend's get_queryset() correctly shows an authenticated
// editor-or-above *everything* (drafts included), not just published. That
// made an admin's own logged-in browser tab show draft properties on the
// public site, which read as a bug even though real (logged-out) visitors
// never saw them. Scoping it to /admin means the public site now looks
// identical for everyone, including the admin — use an incognito window (or
// just /admin/properties/<slug>) to preview an unpublished listing instead.
api.interceptors.request.use((config) => {
  const isAdminPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const token = isAdminPage ? Cookies.get('access_token') : undefined;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = Cookies.get('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh });
          Cookies.set('access_token', data.access, { expires: 1 });
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          if (typeof window !== 'undefined') window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
