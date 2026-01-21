import validateRequest from '@middleware/validaterequest';
import { CustomerService } from '@service/customer';
import { Router, Response, NextFunction } from 'express';
import { Request } from '@customTypes/connection';
import z from 'zod';
import { successResponse } from '@utils/response';
import { verifyToken } from '@middleware/auth';

const router = Router();
const customerService = new CustomerService();

// Validation schemas
const SCHEMA = {
  CREATE_CUSTOMER: z.object({
    name_en: z.string().min(1),
    name_ar: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional(),
    joined_at: z.string().datetime().optional(), 
  }),

  UPDATE_CUSTOMER: z.object({
    name_en: z.string().min(1).optional(),
    name_ar: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    email: z.string().email().optional(),
    status: z.enum(['Active', 'Inactive']).optional(),
  }),
};

/**
 * Create a new customer for an organization
 * POST /customer/:org_id
 */
router.post(
  '/:org_id',
  verifyToken,
  validateRequest({
    body: SCHEMA.CREATE_CUSTOMER,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.CREATE_CUSTOMER> = req.body;
    try {
      const customer = await customerService.createCustomer({
        ...body,
        org_id: req.params.org_id as string,
        // If joined_at is passed as string, convert to Date, else undefined (default handled in model)
        joined_at: body.joined_at ? new Date(body.joined_at) : undefined,
      });
      res.send(successResponse({ customer }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get all customers for an organization
 * GET /customer/:org_id
 */
router.get(
  '/:org_id',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const customers = await customerService.getCustomersByOrgId(
        req.params.org_id as string
      );
      res.send(successResponse({ customers }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get a specific customer by ID
 * GET /customer/detail/:customer_id
 */
router.get(
  '/detail/:customer_id',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await customerService.getCustomerById(
        req.params.customer_id as string
      );
      res.send(successResponse({ customer }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Update a customer
 * PUT /customer/:customer_id
 */
router.put(
  '/:customer_id',
  verifyToken,
  validateRequest({
    body: SCHEMA.UPDATE_CUSTOMER,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.UPDATE_CUSTOMER> = req.body;
    try {
      const customer = await customerService.updateCustomer(
        req.params.customer_id as string,
        body
      );
      res.send(successResponse({ customer }));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Delete a customer (soft delete)
 * DELETE /customer/:customer_id
 */
router.delete(
  '/:customer_id',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      await customerService.deleteCustomer(req.params.customer_id as string);
      res.send(successResponse({ message: 'Customer deleted successfully' }));
    } catch (e) {
      next(e);
    }
  }
);

export default router;