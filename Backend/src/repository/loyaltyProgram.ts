import { Op, Transaction } from 'sequelize';
import { LoyaltyProgram } from '@models/loyalty/loyaltyProgram';
import { PointsProgramRule } from '@models/loyalty/pointsProgramRule';
import { StampsProgramRule } from '@models/loyalty/stampsProgramRule';
import { PointsWalletDesign } from '@models/loyalty/pointsWalletDesign';
import { StampsWalletDesign } from '@models/loyalty/stampsWalletDesign';
import { StampsAccrualProduct } from '@models/loyalty/stampsAccrualProduct';
import { LoyaltyReward } from '@models/loyalty/loyaltyReward';
import { RewardCost } from '@models/rewardCost';
import { RewardDiscountRule } from '@models/loyalty/rewardDiscountRule';
import { RewardFreeProduct } from '@models/loyalty/rewardFreeProduct';
import { ERRORS } from '@utils/error';
import createLogger from '@utils/logger';
import OrganizationRepository from '@repository/organization';

export interface PaginationOptions {
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  rows: T[];
  count: number;
}

const logger = createLogger('@loyaltyProgramRepository');

export default class LoyaltyProgramRepository {
  /**
   * Create loyalty program
   */
  async createProgram(
    data: {
      org_id: string;
      program_type: 'POINTS' | 'STAMPS';
      name_en: string;
      name_ar: string;
      description_en?: string;
      description_ar?: string;
      terms_en?: string;
      terms_ar?: string;
      how_to_use_en?: string;
      how_to_use_ar?: string;
      status?: 'ACTIVE' | 'INACTIVE';
    },
    transaction: Transaction
  ): Promise<LoyaltyProgram> {
    try {
      return await LoyaltyProgram.create(data as any, { transaction });
    } catch (e) {
      logger.error('Error creating loyalty program:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Create points program rules
   */
  async createPointsRules(
    data: {
      org_id: string;
      program_id: string;
      earn_points_per_currency: number;
      currency_code: string;
      min_spend_to_earn?: number;
      rounding_mode?: 'FLOOR' | 'ROUND' | 'CEIL';
      point_value_currency: number;
      point_tax_percent?: number;
      expiry_duration_value?: number;
      expiry_duration_unit?: 'MONTH' | 'YEAR';
    },
    transaction: Transaction
  ): Promise<PointsProgramRule> {
    try {
      return await PointsProgramRule.create(data as any, { transaction });
    } catch (e) {
      logger.error('Error creating points rules:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Create stamps program rules
   */
  async createStampsRules(
    data: {
      org_id: string;
      program_id: string;
      stamps_target: number;
      accrual_rule: 'PER_VISIT' | 'PER_ITEM';
      time_restriction_unit?: 'NONE' | 'DAY' | 'HOUR';
      time_restriction_value?: number;
      visit_limit_mode?: 'UNLIMITED' | 'ONCE_PER_WINDOW' | 'MAX_PER_WINDOW';
      max_per_window?: number;
      limit_scope?: 'ORG' | 'BRANCH';
    },
    transaction: Transaction
  ): Promise<StampsProgramRule> {
    try {
      return await StampsProgramRule.create(data as any, { transaction });
    } catch (e) {
      logger.error('Error creating stamps rules:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Create points wallet design
   */
  async createPointsWalletDesign(
    data: {
      org_id: string;
      program_id: string;
      card_color?: string;
      card_title_color?: string;
      card_text_color?: string;
      strip_image_url?: string;
      logo_url?: string;
    },
    transaction: Transaction
  ): Promise<PointsWalletDesign> {
    try {
      return await PointsWalletDesign.create(data as any, { transaction });
    } catch (e) {
      logger.error('Error creating points wallet design:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Create stamps wallet design
   */
  async createStampsWalletDesign(
    data: {
      org_id: string;
      program_id: string;
      card_color?: string;
      card_title_color?: string;
      card_text_color?: string;
      strip_image_url?: string;
      logo_url?: string;
      fulfilled_stamp_icon_key?: string;
      fulfilled_stamp_color?: string;
      unfulfilled_stamp_icon_key?: string;
      unfulfilled_stamp_color?: string;
    },
    transaction: Transaction
  ): Promise<StampsWalletDesign> {
    try {
      return await StampsWalletDesign.create(data as any, { transaction });
    } catch (e) {
      logger.error('Error creating stamps wallet design:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Bulk create stamps accrual products
   */
  async bulkCreateStampsAccrualProducts(
    products: Array<{
      org_id: string;
      program_id: string;
      product_source: 'INTERNAL' | 'FOODICS';
      internal_product_id?: number;
      external_product_id?: string;
      stamps_per_item?: number;
    }>,
    transaction: Transaction
  ): Promise<StampsAccrualProduct[]> {
    try {
      return await StampsAccrualProduct.bulkCreate(products as any, { transaction });
    } catch (e) {
      logger.error('Error creating stamps accrual products:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Create reward
   */
  async createReward(
    data: {
      org_id: string;
      program_id: string;
      voucher_name_en: string;
      voucher_name_ar: string;
      voucher_description_en?: string;
      voucher_description_ar?: string;
      reward_type: 'DISCOUNT' | 'FREE_PRODUCT';
      status?: 'Active' | 'Inactive';
    },
    transaction: Transaction
  ): Promise<LoyaltyReward> {
    try {
      return await LoyaltyReward.create(data as any, { transaction });
    } catch (e) {
      logger.error('Error creating reward:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Create reward cost
   */
  async createRewardCost(
    data: {
      org_id: string;
      reward_id: string;
      cost_points?: number;
      cost_stamps?: number;
    },
    transaction: Transaction
  ): Promise<RewardCost> {
    try {
      return await RewardCost.create(data as any, { transaction });
    } catch (e) {
      logger.error('Error creating reward cost:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Create reward discount rule
   */
  async createRewardDiscountRule(
    data: {
      org_id: string;
      reward_id: string;
      discount_percentage: number;
      max_discount_amount?: number;
      currency_code?: string;
    },
    transaction: Transaction
  ): Promise<RewardDiscountRule> {
    try {
      return await RewardDiscountRule.create(data as any, { transaction });
    } catch (e) {
      logger.error('Error creating reward discount rule:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Bulk create reward free products
   */
  async bulkCreateRewardFreeProducts(
    products: Array<{
      org_id: string;
      reward_id: string;
      product_source: 'INTERNAL' | 'FOODICS';
      internal_product_id?: number;
      external_product_id?: string;
      qty_free?: number;
    }>,
    transaction: Transaction
  ): Promise<RewardFreeProduct[]> {
    try {
      return await RewardFreeProduct.bulkCreate(products as any, { transaction });
    } catch (e) {
      logger.error('Error creating reward free products:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  /**
   * Find program by ID with all includes
   */
  async findByIdWithIncludes(
    programId: string,
  ): Promise<LoyaltyProgram | null> {
    try {
      const program = await LoyaltyProgram.findOne({
        where: {
          program_id: programId
        },
        include: [
          {
            model: PointsProgramRule,
            required: false,
          },
          {
            model: StampsProgramRule,
            required: false,
          },
          {
            model: PointsWalletDesign,
            required: false,
          },
          {
            model: StampsWalletDesign,
            required: false,
          },
          {
            model: StampsAccrualProduct,
            required: false,
          },
          {
            model: LoyaltyReward,
            required: false,
            include: [
              {
                model: RewardCost,
                required: false,
              },
              {
                model: RewardDiscountRule,
                required: false,
              },
              {
                model: RewardFreeProduct,
                required: false,
              },
            ],
          },
        ],
      });
      return program;
    } catch (e) {
      logger.error('Error finding program with includes:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  // find all the programs for an organization with pagination
  async getProgramsByOrgId(
    org_id: string,
    pagination: PaginationOptions,
    transaction?: Transaction
  ): Promise<PaginatedResult<LoyaltyProgram>> {
    try {
      const { limit, offset } = pagination;
      
      return await LoyaltyProgram.findAndCountAll({
        where: {
          org_id,
          status: { [Op.ne]: 'INACTIVE' },
        },
        limit,
        offset,
        order: [['created_at', 'DESC']],
        transaction,
      });
    } catch (e) {
      logger.error('Error getting loyalty programs:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  }

  // check if program exists by id
  async getProgramById(
    program_id: string,
    transaction?: Transaction
  ): Promise<LoyaltyProgram> {
    try {
      const program = await LoyaltyProgram.findByPk(program_id, { transaction }); 
      if (!program) {
        throw ERRORS.LOYAALTY_PROGRAM_NOT_FOUND;
      }
      return program;
    } catch (e) {
      logger.error('Error getting program by ID:', e);
      throw ERRORS.DATABASE_ERROR;
    }
  } 
}      
     