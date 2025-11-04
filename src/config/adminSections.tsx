import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonIcon from "@mui/icons-material/Person";
import BuildIcon from "@mui/icons-material/Build";
import InventoryIcon from "@mui/icons-material/Inventory";
import BarChartIcon from "@mui/icons-material/BarChart";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

export interface AdminSection {
  title: string;
  path: string;
  icon: React.ReactNode;
}

export const adminSections: AdminSection[] = [
  { title: "Сотрудники", path: "/admin/employees", icon: <PeopleAltIcon /> },
  { title: "Клиенты", path: "/admin/clients", icon: <PersonIcon /> },
  { title: "Каталог услуг", path: "/admin/services", icon: <BuildIcon /> },
  { title: "Склад", path: "/admin/inventory", icon: <InventoryIcon /> },
  { title: "Аналитика", path: "/admin/analytics", icon: <BarChartIcon /> },
  { title: "Программа бонусов", path: "/admin/bonuses", icon: <CardGiftcardIcon /> }
];
