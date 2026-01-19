import validateRequest from '@middleware/validaterequest';
import { OrganizationService } from '@service/organization';
import { OrgUserService } from '@service/orgUser';
import { Router, Response, NextFunction } from 'express';
import { Request } from '@customTypes/connection';
import z from 'zod';
import { successResponse } from '@utils/response';
import { verifyToken, verifySuperAdmin } from '@middleware/auth';
import { Organization } from '@models/organisation';
import { OrgUser } from '@models/orgUser';
import { uploadOrganization, uploadProfile } from '@middleware/upload';
import fs from 'fs';
import path from 'path';

const router = Router();
const organizationService = new OrganizationService();
const orgUserService = new OrgUserService();

// Validation schemas
const SCHEMA = {
  ADD_ORGANIZATION: z.object({
    org_name_en: z.string().min(1),
    org_name_ar: z.string().min(1),
    email: z.string().email(),
    vat_no: z.coerce.number().optional(),
    tel: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    pin: z.string().optional(),
    contact_person: z.string().min(1),
    c_mobile: z.string().min(1),
    c_email: z.string().email(),
    picture: z.string().optional(),
    type: z.string().optional(),
    password: z.string().min(4),
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
    c_email: z.string().email().optional().or(z.literal('')),
    picture: z.string().optional(),
    type: z.string().optional(),
    status: z.enum(['Active', 'Inactive']).optional(),
  }),

  ADD_ORGANIZATION_USER: z.object({
    branch_id: z.string().optional(),
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    tel: z.string().optional(),
    address: z.string().optional(),
    picture: z.string().optional(),
    designation: z.enum(['Cashier', 'Manager', 'Admin', 'Other']).optional(),
  }),

  UPDATE_ORGANIZATION_USER: z.object({
    branch_id: z.string().optional(),
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    tel: z.string().optional(),
    address: z.string().optional(),
    picture: z.string().optional(),
    designation: z.enum(['Cashier', 'Manager', 'Admin', 'Other']).optional(),
    status: z.enum(['Active', 'Inactive', 'Deleted']).optional(),
  }),
};

/**
 * Add a new organization
 * POST /organization
 */
router.post(
  '/',
  verifySuperAdmin,
  uploadOrganization.single('picture'),
  validateRequest({
    body: SCHEMA.ADD_ORGANIZATION,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.ADD_ORGANIZATION> = req.body;
    try {
      // If file was uploaded, add the file path to body
      if (req.file) {
        body.picture = `organization/${req.file.filename}`;
      }
      
      const organization = await organizationService.createOrganization(body);
      res.send(successResponse({ organization }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get all organizations
 * GET /organization
 */
router.get(
  '/',
  verifySuperAdmin,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const organizations = await organizationService.getAllOrganizations();
      res.send(successResponse({ organizations }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get organization by ID
 * GET /organization/:org_id
 */
router.get(
  '/:org_id',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const organization = await organizationService.getOrganizationById(
        req.params.org_id as string
      );
      res.send(successResponse({ organization }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Update organization
 * PUT /organization/:org_id
 */
router.put(
  '/:org_id',
  verifySuperAdmin,
  uploadOrganization.single('picture'),
  validateRequest({
    body: SCHEMA.UPDATE_ORGANIZATION,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.UPDATE_ORGANIZATION> = req.body;
    try {
      // If new file was uploaded, delete old picture and add new file path
      if (req.file) {
        // Get existing organization to find old picture
        const existingOrg = await organizationService.getOrganizationById(
          req.params.org_id as string
        );
        
        // Delete old picture if it exists
        if (existingOrg.picture) {
          const oldPicturePath = path.join(__dirname, '../../uploads', existingOrg.picture);
          if (fs.existsSync(oldPicturePath)) {
            fs.unlinkSync(oldPicturePath);
          }
        }
        
        body.picture = `organization/${req.file.filename}`;
      }
      
      const organization = await organizationService.updateOrganization(
        req.params.org_id as string,
        body
      );
      res.send(successResponse({ organization }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Delete organization (soft delete)
 * DELETE /organization/:org_id
 */
router.delete(
  '/:org_id',
  verifySuperAdmin,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      await organizationService.deleteOrganization(req.params.org_id as string);
      res.send(successResponse({ message: 'Organization deleted successfully' }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get all users in an organization
 * GET /organization/:org_id/users
 */
router.get(
  '/:org_id/users',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const users = await organizationService.getOrganizationUsers(
        req.params.org_id as string
      );
      const safeUsers = users.map((user: OrgUser) => user.toSafeObject());
      res.send(successResponse({ users: safeUsers }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get a specific user in an organization
 * GET /organization/:org_id/users/:org_user_id
 */
router.get(
  '/:org_id/users/:org_user_id',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const user = await organizationService.getOrganizationUserById(
        req.params.org_id as string,
        req.params.org_user_id as string
      );
      res.send(successResponse({ user: user.toSafeObject() }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Add a user to an organization
 * POST /organization/:org_id/users
 */
router.post(
  '/:org_id/users',
  verifyToken,
  uploadProfile.single('picture'),
  validateRequest({
    body: SCHEMA.ADD_ORGANIZATION_USER,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.ADD_ORGANIZATION_USER> = req.body;
    try {
      // If file was uploaded, add the file path to body
      if (req.file) {
        body.picture = `profile/${req.file.filename}`;
      }
      
      const user = await orgUserService.createOrgUser({
        ...body,
        org_id: req.params.org_id as string,
      });
      res.send(successResponse({ user: user.toSafeObject() }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Update a user in an organization
 * PUT /organization/:org_id/users/:org_user_id
 */
router.put(
  '/:org_id/users/:org_user_id',
  verifyToken,
  uploadProfile.single('picture'),
  validateRequest({
    body: SCHEMA.UPDATE_ORGANIZATION_USER,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.UPDATE_ORGANIZATION_USER> = req.body;
    try {
      // Verify user belongs to organization
      await organizationService.getOrganizationUserById(
        req.params.org_id as string,
        req.params.org_user_id as string
      );

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

      const user = await orgUserService.updateOrgUser(
        req.params.org_user_id as string,
        body
      );
      res.send(successResponse({ user: user.toSafeObject() }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Delete a user from an organization (soft delete)
 * DELETE /organization/:org_id/users/:org_user_id
 */
router.delete(
  '/:org_id/users/:org_user_id',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      // Verify user belongs to organization
      await organizationService.getOrganizationUserById(
        req.params.org_id as string,
        req.params.org_user_id as string
      );

      await orgUserService.deleteOrgUser(req.params.org_user_id as string);
      res.send(successResponse({ message: 'User deleted successfully' }));
    } catch (e) {
      next(e);
    }
  }
);

export default router;
