import api from '@/lib/api';
import type { PaginatedResponse, Developer, Community, Project, Agent, Blog, Testimonial, FAQ } from '@/types';

export const developerService = {
  getAll: (params?: Record<string, unknown>) => api.get<PaginatedResponse<Developer>>('/developers/', { params }),
  getBySlug: (slug: string) => api.get<Developer>(`/developers/${slug}/`),
  getFeatured: () => api.get<Developer[]>('/developers/featured/'),
  create: (data: FormData) => api.post('/developers/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (slug: string, data: FormData) => api.patch(`/developers/${slug}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (slug: string) => api.delete(`/developers/${slug}/`),
};

export const communityService = {
  getAll: (params?: Record<string, unknown>) => api.get<PaginatedResponse<Community>>('/communities/', { params }),
  getBySlug: (slug: string) => api.get<Community>(`/communities/${slug}/`),
  getFeatured: () => api.get<Community[]>('/communities/featured/'),
  create: (data: FormData) => api.post('/communities/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (slug: string, data: FormData) => api.patch(`/communities/${slug}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (slug: string) => api.delete(`/communities/${slug}/`),
};

export const projectService = {
  getAll: (params?: Record<string, unknown>) => api.get<PaginatedResponse<Project>>('/projects/', { params }),
  getBySlug: (slug: string) => api.get<Project>(`/projects/${slug}/`),
  getFeatured: () => api.get<Project[]>('/projects/featured/'),
  create: (data: FormData) => api.post('/projects/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (slug: string, data: FormData) => api.patch(`/projects/${slug}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (slug: string) => api.delete(`/projects/${slug}/`),
};

export const agentService = {
  getAll: (params?: Record<string, unknown>) => api.get<PaginatedResponse<Agent>>('/agents/', { params }),
  getById: (id: number) => api.get<Agent>(`/agents/${id}/`),
  getFeatured: () => api.get<Agent[]>('/agents/featured/'),
  addReview: (id: number, data: { reviewer_name: string; rating: number; comment: string }) =>
    api.post(`/agents/${id}/add_review/`, data),
};

export const blogService = {
  getAll: (params?: Record<string, unknown>) => api.get<PaginatedResponse<Blog>>('/blogs/', { params }),
  getBySlug: (slug: string) => api.get<Blog>(`/blogs/${slug}/`),
  getFeatured: () => api.get<Blog[]>('/blogs/featured/'),
  getRelated: (slug: string) => api.get<Blog[]>(`/blogs/${slug}/related/`),
  addComment: (slug: string, data: { name: string; email: string; comment: string }) =>
    api.post(`/blogs/${slug}/add_comment/`, data),
  getCategories: () => api.get('/blogs/categories/'),
  getTags: () => api.get('/blogs/tags/'),
  create: (data: Record<string, unknown>) => api.post('/blogs/', data),
  update: (slug: string, data: Record<string, unknown>) => api.patch(`/blogs/${slug}/`, data),
  delete: (slug: string) => api.delete(`/blogs/${slug}/`),
};

export const testimonialService = {
  getAll: () => api.get<Testimonial[]>('/testimonials/'),
};

export const faqService = {
  getAll: (params?: Record<string, unknown>) => api.get<FAQ[]>('/faqs/', { params }),
};
