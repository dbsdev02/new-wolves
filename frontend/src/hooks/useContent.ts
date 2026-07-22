import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { developerService, communityService, projectService, agentService, blogService, testimonialService, faqService } from '@/services/contentService';
import { settingsService } from '@/services';

export const useDevelopers = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['developers', params], queryFn: () => developerService.getAll(params).then(r => r.data), staleTime: 10 * 60 * 1000 });

export const useDeveloper = (slug: string) =>
  useQuery({ queryKey: ['developer', slug], queryFn: () => developerService.getBySlug(slug).then(r => r.data), enabled: !!slug });

export const useFeaturedDevelopers = () =>
  useQuery({ queryKey: ['developers', 'featured'], queryFn: () => developerService.getFeatured().then(r => r.data), staleTime: 10 * 60 * 1000 });

export const useCommunities = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['communities', params], queryFn: () => communityService.getAll(params).then(r => r.data), staleTime: 10 * 60 * 1000 });

export const useCommunity = (slug: string) =>
  useQuery({ queryKey: ['community', slug], queryFn: () => communityService.getBySlug(slug).then(r => r.data), enabled: !!slug });

export const useFeaturedCommunities = () =>
  useQuery({ queryKey: ['communities', 'featured'], queryFn: () => communityService.getFeatured().then(r => r.data), staleTime: 10 * 60 * 1000 });

export const useProjects = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['projects', params], queryFn: () => projectService.getAll(params).then(r => r.data), staleTime: 10 * 60 * 1000 });

export const useProject = (slug: string) =>
  useQuery({ queryKey: ['project', slug], queryFn: () => projectService.getBySlug(slug).then(r => r.data), enabled: !!slug });

export const useFeaturedProjects = () =>
  useQuery({ queryKey: ['projects', 'featured'], queryFn: () => projectService.getFeatured().then(r => r.data), staleTime: 10 * 60 * 1000 });

export const useAgents = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['agents', params], queryFn: () => agentService.getAll(params).then(r => r.data), staleTime: 10 * 60 * 1000 });

export const useAgent = (id: number) =>
  useQuery({ queryKey: ['agent', id], queryFn: () => agentService.getById(id).then(r => r.data), enabled: !!id && !isNaN(id) });

export const useBlogs = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['blogs', params], queryFn: () => blogService.getAll(params).then(r => r.data), staleTime: 5 * 60 * 1000 });

export const useBlog = (slug: string) =>
  useQuery({ queryKey: ['blog', slug], queryFn: () => blogService.getBySlug(slug).then(r => r.data), enabled: !!slug });

export const useFeaturedBlogs = () =>
  useQuery({ queryKey: ['blogs', 'featured'], queryFn: () => blogService.getFeatured().then(r => r.data), staleTime: 10 * 60 * 1000 });

export const useTestimonials = () =>
  useQuery({ queryKey: ['testimonials'], queryFn: () => testimonialService.getAll().then(r => r.data), staleTime: 30 * 60 * 1000 });

export const useFAQs = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['faqs', params], queryFn: () => faqService.getAll(params).then(r => r.data), staleTime: 30 * 60 * 1000 });

export const useSiteSettings = () =>
  useQuery({ queryKey: ['site-settings'], queryFn: () => settingsService.get().then(r => r.data), staleTime: 30 * 60 * 1000 });
