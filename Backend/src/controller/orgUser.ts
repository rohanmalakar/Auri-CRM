import validateRequest from '@middleware/validaterequest';
import { OrgUserService } from '@service/orgUser';
import { OrgUser } from '@models/orgUser';
import { Router, Response, NextFunction } from 'express';
import { Request } from '@customTypes/connection';
import z from 'zod';
import { successResponse } from '@utils/response';
import { verifyToken } from '@middleware/auth';

const router = Router();
const orgUserService = new OrgUserService();

// Validation schemas
const SCHEMA = {
  CREATE_ORG_USER: z.object({
    org_id: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    tel: z.string().optional(),
    address: z.string().optional(),
    picture: z.string().optional(),
    type: z.string().min(1),
    app_access: z.string().optional(),
    designation: z.number().optional(),
    station_id: z.number().optional(),
  }),

  LOGIN_ORG_USER: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),

  UPDATE_ORG_USER: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    tel: z.string().optional(),
    address: z.string().optional(),
    picture: z.string().optional(),
    type: z.string().min(1).optional(),
    app_access: z.string().optional(),
    designation: z.number().optional(),
    station_id: z.number().optional(),
    status: z.enum(['Active', 'Inactive']).optional(),
  }),

  CHANGE_PASSWORD: z.object({
    old_password: z.string().min(1),
    new_password: z.string().min(6),
  }),

  GET_BY_ORG_ID: z.object({
    org_id: z.string().min(1),
  }),
};

/**
 * Create a new org user
 */
router.post(
  '/create',
  verifyToken,
  validateRequest({
    body: SCHEMA.CREATE_ORG_USER,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.CREATE_ORG_USER> = req.body;
    try {
      const orgUser = await orgUserService.createOrgUser(body);
      res.send(successResponse({ user: orgUser.toSafeObject() }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Login org user
 */
router.post(
  '/login',
  validateRequest({
    body: SCHEMA.LOGIN_ORG_USER,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.LOGIN_ORG_USER> = req.body;
    try {
      const authUser = await orgUserService.loginOrgUser(
        body.email,
        body.password
      );
      res.send(successResponse(authUser));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get org user by ID
 */
router.get(
  '/:org_user_id',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const orgUser = await orgUserService.getOrgUserById(
        req.params.org_user_id as string
      );
      res.send(successResponse({ user: orgUser.toSafeObject() }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get all org users
 */
router.get(
  '/',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const orgUsers = await orgUserService.getAllOrgUsers();
      const safeUsers = orgUsers.map((user: OrgUser) => user.toSafeObject());
      res.send(successResponse({ users: safeUsers }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get org users by organization ID
 */
router.post(
  '/by-org',
  verifyToken,
  validateRequest({
    body: SCHEMA.GET_BY_ORG_ID,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.GET_BY_ORG_ID> = req.body;
    try {
      const orgUsers = await orgUserService.getOrgUsersByOrgId(body.org_id);
      const safeUsers = orgUsers.map((user: OrgUser) => user.toSafeObject());
      res.send(successResponse({ users: safeUsers }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Update org user
 */
router.put(
  '/:org_user_id',
  verifyToken,
  validateRequest({
    body: SCHEMA.UPDATE_ORG_USER,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.UPDATE_ORG_USER> = req.body;
    try {
      const orgUser = await orgUserService.updateOrgUser(
        req.params.org_user_id as string,
        body
      );
      res.send(successResponse({ user: orgUser.toSafeObject() }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Delete org user (soft delete)
 */
router.delete(
  '/:org_user_id',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      await orgUserService.deleteOrgUser(req.params.org_user_id as string);
      res.send(successResponse({ message: 'Org user deleted successfully' }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Change password
 */
router.post(
  '/:org_user_id/change-password',
  verifyToken,
  validateRequest({
    body: SCHEMA.CHANGE_PASSWORD,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.CHANGE_PASSWORD> = req.body;
    try {
      await orgUserService.changePassword(
        req.params.org_user_id as string,
        body.old_password,
        body.new_password
      );
      res.send(successResponse({ message: 'Password changed successfully' }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get active org users by organization ID
 */
router.post(
  '/active/by-org',
  verifyToken,
  validateRequest({
    body: SCHEMA.GET_BY_ORG_ID,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.GET_BY_ORG_ID> = req.body;
    try {
      const orgUsers = await orgUserService.getActiveOrgUsersByOrgId(
        body.org_id
      );
      const safeUsers = orgUsers.map((user: OrgUser) => user.toSafeObject());
      res.send(successResponse({ users: safeUsers }));
    } catch (e) {
      next(e);
    }
  }
);

export default router;
