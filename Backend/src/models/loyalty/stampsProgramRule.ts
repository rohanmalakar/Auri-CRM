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
import { LoyaltyProgram } from './loyaltyProgram';

export interface StampsProgramRuleAttributes {
  id: string;
  org_id: string;
  program_id: string;
  stamps_target: number;
  accrual_rule: 'PER_VISIT' | 'PER_ITEM';
  time_restriction_unit: 'NONE' | 'DAY' | 'HOUR';
  time_restriction_value: number;
  visit_limit_mode: 'UNLIMITED' | 'ONCE_PER_WINDOW' | 'MAX_PER_WINDOW';
  max_per_window?: number;
  limit_scope: 'ORG' | 'BRANCH';
  created_at: Date;
  updated_at: Date;
}

@Table({
  tableName: 'stamps_program_rules',
  timestamps: true,
  underscored: true,
})
export class StampsProgramRule extends Model<StampsProgramRuleAttributes> {
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
  @Unique // One rule set per program
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  program_id!: string;

  // The number of stamps required to complete the card/cycle
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  stamps_target!: number;

  @Column({
    type: DataType.ENUM('PER_VISIT', 'PER_ITEM'),
    allowNull: false,
  })
  accrual_rule!: 'PER_VISIT' | 'PER_ITEM';

  // Time Restriction Configuration
  @Default('NONE')
  @Column({
    type: DataType.ENUM('NONE', 'DAY', 'HOUR'),
    allowNull: false,
  })
  time_restriction_unit!: 'NONE' | 'DAY' | 'HOUR';

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  time_restriction_value!: number;

  // Visit Limit logic
  @Default('UNLIMITED')
  @Column({
    type: DataType.ENUM('UNLIMITED', 'ONCE_PER_WINDOW', 'MAX_PER_WINDOW'),
    allowNull: false,
  })
  visit_limit_mode!: 'UNLIMITED' | 'ONCE_PER_WINDOW' | 'MAX_PER_WINDOW';

  // If MAX_PER_WINDOW, how many? (e.g., 2 stamps per day max)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  max_per_window?: number;

  // Does the limit apply per single branch or across the whole organization?
  @Default('BRANCH')
  @Column({
    type: DataType.ENUM('ORG', 'BRANCH'),
    allowNull: false,
  })
  limit_scope!: 'ORG' | 'BRANCH';

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
}

export default StampsProgramRule;