import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {  RotateCcw } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';

// Components
import StatsCards from '@/Admin/componets/dashboard/StatsCards';
import AnalyticsCharts from '@/Admin/componets/dashboard/AnalyticsCharts';
import RecentActivity from '@/Admin/componets/dashboard/RecentActivity';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

// Types
import type{ DashboardStats, RecentData } from '../../componets/dashboard/types';

// Translations
const translations = {
  en: {
    title: "Admin Dashboard",
    subtitle: "Welcome back! Here's an overview of your platform.",
    refresh: "Refresh",
    tabs: {
      overview: "Overview",
      analytics: "Analytics",
      recent: "Recent Activity"
    },
    loading: "Loading dashboard data..."
  },
  ar: {
    title: "لوحة تحكم المسؤول",
    subtitle: "مرحباً بعودتك! إليك نظرة عامة على المنصة.",
    refresh: "تحديث",
    tabs: {
      overview: "نظرة عامة",
      analytics: "التحليلات",
      recent: "النشاط الأخير"
    },
    loading: "جارٍ تحميل البيانات..."
  }
};

export default function Dashboard() {
  const { language } = useAppSelector((state) => state.settings);
  const t = translations[language];
  const isRtl = language === 'ar';

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<RecentData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulating API calls - Replace with your actual endpoints
      // const [statsRes, recentRes] = await Promise.all([
      //   api.get('/dashboard/stats'),
      //   api.get('/dashboard/recent')
      // ]);
      // setStats(statsRes.data);
      // setRecent(recentRes.data);
      
      // MOCK DATA FOR DEMONSTRATION
      setTimeout(() => {
         setStats({
           totals: { organizations: 120, users: 4500, recentOrganizations: 12 },
           distributions: {
             organizationsByStatus: [{ name: 'Active', value: 80 }, { name: 'Pending', value: 20 }, { name: 'Suspended', value: 5 }],
             usersByType: [{ type: 'Admin', count: 50 }, { type: 'User', count: 400 }],
             organizationsByType: [{ type: 'Retail', count: 60 }, { type: 'Tech', count: 40 }]
           },
           insights: {
             monthlyGrowth: [
               { month: 'Jan', count: 10 }, { month: 'Feb', count: 25 }, { month: 'Mar', count: 40 },
               { month: 'Apr', count: 35 }, { month: 'May', count: 55 }, { month: 'Jun', count: 70 }
             ]
           }
         });
         setRecent({
           recentOrganizations: [
             { org_id: '1', name: 'Tech Corp', status: 'Active', creation_datetime: '2025-01-10' },
             { org_id: '2', name: 'Retail Hub', status: 'Pending', creation_datetime: '2025-01-12' },
           ],
           recentUsers: [
             { id: '1', name: 'Ahmed Ali', type: 'Org Admin', org_name: 'Tech Corp', creation_datetime: '2025-01-11' }
           ]
         });
         setLoading(false);
      }, 1000);

    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">
            {t.title}
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-1">
            {t.subtitle}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchData} 
          className="gap-2 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {t.refresh}
        </Button>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] dark:bg-zinc-900">
            <TabsTrigger value="overview">{t.tabs.overview}</TabsTrigger>
            <TabsTrigger value="analytics">{t.tabs.analytics}</TabsTrigger>
            <TabsTrigger value="recent">{t.tabs.recent}</TabsTrigger>
          </TabsList>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <TabsContent value="overview" className="mt-6 space-y-6">
              {stats && <StatsCards stats={stats} language={language} />}
              {stats && <AnalyticsCharts stats={stats} language={language} simpleView />}
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              {stats && <AnalyticsCharts stats={stats} language={language} />}
            </TabsContent>

            <TabsContent value="recent" className="mt-6">
              {recent && <RecentActivity data={recent} language={language} />}
            </TabsContent>
          </motion.div>
        </Tabs>
      )}
    </div>
  );
}

// Simple Skeleton Loader Component
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    </div>
  );
}