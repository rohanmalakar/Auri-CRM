import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  DollarSign,
  Briefcase,
  Gift,
  UserPlus,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

// Translations
const translations = {
  en: {
    totalCustomers: "Total Customers",
    totalRevenue: "Total Revenue",
    servicesThisMonth: "Services This Month",
    pointsRedeemed: "Points Redeemed",
    newCustomers: "New Customers",
    from: "from",
    lastMonth: "last month",
    topServices: "Top Services",
    recentActivity: "Recent Activity",
    customerGrowth: "Customer Growth",
    topBranches: "Top Branches",
    viewAll: "View All",
    orders: "orders",
    minAgo: "min ago",
    redeemedFreeBeardTrim: "redeemed Free Beard Trim",
    earnedPoints: "earned {points} points",
    joinedVIP: "joined VIP Gentlemen",
    redeemedDiscount: "redeemed 25% Off Facial",
    jan: "Jan",
    feb: "Feb",
    mar: "Mar",
    apr: "Apr",
    may: "May",
    jun: "Jun",
  },
  ar: {
    totalCustomers: "إجمالي العملاء",
    totalRevenue: "إجمالي الإيرادات",
    servicesThisMonth: "الخدمات هذا الشهر",
    pointsRedeemed: "النقاط المستبدلة",
    newCustomers: "عملاء جدد",
    from: "من",
    lastMonth: "الشهر الماضي",
    topServices: "أفضل الخدمات",
    recentActivity: "النشاط الأخير",
    customerGrowth: "نمو العملاء",
    topBranches: "أفضل الفروع",
    viewAll: "عرض الكل",
    orders: "طلبات",
    minAgo: "دقيقة",
    redeemedFreeBeardTrim: "استبدل تشذيب لحية مجاني",
    earnedPoints: "حصل على {points} نقطة",
    joinedVIP: "انضم إلى VIP Gentlemen",
    redeemedDiscount: "استبدل خصم 25٪ على العناية بالوجه",
    jan: "يناير",
    feb: "فبراير",
    mar: "مارس",
    apr: "أبريل",
    may: "مايو",
    jun: "يونيو",
  },
};


export default function OrgUserDashboard() {
  const { language } = useAppSelector((state) => state.settings);
  const [selectedMonth, setSelectedMonth] = useState("jun");
  const { user } = useAppSelector((state) => state.orgAuth);

  const t = translations[language];
  const isRTL = language === "ar";


  const stats = [
    {
      title: t.totalCustomers,
      value: "2,450",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: t.totalRevenue,
      value: "SAR 124,010",
      change: "+8.2%",
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: t.servicesThisMonth,
      value: "1,847",
      change: "+15.3%",
      icon: Briefcase,
      color: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: t.pointsRedeemed,
      value: "34,700",
      change: "+5.7%",
      icon: Gift,
      color: "text-orange-600 dark:text-orange-400",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      title: t.newCustomers,
      value: "156",
      change: "+22.1%",
      icon: UserPlus,
      color: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
    },
  ];

  const topServices = [
    { name: language === "ar" ? "قص شعر" : "Haircut", orders: 840, percentage: 100, color: "bg-blue-500" },
    { name: language === "ar" ? "تشذيب اللحية" : "Beard Trim", orders: 620, percentage: 74, color: "bg-blue-400" },
    { name: language === "ar" ? "عناية بالوجه" : "Facial & Scrub", orders: 310, percentage: 37, color: "bg-purple-500" },
    { name: language === "ar" ? "صبغ الشعر" : "Hair Color", orders: 180, percentage: 21, color: "bg-green-500" },
  ];

  const recentActivity = [
    {
      name: "Khalid Ahmed",
      initials: "KA",
      action: t.redeemedFreeBeardTrim,
      time: `2 ${t.minAgo}`,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      name: "Omar Ali",
      initials: "OA",
      action: t.earnedPoints.replace("{points}", "50"),
      time: `5 ${t.minAgo}`,
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    },
    {
      name: "Fahad Khalid",
      initials: "FK",
      action: t.joinedVIP,
      time: `10 ${t.minAgo}`,
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    },
    {
      name: "Saud Omar",
      initials: "SO",
      action: t.redeemedDiscount,
      time: `15 ${t.minAgo}`,
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    },
    {
      name: "Abdullah Ahmed",
      initials: "AA",
      action: t.earnedPoints.replace("{points}", "100"),
      time: `20 ${t.minAgo}`,
      color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    },
  ];

  const topBranches = [
    { name: language === "ar" ? "الفرع الرئيسي - العليا" : "Main Branch - Olaya", value: 45420, percentage: 100, color: "bg-blue-500" },
    { name: language === "ar" ? "العناية الرجالية - وسط المدينة" : "Men's Grooming - Downtown", value: 32350, percentage: 71, color: "bg-green-500" },
    { name: language === "ar" ? "العناية اللطيفة - المول" : "Gentle Groom - Mall", value: 28700, percentage: 63, color: "bg-blue-400" },
    { name: language === "ar" ? "صالون الحلاقة السريع" : "Express Barber Bar", value: 17540, percentage: 39, color: "bg-green-400" },
  ];

  const customerGrowthData = [
    { month: t.jan, value: 20 },
    { month: t.feb, value: 35 },
    { month: t.mar, value: 45 },
    { month: t.apr, value: 60 },
    { month: t.may, value: 80 },
    { month: t.jun, value: 95 },
  ];

  const months = [
    { value: "jan", label: t.jan },
    { value: "feb", label: t.feb },
    { value: "mar", label: t.mar },
    { value: "apr", label: t.apr },
    { value: "may", label: t.may },
    { value: "jun", label: t.jun },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl p-4 sm:p-6 lg:p-8 transition-colors bg-gray-50 dark:bg-gray-900"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Control Panel */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {language === "ar" ? "لوحة التحكم" : "Dashboard"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user?.name} • {user?.designation ? (language === "ar" 
              ? user.designation === 'Admin' ? "مسؤول" : user.designation === 'Manager' ? "مدير" : user.designation === 'Cashier' ? "كاشير" : "آخر"
              : user.designation
            ) : (language === "ar" ? "مستخدم" : "User")}
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </h3>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {stat.change}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {t.from} {t.lastMonth}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Top Services & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Services */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-xl font-bold">{t.topServices}</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                    {t.viewAll}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topServices.map((service, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {service.name}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {service.orders.toLocaleString()} {t.orders}
                      </span>
                    </div>
                    <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${service.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${service.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">{t.recentActivity}</CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 gap-1">
                  {t.viewAll}
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${activity.color} flex items-center justify-center font-semibold text-sm`}>
                      {activity.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {activity.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {activity.action}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Growth & Top Branches */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Growth */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{t.customerGrowth}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-64">
                <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M 0 ${200 - customerGrowthData[0].value * 2} 
                       L 120 ${200 - customerGrowthData[1].value * 2}
                       L 240 ${200 - customerGrowthData[2].value * 2}
                       L 360 ${200 - customerGrowthData[3].value * 2}
                       L 480 ${200 - customerGrowthData[4].value * 2}
                       L 600 ${200 - customerGrowthData[5].value * 2}
                       L 600 200 L 0 200 Z`}
                    fill="url(#gradient)"
                  />
                  <path
                    d={`M 0 ${200 - customerGrowthData[0].value * 2} 
                       L 120 ${200 - customerGrowthData[1].value * 2}
                       L 240 ${200 - customerGrowthData[2].value * 2}
                       L 360 ${200 - customerGrowthData[3].value * 2}
                       L 480 ${200 - customerGrowthData[4].value * 2}
                       L 600 ${200 - customerGrowthData[5].value * 2}`}
                    stroke="#3b82f6"
                    strokeWidth="3"
                    fill="none"
                  />
                  {customerGrowthData.map((data, i) => (
                    <circle
                      key={i}
                      cx={i * 120}
                      cy={200 - data.value * 2}
                      r="5"
                      fill="#3b82f6"
                    />
                  ))}
                </svg>
                <div className="flex justify-between mt-2 px-2">
                  {customerGrowthData.map((data, i) => (
                    <span key={i} className="text-xs text-gray-500 dark:text-gray-400">
                      {data.month}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Branches */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">{t.topBranches}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topBranches.map((branch, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
                        {branch.name}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white ml-2">
                        {branch.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${branch.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${branch.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}