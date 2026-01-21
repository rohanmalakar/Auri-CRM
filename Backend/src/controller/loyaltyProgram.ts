import { Router, Response, NextFunction } from 'express';
import { Request } from '@customTypes/connection';
import { z } from 'zod';
import validateRequest from '@middleware/validaterequest';
import { verifyToken } from '@middleware/auth';
import { successResponse } from '@utils/response';
import { LoyaltyProgramService } from '@service/loyaltyProgram';
import createLogger from '@utils/logger';

const router = Router();
const logger = createLogger('@loyaltyProgramController');
const loyaltyProgramService = new LoyaltyProgramService();

// Validation schemas
const productSourceSchema = z.enum(['INTERNAL', 'FOODICS']);
const programTypeSchema = z.enum(['POINTS', 'STAMPS']);

const rewardDiscountSchema = z.object({
  discountPercentage: z.number().min(0).max(100),
  maxDiscountAmount: z.number().optional(),
  currencyCode: z.string().optional(),
});

const rewardFreeProductItemSchema = z.object({
  productSource: productSourceSchema,
  internalProductId: z.number().optional(),
  externalProductId: z.string().optional(),
  qtyFree: z.number().int().positive().optional(),
});

const rewardInputSchema = z.object({
  voucherNameEn: z.string().min(1),
  voucherNameAr: z.string().optional(),
  voucherDescriptionEn: z.string().optional(),
  voucherDescriptionAr: z.string().optional(),
  rewardType: z.enum(['DISCOUNT', 'FREE_PRODUCT']),
  costPoints: z.number().int().positive().optional(),
  costStamps: z.number().int().positive().optional(),
  discount: rewardDiscountSchema.optional(),
  freeProducts: z.array(rewardFreeProductItemSchema).optional(),
});

const stampsAccrualProductSchema = z.object({
  productSource: productSourceSchema,
  internalProductId: z.number().optional(),
  externalProductId: z.string().optional(),
  stampsPerItem: z.number().int().positive().optional(),
});

const pointsRulesSchema = z.object({
  currencyCode: z.string().min(1),
  earnPointsPerCurrency: z.number().positive(),
  minSpendToEarn: z.number().optional(),
  roundingMode: z.enum(['FLOOR', 'ROUND', 'CEIL']).optional(),
  pointValueCurrency: z.number().positive(),
  pointTaxPercent: z.number().min(0).max(100).optional(),
  expiryDurationValue: z.number().int().positive().optional(),
  expiryDurationUnit: z.enum(['MONTH', 'YEAR']).optional(),
});

const stampsRulesSchema = z.object({
  stampsTarget: z.number().int().positive(),
  accrualRule: z.enum(['PER_VISIT', 'PER_ITEM']),
  timeRestrictionUnit: z.enum(['NONE', 'DAY', 'HOUR']).optional(),
  timeRestrictionValue: z.number().int().min(0).optional(),
  visitLimitMode: z.enum(['UNLIMITED', 'ONCE_PER_WINDOW', 'MAX_PER_WINDOW']).optional(),
  maxPerWindow: z.number().int().positive().optional(),
  limitScope: z.enum(['ORG', 'BRANCH']).optional(),
});

const walletDesignCommonSchema = z.object({
  cardColor: z.string().optional(),
  cardTitleColor: z.string().optional(),
  cardTextColor: z.string().optional(),
  stripImageUrl: z.string().optional(),
  logoUrl: z.string().optional(),
});

const pointsWalletDesignSchema = walletDesignCommonSchema;

const stampsWalletDesignSchema = walletDesignCommonSchema.extend({
  fulfilledStampIconKey: z.string().optional(),
  fulfilledStampColor: z.string().optional(),
  unfulfilledStampIconKey: z.string().optional(),
  unfulfilledStampColor: z.string().optional(),
});

const SCHEMA = {
  CREATE_FULL_PROGRAM: z.object({
    programType: programTypeSchema,
    nameEn: z.string().min(1),
    nameAr: z.string().optional(),
    descriptionEn: z.string().optional(),
    descriptionAr: z.string().optional(),
    termsEn: z.string().optional(),
    termsAr: z.string().optional(),
    howToUseEn: z.string().optional(),
    howToUseAr: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    pointsRules: pointsRulesSchema.optional(),
    stampsRules: stampsRulesSchema.optional(),
    pointsWalletDesign: pointsWalletDesignSchema.optional(),
    stampsWalletDesign: stampsWalletDesignSchema.optional(),
    stampsAccrualProducts: z.array(stampsAccrualProductSchema).optional(),
    rewards: z.array(rewardInputSchema).min(1),
  }),
  PAGINATION: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional()
  })
};

/**
 * POST /api/loyalty/programs
 * Create a full loyalty program in one transaction
 */
router.post(
  '/',
  verifyToken,
  validateRequest({
    body: SCHEMA.CREATE_FULL_PROGRAM,
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    console.log(req.body);

    const body: z.infer<typeof SCHEMA.CREATE_FULL_PROGRAM> = req.body;
    try {
      if (!req.user?.org_id) {
        console.log(req.user);
        return res.status(401).json({ error: 'Organization ID not found in token' });
      }

      const program = await loyaltyProgramService.createFullProgram(
        req.user.org_id,
        String(req.user.id),
        body
      );

      logger.info(`Program created: ${program.program_id}`);
      res.send(successResponse({ program }));
    } catch (e) {
      next(e);
    }
  }
);

/** GET /api/loyalty/programs/all
 * Get all loyalty programs for the organization with pagination
 */


router.get(
  '/all/:org_id',
  validateRequest({
    query: SCHEMA.PAGINATION
  }),
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Extract org_id from the authenticated user
      // Ensure your Request type definition includes the 'user' object
      if (!req.params.org_id) {
        return res.status(401).json({ error: 'Organization ID not found in token' });
      }

      const result = await loyaltyProgramService.getProgramsByOrgId(
        req.params.org_id as string,
        page,
        limit
      );
      
      res.send(successResponse(result));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get a specific Loyalty Program by ID
 * GET /loyalty-program/detail/:program_id
 */
router.get(
  '/detail/:program_id',
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const program = await loyaltyProgramService.getProgramById(
        req.params.program_id as string
      );
      res.send(successResponse({ program }));
    } catch (e) {
      next(e);
    }
  }
);




export default router;
