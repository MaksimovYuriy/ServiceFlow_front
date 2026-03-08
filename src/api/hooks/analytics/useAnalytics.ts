import { useQuery } from "@tanstack/react-query";
import {
  fetchSummary,
  fetchRevenue,
  fetchMasters,
  fetchServices,
  fetchClients,
  fetchMaterials,
} from "../../analytics";

export const useSummary = (from: string, to: string) =>
  useQuery({
    queryKey: ["analytics", "summary", from, to],
    queryFn: () => fetchSummary(from, to),
  });

export const useRevenue = (from: string, to: string) =>
  useQuery({
    queryKey: ["analytics", "revenue", from, to],
    queryFn: () => fetchRevenue(from, to),
  });

export const useAnalyticsMasters = (from: string, to: string) =>
  useQuery({
    queryKey: ["analytics", "masters", from, to],
    queryFn: () => fetchMasters(from, to),
  });

export const useAnalyticsServices = (from: string, to: string) =>
  useQuery({
    queryKey: ["analytics", "services", from, to],
    queryFn: () => fetchServices(from, to),
  });

export const useAnalyticsClients = (from: string, to: string) =>
  useQuery({
    queryKey: ["analytics", "clients", from, to],
    queryFn: () => fetchClients(from, to),
  });

export const useAnalyticsMaterials = (from: string, to: string) =>
  useQuery({
    queryKey: ["analytics", "materials", from, to],
    queryFn: () => fetchMaterials(from, to),
  });
