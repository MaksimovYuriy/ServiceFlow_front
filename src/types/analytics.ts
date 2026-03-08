export interface AnalyticsSummary {
  period_from: string;
  period_to: string;
  total_notes: number;
  completed: number;
  canceled: number;
  pending: number;
  total_revenue: number;
  average_check: number;
  cancellation_rate: number;
  total_clients: number;
  total_masters: number;
  total_services: number;
}

export interface RevenueMonth {
  month: string;
  revenue: number;
  notes_count: number;
  canceled_count: number;
}

export interface RevenueData {
  monthly: RevenueMonth[];
}

export interface MasterAnalytics {
  id: number;
  name: string;
  completed_notes: number;
  revenue: number;
  cancellation_rate: number;
  weekly_schedule_hours: number;
  total_booked_hours: number;
}

export interface MastersData {
  masters: MasterAnalytics[];
}

export interface ServiceAnalytics {
  id: number;
  title: string;
  notes_count: number;
  revenue: number;
  revenue_share: number;
}

export interface ServicesData {
  services: ServiceAnalytics[];
}

export interface TopClient {
  id: number;
  name: string;
  phone: string;
  visits: number;
  total_spent: number;
}

export interface ClientsData {
  unique_clients: number;
  new_clients: number;
  repeat_clients: number;
  top_clients: TopClient[];
}

export interface LowStockItem {
  id: number;
  title: string;
  quantity: number;
  minimal_quantity: number;
}

export interface UsageDetail {
  id: number;
  title: string;
  quantity: number;
  usage: number;
  price: number;
}

export interface MaterialsData {
  total_stock_value: number;
  low_stock_count: number;
  low_stock: LowStockItem[];
  usage_details: UsageDetail[];
}
