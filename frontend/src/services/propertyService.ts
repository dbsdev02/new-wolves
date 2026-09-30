import api from '@/lib/api';
import type { PaginatedResponse, Property, PropertyFilters, Amenity, FloorPlan } from '@/types';

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

  deleteImage: (slug: string, imageId: number) =>
    api.delete(`/properties/${slug}/images/${imageId}/`),

  addFloorPlan: (slug: string, data: FormData) =>
    api.post<FloorPlan>(`/properties/${slug}/add_floor_plan/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  deleteFloorPlan: (slug: string, planId: number) =>
    api.delete(`/properties/${slug}/floor-plans/${planId}/`),

  bulkAction: (ids: number[], action: string) =>
    api.post<{ detail: string; count: number }>('/properties/bulk_action/', { ids, action }),
};

export const amenityService = {
  getAll: () => api.get<Amenity[]>('/properties/amenities/'),
  create: (data: { name: string; icon?: string; category?: string }) =>
    api.post<Amenity>('/properties/amenities/', data),
  update: (id: number, data: { name?: string; icon?: string; category?: string }) =>
    api.patch<Amenity>(`/properties/amenities/${id}/`, data),
  delete: (id: number) => api.delete(`/properties/amenities/${id}/`),
};
