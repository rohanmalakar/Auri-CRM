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
  Unique,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Organization } from '../organisation';
import { LoyaltyReward } from './loyaltyReward';

export interface RewardDiscountRuleAttributes {
  id: string;
  org_id: string;
  reward_id: string;
  discount_percentage: number;
  max_discount_amount?: number;
  currency_code: string;
  created_at: Date;
  updated_at: Date;
}

@Table({
  tableName: 'reward_discount_rules',
  timestamps: true,
  underscored: true,
})
export class RewardDiscountRule extends Model<RewardDiscountRuleAttributes> {
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

  @ForeignKey(() => LoyaltyReward)
  @Unique // One discount rule set per reward
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reward_id!: string;

  // Discount Percentage (e.g., 20.00 for 20%)
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  discount_percentage!: number;

  // Maximum Discount Amount (e.g., max 50 SAR off)
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  max_discount_amount?: number;

  @Default('SAR')
  @Column({
    type: DataType.CHAR(3),
    allowNull: false,
  })
  currency_code!: string;

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

  @BelongsTo(() => LoyaltyReward)
  reward!: LoyaltyReward;
}

export default RewardDiscountRule;