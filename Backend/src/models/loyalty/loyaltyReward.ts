import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Organization } from '../organisation';
import { LoyaltyProgram } from './loyaltyProgram';

export interface LoyaltyRewardAttributes {
  id: string;
  org_id: string;
  program_id: string;
  voucher_name_en: string;
  voucher_name_ar: string;
  voucher_description_en?: string;
  voucher_description_ar?: string;
  reward_type: 'DISCOUNT' | 'FREE_PRODUCT';
  status: 'Active' | 'Inactive';
  created_at: Date;
  updated_at: Date;
}

@Table({
  tableName: 'loyalty_rewards',
  timestamps: true,
  underscored: true,
})
export class LoyaltyReward extends Model<LoyaltyRewardAttributes> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  org_id!: string;

  @ForeignKey(() => LoyaltyProgram)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  program_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  voucher_name_en!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  voucher_name_ar!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  voucher_description_en?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  voucher_description_ar?: string;

  @Column({
    type: DataType.ENUM('DISCOUNT', 'FREE_PRODUCT'),
    allowNull: false,
  })
  reward_type!: 'DISCOUNT' | 'FREE_PRODUCT';

  @Default('Active')
  @Column({
    type: DataType.ENUM('Active', 'Inactive'),
    allowNull: false,
  })
  status!: 'Active' | 'Inactive';

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  created_at!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updated_at!: Date;

  // Associations
  @BelongsTo(() => Organization)
  organization!: Organization;

  @BelongsTo(() => LoyaltyProgram)
  program!: LoyaltyProgram;

  @HasOne(() => require('../rewardCost').RewardCost)
  cost?: any;

  @HasOne(() => require('../loyalty/rewardDiscountRule').RewardDiscountRule)
  discount?: any;

  @HasMany(() => require('../loyalty/rewardFreeProduct').RewardFreeProduct)
  freeProducts?: any[];
}

export default LoyaltyReward;