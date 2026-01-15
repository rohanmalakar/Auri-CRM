import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, User } from 'lucide-react';
import type { RecentData } from '@/Admin/componets/dashboard/types';

interface Props {
  data: RecentData;
  language: 'en' | 'ar';
}

const translations = {
  en: {
    recentOrgs: "Recent Organizations",
    recentUsers: "Recent Users",
    noData: "No recent activity found."
  },
  ar: {
    recentOrgs: "المنظمات الحديثة",
    recentUsers: "المستخدمين الجدد",
    noData: "لا يوجد نشاط حديث."
  }
};

export default function RecentActivity({ data, language }: Props) {
  const t = translations[language];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-100';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Recent Orgs */}
      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            {t.recentOrgs}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {data.recentOrganizations.length > 0 ? (
                data.recentOrganizations.map((org) => (
                  <div key={org.org_id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-zinc-100">{org.name}</span>
                      <span className="text-xs text-gray-500 dark:text-zinc-400">{new Date(org.creation_datetime).toLocaleDateString()}</span>
                    </div>
                    <Badge variant="outline" className={`border-0 ${getStatusColor(org.status)}`}>
                      {org.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">{t.noData}</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Card className="dark:bg-zinc-900 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-purple-500" />
            {t.recentUsers}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {data.recentUsers.length > 0 ? (
                data.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-zinc-100">{user.name}</span>
                      <span className="text-xs text-gray-500 dark:text-zinc-400">{user.org_name}</span>
                    </div>
                    <Badge variant="secondary" className="dark:bg-zinc-700 dark:text-zinc-300">
                      {user.type}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">{t.noData}</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}