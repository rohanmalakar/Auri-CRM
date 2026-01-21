import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Organization } from '../organisation';
import { OrgCustomer } from '../customer';
import { LoyaltyProgram } from './loyaltyProgram';
import { OrgBranch } from '../branch';
import { LoyaltyReward } from './loyaltyReward';

export interface LoyaltyLedgerAttributes {
  id: string;
  org_id: string;
  customer_id: string;
  program_id: string;
  branch_id?: string;
  cashier_user_id?: string;
  transaction_id?: string;
  entry_type: 'EARN' | 'REDEEM' | 'ADJUST';
  delta_points: number;
  delta_stamps: number;
  reward_id?: string;
  meta_json?: object;
  created_at: Date;
}

@Table({
  tableName: 'loyalty_ledger',
  timestamps: true,
  updatedAt: false, // Ledger is immutable history
  underscored: true,
})
export class LoyaltyLedger extends Model<LoyaltyLedgerAttributes> {
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

  @ForeignKey(() => OrgCustomer)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  customer_id!: string;

  @ForeignKey(() => LoyaltyProgram)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  program_id!: string;

  @ForeignKey(() => OrgBranch)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  branch_id?: string;

  // ID of the cashier/staff who performed the action
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cashier_user_id?: string;

  // Reference to external transaction ID (e.g., POS order ID)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  transaction_id?: string;

  @Column({
    type: DataType.ENUM('EARN', 'REDEEM', 'ADJUST'),
    allowNull: false,
  })
  entry_type!: 'EARN' | 'REDEEM' | 'ADJUST';

  // Positive for EARN/ADJUST, Negative for REDEEM/ADJUST
  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  delta_points!: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  delta_stamps!: number;

  // If this entry relates to a specific reward redemption
  @ForeignKey(() => LoyaltyReward)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  reward_id?: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  meta_json?: object;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  created_at!: Date;

  // Associations
  @BelongsTo(() => Organization)
  organization!: Organization;

  @BelongsTo(() => OrgCustomer)
  customer!: OrgCustomer;

  @BelongsTo(() => LoyaltyProgram)
  program!: LoyaltyProgram;

  @BelongsTo(() => OrgBranch)
  branch!: OrgBranch;

  @BelongsTo(() => LoyaltyReward)
  reward!: LoyaltyReward;
}

export default LoyaltyLedger;