export interface DashboardStats {
  totals: {
    organizations: number;
    users: number;
    recentOrganizations: number;
  };
  distributions: {
    organizationsByStatus: { name: string; value: number }[];
    usersByType: { type: string; count: number }[];
    organizationsByType: { type: string; count: number }[];
  };
  insights: {
    monthlyGrowth: { month: string; count: number }[];
  };
}

export interface RecentData {
  recentOrganizations: {
    org_id: string;
    name: string;
    status: string;
    creation_datetime: string;
  }[];
  recentUsers: {
    id: string;
    name: string;
    type: string;
    org_name: string;
    creation_datetime: string;
  }[];
}