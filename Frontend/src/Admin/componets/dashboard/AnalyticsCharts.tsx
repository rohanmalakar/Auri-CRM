import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Building2, Activity } from 'lucide-react';
import type { DashboardStats } from '@/Admin/componets/dashboard/types';

interface Props {
  stats: DashboardStats;
  language: 'en' | 'ar';
  simpleView?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const translations = {
  en: {
    orgStatus: "Organizations by Status",
    userTypes: "User Distribution",
    growth: "Monthly Growth",
    orgTypes: "Organization Types",
    total: "Total",
    organizations: "Organizations"
  },
  ar: {
    orgStatus: "حالة المنظمات",
    userTypes: "توزيع المستخدمين",
    growth: "النمو الشهري",
    orgTypes: "أنواع المنظمات",
    total: "المجموع",
    organizations: "المنظمات"
  }
};

export default function AnalyticsCharts({ stats, language, simpleView = false }: Props) {
  const t = translations[language];
  const isRtl = language === 'ar';

  // Custom tooltip for better styling
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 dark:bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-blue-400 text-sm mt-1">
            {payload[0].value} {t.organizations.toLowerCase()}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 dark:bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-blue-400 text-sm mt-1">
            {payload[0].value} ({((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate total for percentage in pie chart
  const orgStatusWithTotal = stats.distributions.organizationsByStatus.map(item => ({
    ...item,
    total: stats.distributions.organizationsByStatus.reduce((sum, i) => sum + i.value, 0)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Pie Chart - Organization Status */}
      <Card className="dark:bg-zinc-900 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.orgStatus}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orgStatusWithTotal}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {stats.distributions.organizationsByStatus.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Enhanced Custom Legend */}
          <div className="flex justify-center gap-4 mt-6 flex-wrap px-2">
            {stats.distributions.organizationsByStatus.map((entry, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                />
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                  {entry.name}
                </span>
                <span className="text-xs font-semibold text-gray-500 dark:text-zinc-500 ml-1">
                  ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Bar Chart - User Types */}
      <Card className="dark:bg-zinc-900 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
              <Users className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.userTypes}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={stats.distributions.usersByType}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#374151" 
                  opacity={0.1} 
                  vertical={false}
                />
                <XAxis 
                  dataKey="type" 
                  stroke="#6b7280" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  orientation={isRtl ? 'right' : 'left'}
                  tick={{ fill: '#9ca3af' }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)', radius: 4 }}
                  content={<CustomTooltip />}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#barGradient)" 
                  radius={[8, 8, 0, 0]} 
                  maxBarSize={60}
                  animationBegin={0}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Summary Statistics */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <div className="flex justify-between items-center px-2">
              <span className="text-sm text-gray-600 dark:text-zinc-400">{t.total}:</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {stats.distributions.usersByType.reduce((sum, item) => sum + item.count, 0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Monthly Growth Chart - Full Width */}
      {!simpleView && (
        <Card className="col-span-1 lg:col-span-2 dark:bg-zinc-900 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t.growth}
                </CardTitle>
              </div>
              
              {/* Total Growth Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  {stats.insights.monthlyGrowth.reduce((sum, item) => sum + item.count, 0)} {t.total}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={stats.insights.monthlyGrowth}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#374151" 
                    opacity={0.1} 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#9ca3af' }}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#9ca3af' }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(139, 92, 246, 0.1)', radius: 4 }}
                    content={<CustomTooltip />}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#growthGradient)" 
                    radius={[8, 8, 0, 0]}
                    maxBarSize={60}
                    animationBegin={0}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Growth Insights */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-zinc-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.insights.monthlyGrowth.slice(-4).map((month, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800/50 dark:to-zinc-800/30 border border-gray-200 dark:border-zinc-800"
                  >
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">{month.month}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{month.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}