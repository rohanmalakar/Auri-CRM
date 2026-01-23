import validateRequest from "../middleware/validaterequest";
import { CustomerProgramService } from "../service/customerProgram";
import { Router, Response, NextFunction } from "express";
import { Request } from "../customTypes/connection";
import z from "zod";
import { successResponse } from "../utils/response";
import { verifyToken } from "../middleware/auth";


const router = Router();
const customerProgramService = new CustomerProgramService();

// Validation schemas
const SCHEMA = {
  ENROLL_CUSTOMER: z.object({
    customer_id: z.string().min(1).optional(),
    program_id: z.string().min(1),
    org_id: z.string().min(1),
    name_en: z.string().min(1),
    name_ar: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
  }),
};


/** * Enroll a customer in a loyalty program
 * POST /customerProgram/enroll
 */ 
router.post(
  "/enroll",
  verifyToken,
  validateRequest({
    body: SCHEMA.ENROLL_CUSTOMER,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    const body: z.infer<typeof SCHEMA.ENROLL_CUSTOMER> = req.body;
    try {
      const enrollment = await customerProgramService.enrollCustomerInProgram({
        program_id: body.program_id,
        org_id: body.org_id,
        name_en: body.name_en,
        name_ar: body.name_ar,
        phone: body.phone,
        email: body.email
      });
      res.send(successResponse({ enrollment }));
    } catch (e) {
      next(e);
    }
  }
);


export default router;