import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardStats } from '@/Admin/componets/dashboard/types';

const translations = {
  en: {
    orgs: "Total Organizations",
    users: "Total Users",
    new: "New Organizations",
    subtitle_orgs: "Active platforms",
    subtitle_users: "Registered users",
    subtitle_new: "This month"
  },
  ar: {
    orgs: "إجمالي المنظمات",
    users: "إجمالي المستخدمين",
    new: "منظمات جديدة",
    subtitle_orgs: "المنصات النشطة",
    subtitle_users: "المستخدمين المسجلين",
    subtitle_new: "هذا الشهر"
  }
};

interface Props {
  stats: DashboardStats;
  language: 'en' | 'ar';
}

export default function StatsCards({ stats, language }: Props) {
  const t = translations[language];

  const cards = [
    {
      title: t.orgs,
      value: stats.totals.organizations,
      subtitle: t.subtitle_orgs,
      icon: Building2,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: t.users,
      value: stats.totals.users,
      subtitle: t.subtitle_users,
      icon: Users,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: t.new,
      value: stats.totals.recentOrganizations,
      subtitle: t.subtitle_new,
      icon: TrendingUp,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-100 dark:bg-orange-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="dark:bg-zinc-900 dark:border-zinc-800 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
                {card.value.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}