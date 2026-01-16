import { Request as ExpressRequest } from 'express';

export interface Request extends ExpressRequest {
  user?: {
    id: string | number;
    org_id?: string;
    type?: string;
    is_admin?: boolean;
    is_super_admin?: boolean;
  };
  userID?: number;
  isAdmin?: boolean;
}
