import { Users, School, Building2, TrendingUp } from "lucide-react";

export type DashboardStats = {
  totalAlumni: number;
  totalSchools: number;
  totalCompanies: number;
  recentRegistrations: number;
};

export const getStatsCardsConfig = (stats: DashboardStats) => [
  {
    title: "Total Alumni",
    value: stats.totalAlumni,
    icon: Users,
    description: "Registered members",
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-50 to-blue-100",
  },
  {
    title: "YES INDIA Schools",
    value: stats.totalSchools,
    icon: School,
    description: "Represented schools",
    gradient: "from-green-500 to-green-600",
    bgGradient: "from-green-50 to-green-100",
  },
  {
    title: "Companies",
    value: stats.totalCompanies,
    icon: Building2,
    description: "Organizations",
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-50 to-purple-100",
  },
  {
    title: "Recent",
    value: stats.recentRegistrations,
    icon: TrendingUp,
    description: "Last 30 days",
    gradient: "from-orange-500 to-orange-600",
    bgGradient: "from-orange-50 to-orange-100",
  },
];
