import { Request as ExpressRequest } from 'express';

export interface Request extends ExpressRequest {
  user?: {
    id: string | number;
    org_id?: string;
    branch_id?: string;
    type?: string;
    designation?: 'Cashier' | 'Manager' | 'Admin' | 'Other';
    is_admin?: boolean;
    is_super_admin?: boolean;
  };
  userID?: number;
  isAdmin?: boolean;
}
