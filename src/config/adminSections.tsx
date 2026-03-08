import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonIcon from "@mui/icons-material/Person";
import BuildIcon from "@mui/icons-material/Build";
import InventoryIcon from "@mui/icons-material/Inventory";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import LinkIcon from "@mui/icons-material/Link";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EventNoteIcon from "@mui/icons-material/EventNote";

export interface AdminSection {
  title: string;
  path: string;
  icon: React.ReactNode;
}

export const adminSections: AdminSection[] = [
  { title: "Управление записями", path: "/admin/notes", icon: <EventNoteIcon /> },
  { title: "Сотрудники (администрация)", path: "/admin/crm/users", icon: <PeopleAltIcon /> },
  { title: "Сотрудники (мастеры)", path: "/admin/crm/masters", icon: <GroupWorkIcon /> },
  { title: "Клиенты", path: "/admin/crm/clients", icon: <PersonIcon /> },
  { title: "Каталог услуг", path: "/admin/crm/services", icon: <BuildIcon /> },
  { title: "Склад", path: "/admin/crm/materials", icon: <InventoryIcon /> },
  { title: "Настройка трат материалов", path: "/admin/crm/service_materials", icon: <LinkIcon /> },
  { title: "Назначение мастеров", path: "/admin/crm/service_masters", icon: <GroupWorkIcon /> },
  { title: "Расписание мастеров", path: "/admin/crm/master_schedule", icon: <CalendarMonthIcon /> },
  { title: "Аналитика", path: "/admin/crm/analytics", icon: <BarChartIcon /> },
  { title: "Анализ цен", path: "/admin/price_analysis", icon: <TrendingUpIcon /> },
  { title: "Прогноз закупок", path: "/admin/material_forecast", icon: <ShoppingCartIcon /> },
];
