import validateRequest from '@middleware/validaterequest';
import { BranchService } from '@service/branch';
import { Router, Response, NextFunction } from 'express';
import { Request } from '@customTypes/connection';
import z from 'zod';
import { successResponse } from '@utils/response';
import { verifyToken } from '@middleware/auth';

const router = Router();
const branchService = new BranchService();

// Validation schemas
const SCHEMA = {
  CREATE_BRANCH: z.object({
    name_en: z.string().min(1),
    name_ar: z.string().min(1),
    branch_phone_number: z.string().min(1),
    city: z.string().min(1),
    address: z.string().min(1),
    location_link: z.string().optional(),
  }),

  UPDATE_BRANCH: z.object({
    name_en: z.string().min(1).optional(),
    name_ar: z.string().min(1).optional(),
    branch_phone_number: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    location_link: z.string().optional(),
    status: z.enum(['Active', 'Inactive']).optional(),
  }),
};

/**
 * Create a new branch for an organization
 * POST /branch/:org_id
 */
router.post(
  '/:org_id',
  verifyToken,
  validateRequest({
    body: SCHEMA.CREATE_BRANCH,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.CREATE_BRANCH> = req.body;
    try {
      const branch = await branchService.createBranch({
        ...body,
        org_id: req.params.org_id as string,
      });
      res.send(successResponse({ branch }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get all branches for an organization
 * GET /branch/:org_id
 */
router.get(
  '/:org_id',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const branches = await branchService.getBranchesByOrgId(
        req.params.org_id as string
      );
      res.send(successResponse({ branches }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get active branches for an organization
 * GET /branch/:org_id/active
 */
router.get(
  '/:org_id/active',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const branches = await branchService.getActiveBranchesByOrgId(
        req.params.org_id as string
      );
      res.send(successResponse({ branches }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get a specific branch by ID
 * GET /branch/detail/:branch_id
 */
router.get(
  '/detail/:branch_id',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const branch = await branchService.getBranchById(
        req.params.branch_id as string
      );
      res.send(successResponse({ branch }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Update a branch
 * PUT /branch/:branch_id
 */
router.put(
  '/:branch_id',
  verifyToken,
  validateRequest({
    body: SCHEMA.UPDATE_BRANCH,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.UPDATE_BRANCH> = req.body;
    try {
      const branch = await branchService.updateBranch(
        req.params.branch_id as string,
        body
      );
      res.send(successResponse({ branch }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Delete a branch (soft delete)
 * DELETE /branch/:branch_id
 */
router.delete(
  '/:branch_id',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      await branchService.deleteBranch(req.params.branch_id as string);
      res.send(successResponse({ message: 'Branch deleted successfully' }));
    } catch (e) {
      next(e);
    }
  }
);

export default router;
