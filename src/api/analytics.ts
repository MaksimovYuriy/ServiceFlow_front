import { api } from "./middlewares/axios";
import type {
  AnalyticsSummary,
  RevenueData,
  MastersData,
  ServicesData,
  ClientsData,
  MaterialsData,
} from "../types/analytics";

const params = (from: string, to: string) => ({ params: { from, to } });

export const fetchSummary = (from: string, to: string) =>
  api.get<AnalyticsSummary>("/api/analytics/summary", params(from, to)).then((r) => r.data);

export const fetchRevenue = (from: string, to: string) =>
  api.get<RevenueData>("/api/analytics/revenue", params(from, to)).then((r) => r.data);

export const fetchMasters = (from: string, to: string) =>
  api.get<MastersData>("/api/analytics/masters", params(from, to)).then((r) => r.data);

export const fetchServices = (from: string, to: string) =>
  api.get<ServicesData>("/api/analytics/services", params(from, to)).then((r) => r.data);

export const fetchClients = (from: string, to: string) =>
  api.get<ClientsData>("/api/analytics/clients", params(from, to)).then((r) => r.data);

export const fetchMaterials = (from: string, to: string) =>
  api.get<MaterialsData>("/api/analytics/materials", params(from, to)).then((r) => r.data);
