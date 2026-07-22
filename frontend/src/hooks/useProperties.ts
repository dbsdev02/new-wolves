import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/services/propertyService';
import type { PropertyFilters } from '@/types';

export const useProperties = (filters: PropertyFilters = {}) =>
  useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyService.getAll(filters).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

export const useProperty = (slug: string) =>
  useQuery({
    queryKey: ['property', slug],
    queryFn: () => propertyService.getBySlug(slug).then(r => r.data),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

export const useFeaturedProperties = () =>
  useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: () => propertyService.getFeatured().then(r => r.data),
    staleTime: 10 * 60 * 1000,
  });

export const useHotProperties = () =>
  useQuery({
    queryKey: ['properties', 'hot'],
    queryFn: () => propertyService.getHot().then(r => r.data),
    staleTime: 10 * 60 * 1000,
  });

export const useMultipleProperties = (slugs: string[]) => {
  const results = useQueries({
    queries: slugs.map((slug) => ({
      queryKey: ['property', slug],
      queryFn: () => propertyService.getBySlug(slug).then(r => r.data),
      staleTime: 5 * 60 * 1000,
    })),
  });
  return {
    properties: results.map(r => r.data).filter((p): p is NonNullable<typeof p> => !!p),
    isLoading: results.some(r => r.isLoading),
  };
};

export const useSimilarProperties = (slug: string) =>
  useQuery({
    queryKey: ['properties', 'similar', slug],
    queryFn: () => propertyService.getSimilar(slug).then(r => r.data),
    enabled: !!slug,
  });

export const useDeleteProperty = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => propertyService.delete(slug),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }),
  });
};
