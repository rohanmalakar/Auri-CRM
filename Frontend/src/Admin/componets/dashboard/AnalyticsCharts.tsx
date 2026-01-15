import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardStats } from '@/Admin/componets/dashboard/types';

interface Props {
  stats: DashboardStats;
  language: 'en' | 'ar';
  simpleView?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const translations = {
  en: {
    orgStatus: "Organizations by Status",
    userTypes: "User Distribution",
    growth: "Monthly Growth",
    orgTypes: "Organization Types"
  },
  ar: {
    orgStatus: "حالة المنظمات",
    userTypes: "توزيع المستخدمين",
    growth: "النمو الشهري",
    orgTypes: "أنواع المنظمات"
  }
};

export default function AnalyticsCharts({ stats, language, simpleView = false }: Props) {
  const t = translations[language];
  const isRtl = language === 'ar';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Pie Chart - Organization Status */}
      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t.orgStatus}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.distributions.organizationsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.distributions.organizationsByStatus.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                   itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend */}
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {stats.distributions.organizationsByStatus.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-gray-600 dark:text-zinc-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Bar Chart - User Types (Only show if not simpleView or you can choose to show it) */}
      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t.userTypes}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.distributions.usersByType}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="type" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} orientation={isRtl ? 'right' : 'left'} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 3. Additional Charts for Analytics Tab */}
      {!simpleView && (
        <Card className="col-span-1 lg:col-span-2 dark:bg-zinc-900 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{t.growth}</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-[300px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={stats.insights.monthlyGrowth}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                      <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}