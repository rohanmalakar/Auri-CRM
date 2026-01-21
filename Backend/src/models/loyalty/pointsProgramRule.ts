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

export interface PointsProgramRuleAttributes {
  id: string;
  org_id: string;
  program_id: string;
  earn_points_per_currency: number;
  currency_code: string;
  min_spend_to_earn?: number;
  rounding_mode: 'FLOOR' | 'ROUND' | 'CEIL';
  point_value_currency: number;
  point_tax_percent: number;
  expiry_duration_value: number;
  expiry_duration_unit: 'MONTH' | 'YEAR';
  created_at: Date;
  updated_at: Date;
}

@Table({
  tableName: 'points_program_rules',
  timestamps: true,
  underscored: true,
})
export class PointsProgramRule extends Model<PointsProgramRuleAttributes> {
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

  // Earning Rules
  // Example: 1.0 means for every 1 unit of currency, earn 1 point
  @Column({
    type: DataType.DECIMAL(10, 4),
    allowNull: false,
  })
  earn_points_per_currency!: number;

  @Column({
    type: DataType.CHAR(3),
    allowNull: false,
    defaultValue: 'SAR',
  })
  currency_code!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  min_spend_to_earn?: number;

  @Default('FLOOR')
  @Column({
    type: DataType.ENUM('FLOOR', 'ROUND', 'CEIL'),
    allowNull: false,
  })
  rounding_mode!: 'FLOOR' | 'ROUND' | 'CEIL';

  // Redemption Valuation
  // Example: 0.1 means 1 point = 0.10 SAR (or 10 points = 1 SAR)
  @Column({
    type: DataType.DECIMAL(10, 4),
    allowNull: false,
  })
  point_value_currency!: number;

  // Tax & Expiry
  @Default(0)
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  point_tax_percent!: number;

  @Default(1)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  expiry_duration_value!: number;

  @Default('YEAR')
  @Column({
    type: DataType.ENUM('MONTH', 'YEAR'),
    allowNull: false,
  })
  expiry_duration_unit!: 'MONTH' | 'YEAR';

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

export default PointsProgramRule;