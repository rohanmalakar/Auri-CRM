export interface OrgUserType {
  org_user_id: string;
  org_id: string;
  name: string;
  email: string;
  tel?: string;
  address?: string;
  picture?: string;
  type: 'admin' | 'user';
  status?: 'Active' | 'Inactive';
  app_access?: string;
  designation?: number;
  station_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateOrgUserPayload {
  org_id: string;
  branch_id?: string;
  name: string;
  email: string;
  password: string;
  tel?: string;
  address?: string;
  picture?: string;
  designation?: 'Cashier' | 'Manager' | 'Admin' | 'Other';
}
