import validateRequest from '@middleware/validaterequest';
import { OrgUserService } from '@service/orgUser';
import { OrganizationService } from '@service/organization';
import { OrgUser } from '@models/orgUser';
import { Router, Response, NextFunction } from 'express';
import { Request } from '@customTypes/connection';
import z from 'zod';
import { successResponse } from '@utils/response';
import { verifyToken } from '@middleware/auth';
import { uploadProfile, uploadOrganization } from '@middleware/upload';
import fs from 'fs';
import path from 'path';

const router = Router();
const orgUserService = new OrgUserService();
const organizationService = new OrganizationService();

// Validation schemas
const SCHEMA = {
  CREATE_ORG_USER: z.object({
    org_id: z.string().min(1),
    branch_id: z.string().optional(),
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    tel: z.string().optional(),
    address: z.string().optional(),
    designation: z.enum(['Cashier', 'Manager', 'Admin', 'Other']).optional(),
  }),

  LOGIN_ORG_USER: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),

  UPDATE_ORG_USER: z.object({
    branch_id: z.string().optional(),
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    tel: z.string().optional(),
    address: z.string().optional(),
    picture: z.string().optional(),
    designation: z.enum(['Cashier', 'Manager', 'Admin', 'Other']).optional(),
    status: z.enum(['Active', 'Inactive', 'Deleted']).optional(),
  }),

  CHANGE_PASSWORD: z.object({
    old_password: z.string().min(1),
    new_password: z.string().min(6),
  }),

  GET_BY_ORG_ID: z.object({
    org_id: z.string().min(1),
  }),

  UPDATE_ORGANIZATION: z.object({
    org_name_en: z.string().min(1).optional(),
    org_name_ar: z.string().min(1).optional(),
    email: z.string().email().optional(),
    vat_no: z.coerce.number().optional(),
    tel: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    pin: z.string().optional(),
    contact_person: z.string().optional(),
    c_mobile: z.string().optional(),
    c_email: z.string().email().optional(),
    picture: z.string().optional(),
    type: z.string().optional(),
    status: z.enum(['Active', 'Inactive']).optional(),
  }),
};

/**
 * Create a new org user
 */
router.post(
  '/create',
  verifyToken,
  uploadProfile.single('picture'),
  validateRequest({
    body: SCHEMA.CREATE_ORG_USER,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.CREATE_ORG_USER> & { picture?: string } = req.body;
    try {
      // If file was uploaded, add the file path to body
      if (req.file) {
        body.picture = `profile/${req.file.filename}`;
      }
      
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
 * Get org users by organization ID (from token)
 */
router.get(
  '/by-org',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const org_id = req.user?.org_id;
      if (!org_id) {
        return res.status(400).send(successResponse(null, 'Organization ID not found in token'));
      }
      const orgUsers = await orgUserService.getOrgUsersByOrgId(org_id);
      const safeUsers = orgUsers.map((user: OrgUser) => user.toSafeObject());
      res.send(successResponse({ users: safeUsers }));
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
 * Update org user
 */
router.put(
  '/:org_user_id',
  verifyToken,
  uploadProfile.single('picture'),
  validateRequest({
    body: SCHEMA.UPDATE_ORG_USER,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.UPDATE_ORG_USER> = req.body;
    try {
      // If new file was uploaded, delete old picture and add new file path
      if (req.file) {
        // Get existing user to find old picture
        const existingUser = await orgUserService.getOrgUserById(
          req.params.org_user_id as string
        );
        
        // Delete old picture if it exists
        if (existingUser.picture) {
          const oldPicturePath = path.join(__dirname, '../../uploads', existingUser.picture);
          if (fs.existsSync(oldPicturePath)) {
            fs.unlinkSync(oldPicturePath);
          }
        }
        
        body.picture = `profile/${req.file.filename}`;
      }
      
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

/**
 * Update Organization (Admin only)
 */
router.put(
  '/organization',
  verifyToken,
  uploadOrganization.single('picture'),
  validateRequest({
    body: SCHEMA.UPDATE_ORGANIZATION,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.UPDATE_ORGANIZATION> = req.body;
    try {
      const org_id = req.user?.org_id;
      const userDesignation = req.user?.designation;

      if (!org_id) {
        return res.status(400).send(successResponse(null, 'Organization ID not found in token'));
      }

      // Check if user is admin
      if (userDesignation !== 'Admin') {
        return res.status(403).send(successResponse(null, 'Only organization admins can update organization details'));
      }

      // If new picture was uploaded, delete old picture and add new file path
      if (req.file) {
        const existingOrg = await organizationService.getOrganizationById(org_id);
        
        // Delete old picture if it exists
        if (existingOrg.picture) {
          const oldPicturePath = path.join(__dirname, '../../uploads', existingOrg.picture);
          if (fs.existsSync(oldPicturePath)) {
            fs.unlinkSync(oldPicturePath);
          }
        }
        
        body.picture = `organization/${req.file.filename}`;
      }

      const organization = await organizationService.updateOrganization(org_id, body);
      res.send(successResponse({ organization }, 'Organization updated successfully'));
    } catch (e) {
      next(e);
    }
  }
);

export default router;
