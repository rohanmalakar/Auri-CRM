import LoyaltyProgramRepository from '@repository/loyaltyProgram';
import { LoyaltyProgram } from '@models/loyalty/loyaltyProgram';
import { ERRORS, RequestError } from '@utils/error';
import createLogger from '@utils/logger';
import sequelize from '@utils/sequelize';

const logger = createLogger('@loyaltyProgramService');

export type ProductSource = 'INTERNAL' | 'FOODICS';

export type RewardDiscount = {
  discountPercentage: number;
  maxDiscountAmount?: number;
  currencyCode?: string;
};

export type RewardFreeProductItem = {
  productSource: ProductSource;
  internalProductId?: number;
  externalProductId?: string;
  qtyFree?: number;
};

export type RewardInput = {
  voucherNameEn: string;
  voucherNameAr?: string;
  voucherDescriptionEn?: string;
  voucherDescriptionAr?: string;
  rewardType: 'DISCOUNT' | 'FREE_PRODUCT';
  costPoints?: number;
  costStamps?: number;
  discount?: RewardDiscount;
  freeProducts?: RewardFreeProductItem[];
};

export type StampsAccrualProductInput = {
  productSource: ProductSource;
  internalProductId?: number;
  externalProductId?: string;
  stampsPerItem?: number;
};

export type PointsRulesInput = {
  currencyCode: string;
  earnPointsPerCurrency: number;
  minSpendToEarn?: number;
  roundingMode?: 'FLOOR' | 'ROUND' | 'CEIL';
  pointValueCurrency: number;
  pointTaxPercent?: number;
  expiryDurationValue?: number;
  expiryDurationUnit?: 'MONTH' | 'YEAR';
};

export type StampsRulesInput = {
  stampsTarget: number;
  accrualRule: 'PER_VISIT' | 'PER_ITEM';
  timeRestrictionUnit?: 'NONE' | 'DAY' | 'HOUR';
  timeRestrictionValue?: number;
  visitLimitMode?: 'UNLIMITED' | 'ONCE_PER_WINDOW' | 'MAX_PER_WINDOW';
  maxPerWindow?: number;
  limitScope?: 'ORG' | 'BRANCH';
};

export type PointsWalletDesignInput = {
  cardColor?: string;
  cardTitleColor?: string;
  cardTextColor?: string;
  stripImageUrl?: string;
  logoUrl?: string;
};

export type StampsWalletDesignInput = {
  cardColor?: string;
  cardTitleColor?: string;
  cardTextColor?: string;
  stripImageUrl?: string;
  logoUrl?: string;
  fulfilledStampIconKey?: string;
  fulfilledStampColor?: string;
  unfulfilledStampIconKey?: string;
  unfulfilledStampColor?: string;
};

export type CreateFullProgramRequest = {
  programType: 'POINTS' | 'STAMPS';
  nameEn: string;
  nameAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  termsEn?: string;
  termsAr?: string;
  howToUseEn?: string;
  howToUseAr?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  pointsRules?: PointsRulesInput;
  stampsRules?: StampsRulesInput;
  pointsWalletDesign?: PointsWalletDesignInput;
  stampsWalletDesign?: StampsWalletDesignInput;
  stampsAccrualProducts?: StampsAccrualProductInput[];
  rewards: RewardInput[];
};

export class LoyaltyProgramService {
  repository: LoyaltyProgramRepository;

  constructor() {
    this.repository = new LoyaltyProgramRepository();
  }

  /**
   * Create full loyalty program in one transaction
   */
  async createFullProgram(
    orgId: string,
    userId: string,
    dto: CreateFullProgramRequest
  ): Promise<LoyaltyProgram> {
    // Business validation
    this.validateCreateRequest(dto);

    const transaction = await sequelize.transaction();
    try {
      // Step 1: Create program
      const program = await this.repository.createProgram(
        {
          org_id: orgId,
          program_type: dto.programType,
          name_en: dto.nameEn,
          name_ar: dto.nameAr || dto.nameEn,
          description_en: dto.descriptionEn,
          description_ar: dto.descriptionAr,
          terms_en: dto.termsEn,
          terms_ar: dto.termsAr,
          how_to_use_en: dto.howToUseEn,
          how_to_use_ar: dto.howToUseAr,
          status: dto.status || 'ACTIVE',
        },
        transaction
      );

      // Step 2: Create subtype rules
      if (dto.programType === 'POINTS' && dto.pointsRules) {
        await this.repository.createPointsRules(
          {
            org_id: orgId,
            program_id: program.program_id,
            earn_points_per_currency: dto.pointsRules.earnPointsPerCurrency,
            currency_code: dto.pointsRules.currencyCode,
            min_spend_to_earn: dto.pointsRules.minSpendToEarn,
            rounding_mode: dto.pointsRules.roundingMode || 'FLOOR',
            point_value_currency: dto.pointsRules.pointValueCurrency,
            point_tax_percent: dto.pointsRules.pointTaxPercent || 0,
            expiry_duration_value: dto.pointsRules.expiryDurationValue,
            expiry_duration_unit: dto.pointsRules.expiryDurationUnit,
          },
          transaction
        );
      } else if (dto.programType === 'STAMPS' && dto.stampsRules) {
        await this.repository.createStampsRules(
          {
            org_id: orgId,
            program_id: program.program_id,
            stamps_target: dto.stampsRules.stampsTarget,
            accrual_rule: dto.stampsRules.accrualRule,
            time_restriction_unit: dto.stampsRules.timeRestrictionUnit || 'NONE',
            time_restriction_value: dto.stampsRules.timeRestrictionValue || 0,
            visit_limit_mode: dto.stampsRules.visitLimitMode || 'UNLIMITED',
            max_per_window: dto.stampsRules.maxPerWindow,
            limit_scope: dto.stampsRules.limitScope || 'ORG',
          },
          transaction
        );
      }

      // Step 3: Create wallet design
      if (dto.programType === 'POINTS' && dto.pointsWalletDesign) {
        await this.repository.createPointsWalletDesign(
          {
            org_id: orgId,
            program_id: program.program_id,
            card_color: dto.pointsWalletDesign.cardColor,
            card_title_color: dto.pointsWalletDesign.cardTitleColor,
            card_text_color: dto.pointsWalletDesign.cardTextColor,
            strip_image_url: dto.pointsWalletDesign.stripImageUrl,
            logo_url: dto.pointsWalletDesign.logoUrl,
          },
          transaction
        );
      } else if (dto.programType === 'STAMPS' && dto.stampsWalletDesign) {
        await this.repository.createStampsWalletDesign(
          {
            org_id: orgId,
            program_id: program.program_id,
            card_color: dto.stampsWalletDesign.cardColor,
            card_title_color: dto.stampsWalletDesign.cardTitleColor,
            card_text_color: dto.stampsWalletDesign.cardTextColor,
            strip_image_url: dto.stampsWalletDesign.stripImageUrl,
            logo_url: dto.stampsWalletDesign.logoUrl,
            fulfilled_stamp_icon_key: dto.stampsWalletDesign.fulfilledStampIconKey,
            fulfilled_stamp_color: dto.stampsWalletDesign.fulfilledStampColor,
            unfulfilled_stamp_icon_key: dto.stampsWalletDesign.unfulfilledStampIconKey,
            unfulfilled_stamp_color: dto.stampsWalletDesign.unfulfilledStampColor,
          },
          transaction
        );
      }

      // Step 4: Create stamps accrual products if needed
      if (
        dto.programType === 'STAMPS' &&
        dto.stampsRules?.accrualRule === 'PER_ITEM' &&
        dto.stampsAccrualProducts &&
        dto.stampsAccrualProducts.length > 0
      ) {
        const productsData = dto.stampsAccrualProducts.map((p) => ({
          org_id: orgId,
          program_id: program.program_id,
          product_source: p.productSource,
          internal_product_id: p.internalProductId,
          external_product_id: p.externalProductId,
          stamps_per_item: p.stampsPerItem || 1,
        }));
        await this.repository.bulkCreateStampsAccrualProducts(productsData, transaction);
      }

      // Step 5: Create rewards
      for (const rewardDto of dto.rewards) {
        const reward = await this.repository.createReward(
          {
            org_id: orgId,
            program_id: program.program_id,
            voucher_name_en: rewardDto.voucherNameEn,
            voucher_name_ar: rewardDto.voucherNameAr || rewardDto.voucherNameEn,
            voucher_description_en: rewardDto.voucherDescriptionEn,
            voucher_description_ar: rewardDto.voucherDescriptionAr,
            reward_type: rewardDto.rewardType,
            status: 'Active',
          },
          transaction
        );

        // Create reward cost
        await this.repository.createRewardCost(
          {
            org_id: orgId,
            reward_id: reward.id,
            cost_points: rewardDto.costPoints,
            cost_stamps: rewardDto.costStamps,
          },
          transaction
        );

        // Create discount rule or free products
        if (rewardDto.rewardType === 'DISCOUNT' && rewardDto.discount) {
          await this.repository.createRewardDiscountRule(
            {
              org_id: orgId,
              reward_id: reward.id,
              discount_percentage: rewardDto.discount.discountPercentage,
              max_discount_amount: rewardDto.discount.maxDiscountAmount,
              currency_code: rewardDto.discount.currencyCode || 'SAR',
            },
            transaction
          );
        } else if (rewardDto.rewardType === 'FREE_PRODUCT' && rewardDto.freeProducts) {
          const freeProductsData = rewardDto.freeProducts.map((p) => ({
            org_id: orgId,
            reward_id: reward.id,
            product_source: p.productSource,
            internal_product_id: p.internalProductId,
            external_product_id: p.externalProductId,
            qty_free: p.qtyFree || 1,
          }));
          await this.repository.bulkCreateRewardFreeProducts(freeProductsData, transaction);
        }
      }

      await transaction.commit();

      // Step 6: Fetch and return full program with includes
      const createdProgram = await this.repository.findByIdWithIncludes(
        program.program_id,
        orgId
      );

      if (!createdProgram) {
        throw ERRORS.DATABASE_ERROR;
      }

      logger.info(`Created loyalty program ${program.program_id} for org ${orgId}`);
      return createdProgram;
    } catch (e) {
      await transaction.rollback();
      if (e instanceof RequestError) {
        throw e;
      }
      logger.error('Error creating full program:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Business validation
   */
  private validateCreateRequest(dto: CreateFullProgramRequest): void {
    // Validate rewards exist
    if (!dto.rewards || dto.rewards.length === 0) {
      throw new RequestError('At least one reward is required', 40001, 400);
    }

    // Program type validation
    if (dto.programType === 'POINTS') {
      if (!dto.pointsRules) {
        throw new RequestError('Points rules are required for POINTS program', 40002, 400);
      }
      if (!dto.pointsWalletDesign) {
        throw new RequestError('Points wallet design is required for POINTS program', 40003, 400);
      }

      // Validate points rules fields
      if (!dto.pointsRules.currencyCode) {
        throw new RequestError('Currency code is required', 40004, 400);
      }
      if (!dto.pointsRules.earnPointsPerCurrency || dto.pointsRules.earnPointsPerCurrency <= 0) {
        throw new RequestError('Earn points per currency must be greater than 0', 40005, 400);
      }
      if (!dto.pointsRules.pointValueCurrency || dto.pointsRules.pointValueCurrency <= 0) {
        throw new RequestError('Point value currency must be greater than 0', 40006, 400);
      }

      // Validate all rewards have costPoints
      for (const reward of dto.rewards) {
        if (!reward.costPoints || reward.costPoints <= 0) {
          throw new RequestError(
            `Reward "${reward.voucherNameEn}" must have costPoints for POINTS program`,
            40007,
            400
          );
        }
        if (reward.costStamps) {
          throw new RequestError(
            `Reward "${reward.voucherNameEn}" cannot have costStamps in POINTS program`,
            40008,
            400
          );
        }
      }
    } else if (dto.programType === 'STAMPS') {
      if (!dto.stampsRules) {
        throw new RequestError('Stamps rules are required for STAMPS program', 40009, 400);
      }
      if (!dto.stampsWalletDesign) {
        throw new RequestError('Stamps wallet design is required for STAMPS program', 40010, 400);
      }

      // Validate stamps rules fields
      if (!dto.stampsRules.stampsTarget || dto.stampsRules.stampsTarget <= 0) {
        throw new RequestError('Stamps target must be greater than 0', 40011, 400);
      }
      if (!dto.stampsRules.accrualRule) {
        throw new RequestError('Accrual rule is required', 40012, 400);
      }

      // If accrual rule is PER_ITEM, require accrual products
      if (dto.stampsRules.accrualRule === 'PER_ITEM') {
        if (!dto.stampsAccrualProducts || dto.stampsAccrualProducts.length === 0) {
          throw new RequestError(
            'Stamps accrual products are required when accrual rule is PER_ITEM',
            40013,
            400
          );
        }
        // Validate each product
        for (const product of dto.stampsAccrualProducts) {
          if (product.productSource === 'INTERNAL' && !product.internalProductId) {
            throw new RequestError(
              'Internal product ID is required for INTERNAL product source',
              40014,
              400
            );
          }
          if (product.productSource === 'FOODICS' && !product.externalProductId) {
            throw new RequestError(
              'External product ID is required for FOODICS product source',
              40015,
              400
            );
          }
        }
      }

      // Validate all rewards have costStamps
      for (const reward of dto.rewards) {
        if (!reward.costStamps || reward.costStamps <= 0) {
          throw new RequestError(
            `Reward "${reward.voucherNameEn}" must have costStamps for STAMPS program`,
            40016,
            400
          );
        }
        if (reward.costPoints) {
          throw new RequestError(
            `Reward "${reward.voucherNameEn}" cannot have costPoints in STAMPS program`,
            40017,
            400
          );
        }
      }
    }

    // Validate each reward
    for (const reward of dto.rewards) {
      if (reward.rewardType === 'DISCOUNT') {
        if (!reward.discount) {
          throw new RequestError(
            `Reward "${reward.voucherNameEn}" of type DISCOUNT must have discount configuration`,
            40018,
            400
          );
        }
        if (
          !reward.discount.discountPercentage ||
          reward.discount.discountPercentage <= 0 ||
          reward.discount.discountPercentage > 100
        ) {
          throw new RequestError(
            `Reward "${reward.voucherNameEn}" discount percentage must be between 0 and 100`,
            40019,
            400
          );
        }
        if (reward.freeProducts && reward.freeProducts.length > 0) {
          throw new RequestError(
            `Reward "${reward.voucherNameEn}" of type DISCOUNT cannot have free products`,
            40020,
            400
          );
        }
      } else if (reward.rewardType === 'FREE_PRODUCT') {
        if (!reward.freeProducts || reward.freeProducts.length === 0) {
          throw new RequestError(
            `Reward "${reward.voucherNameEn}" of type FREE_PRODUCT must have at least one free product`,
            40021,
            400
          );
        }
        if (reward.discount) {
          throw new RequestError(
            `Reward "${reward.voucherNameEn}" of type FREE_PRODUCT cannot have discount configuration`,
            40022,
            400
          );
        }
        // Validate each free product
        for (const product of reward.freeProducts) {
          if (product.productSource === 'INTERNAL' && !product.internalProductId) {
            throw new RequestError(
              `Free product in reward "${reward.voucherNameEn}" with INTERNAL source must have internal product ID`,
              40023,
              400
            );
          }
          if (product.productSource === 'FOODICS' && !product.externalProductId) {
            throw new RequestError(
              `Free product in reward "${reward.voucherNameEn}" with FOODICS source must have external product ID`,
              40024,
              400
            );
          }
        }
      }
    }
  }
}
