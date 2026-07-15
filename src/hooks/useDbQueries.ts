import { useQuery } from "@tanstack/react-query";
import {
  getSettings,
  getCollections,
  getGallery,
  getTestimonials,
  getServices,
  getProducts,
} from "@/services/db";

// Cache settings: configuration datasets are relatively static, 
// so we set a long staleTime (10 minutes) and keep cache active.
const DEFAULT_STALE_TIME = 1000 * 60 * 10; // 10 minutes

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    staleTime: DEFAULT_STALE_TIME,
  });
}

export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: getCollections,
    staleTime: DEFAULT_STALE_TIME,
  });
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: getGallery,
    staleTime: DEFAULT_STALE_TIME,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
    staleTime: DEFAULT_STALE_TIME,
  });
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServices,
    staleTime: DEFAULT_STALE_TIME,
  });
}

export function useProducts(categoryId: string) {
  return useQuery({
    queryKey: ["products", categoryId],
    queryFn: () => getProducts(categoryId),
    staleTime: 1000 * 60 * 2, // 2 minutes (shorter for product updates)
  });
}

