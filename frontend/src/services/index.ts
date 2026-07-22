import api from '@/lib/api';
import type { Lead, User, AuthTokens, SiteSettings, DashboardStats } from '@/types';
import Cookies from 'js-cookie';

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> => {
    const { data } = await api.post<AuthTokens & { user?: User }>('/auth/login/', { email, password });
    Cookies.set('access_token', data.access, { expires: 1 });
    Cookies.set('refresh_token', data.refresh, { expires: 7 });
    const { data: user } = await api.get<User>('/auth/me/');
    return { user, tokens: data };
  },

  logout: async () => {
    const refresh = Cookies.get('refresh_token');
    if (refresh) await api.post('/auth/logout/', { refresh }).catch(() => {});
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  },

  getMe: () => api.get<User>('/auth/me/'),

  changePassword: (data: { old_password: string; new_password: string }) =>
    api.post('/auth/change-password/', data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password/', { email }),

  resetPassword: (data: { uid: string; token: string; new_password: string }) =>
    api.post('/auth/reset-password/', data),
};

export const leadService = {
  create: (data: Lead | FormData) =>
    api.post('/leads/', data instanceof FormData ? data : data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),

  getAll: (params?: Record<string, unknown>) =>
    api.get('/leads/', { params }),

  update: (id: number, data: Partial<Lead>) =>
    api.patch(`/leads/${id}/`, data),

  exportCsv: () =>
    api.get('/leads/export_csv/', { responseType: 'blob' }),

  getStats: () =>
    api.get('/leads/stats/'),
};

export const settingsService = {
  get: () => api.get<SiteSettings>('/settings/'),
  update: (data: Partial<SiteSettings>) => api.patch('/settings/update/', data),
  getDashboard: () => api.get<DashboardStats>('/settings/dashboard/'),
};

export const seoService = {
  getByPage: (pageIdentifier: string) =>
    api.get(`/seo/page/${pageIdentifier}/`),
  getAll: () => api.get('/seo/pages/'),
  update: (id: number, data: Record<string, unknown>) => api.patch(`/seo/pages/${id}/`, data),
};
