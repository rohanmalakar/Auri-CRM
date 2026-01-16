import validateRequest from '@middleware/validaterequest';
import { AdminService } from '@service/admin';
import { Admin } from '@models/admin';
import { Router, Response, NextFunction } from 'express';
import { Request } from '@customTypes/connection';
import z from 'zod';
import { successResponse } from '@utils/response';
import { verifySuperAdmin } from '@middleware/auth';
import { max } from 'lodash';

const router = Router();
const adminService = new AdminService();

// Validation schemas
const SCHEMA = {
  CREATE_ADMIN: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    type: z.string().optional(),
  }),

  LOGIN_ADMIN: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),

  UPDATE_ADMIN: z.object({
    email: z.string().email().optional(),
    type: z.string().optional(),
  }),

  CHANGE_PASSWORD: z.object({
    old_password: z.string().min(1),
    new_password: z.string().min(6),
  }),
};

/**
 * Create a new admin
 * POST /admin/create
 */
router.post(
  '/create',
  // verifySuperAdmin,
  validateRequest({
    body: SCHEMA.CREATE_ADMIN,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.CREATE_ADMIN> = req.body;
    try {
      const admin = await adminService.createAdmin(body);
      res.send(successResponse({ admin: admin.toSafeObject() }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Login admin
 * POST /admin/login
 */
router.post(
  '/login',
  validateRequest({
    body: SCHEMA.LOGIN_ADMIN,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.LOGIN_ADMIN> = req.body;
    try {
      const authAdmin = await adminService.loginAdmin(
        body.email,
        body.password
      );

      const maxAge = 24 * 60 * 60 * 1000; // 1 day

      res.cookie('access_token', authAdmin.access_token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', // True in Prod (HTTPS), False in Local (HTTP)
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: maxAge, // Sets the time the cookie lives
      });

      res.send(successResponse(authAdmin));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get admin by ID
 * GET /admin/:super_u_id
 */
router.get(
  '/:super_u_id',
  verifySuperAdmin,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await adminService.getAdminById(
        req.params.super_u_id as string
      );
      res.send(successResponse({ admin: admin.toSafeObject() }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get all admins
 * GET /admin
 */
router.get(
  '/',
  verifySuperAdmin,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await adminService.getAllAdmins();
      const safeAdmins = admins.map((admin: Admin) => admin.toSafeObject());
      res.send(successResponse({ admins: safeAdmins }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Update admin
 * PUT /admin/:super_u_id
 */
router.put(
  '/:super_u_id',
  verifySuperAdmin,
  validateRequest({
    body: SCHEMA.UPDATE_ADMIN,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.UPDATE_ADMIN> = req.body;
    try {
      const admin = await adminService.updateAdmin(
        req.params.super_u_id as string,
        body
      );
      res.send(successResponse({ admin: admin.toSafeObject() }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Delete admin
 * DELETE /admin/:super_u_id
 */
router.delete(
  '/:super_u_id',
  verifySuperAdmin,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.deleteAdmin(req.params.super_u_id as string);
      res.send(successResponse({ message: 'Admin deleted successfully' }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Change admin password
 * PUT /admin/:super_u_id/change-password
 */
router.put(
  '/:super_u_id/change-password',
  verifySuperAdmin,
  validateRequest({
    body: SCHEMA.CHANGE_PASSWORD,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.CHANGE_PASSWORD> = req.body;
    try {
      await adminService.changePassword(
        req.params.super_u_id as string,
        body.old_password,
        body.new_password
      );
      res.send(successResponse({ message: 'Password changed successfully' }));
    } catch (e) {
      next(e);
    }
  }
);

export default router;
