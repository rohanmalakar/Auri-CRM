export interface OrgUserType {
  org_user_id: string;
  org_id: string;
  name: string;
  email: string;
  tel?: string;
  address?: string;
  picture?: string;
  status?: 'Active' | 'Inactive';
  designation?: 'Cashier' | 'Manager' | 'Admin' | 'Other';
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
