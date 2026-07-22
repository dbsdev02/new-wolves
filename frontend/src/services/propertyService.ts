import api from '@/lib/api';
import type { PaginatedResponse, Property, PropertyFilters } from '@/types';

export const propertyService = {
  getAll: (filters: PropertyFilters = {}) =>
    api.get<PaginatedResponse<Property>>('/properties/', { params: filters }),

  getBySlug: (slug: string) =>
    api.get<Property>(`/properties/${slug}/`),

  getFeatured: () =>
    api.get<Property[]>('/properties/featured/'),

  getHot: () =>
    api.get<Property[]>('/properties/hot/'),

  getLuxury: () =>
    api.get<Property[]>('/properties/luxury/'),

  getSimilar: (slug: string) =>
    api.get<Property[]>(`/properties/${slug}/similar/`),

  create: (data: FormData) =>
    api.post<Property>('/properties/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  update: (slug: string, data: FormData) =>
    api.patch<Property>(`/properties/${slug}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  delete: (slug: string) =>
    api.delete(`/properties/${slug}/`),

  uploadImages: (slug: string, images: FormData) =>
    api.post(`/properties/${slug}/upload_images/`, images, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
