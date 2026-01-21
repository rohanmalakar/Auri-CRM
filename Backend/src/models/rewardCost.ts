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
import { Organization } from './organisation';
import { LoyaltyReward } from './loyalty/loyaltyReward';

export interface RewardCostAttributes {
  id: string;
  org_id: string;
  reward_id: string;
  cost_points?: number;
  cost_stamps?: number;
  created_at: Date;
  updated_at: Date;
}

@Table({
  tableName: 'reward_costs',
  timestamps: true,
  underscored: true,
})
export class RewardCost extends Model<RewardCostAttributes> {
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
  @Unique // Enforces one cost configuration per reward
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reward_id!: string;

  // Cost in Points (for Points Program rewards)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  cost_points?: number;

  // Cost in Stamps (for Stamps Program rewards)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  cost_stamps?: number;

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

export default RewardCost;