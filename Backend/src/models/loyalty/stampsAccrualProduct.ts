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
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Organization } from '../organisation';
import { LoyaltyProgram } from './loyaltyProgram';

export interface StampsAccrualProductAttributes {
  id: string;
  org_id: string;
  program_id: string;
  product_source: 'INTERNAL' | 'FOODICS';
  internal_product_id?: number; // BIGINT
  external_product_id?: string;
  stamps_per_item: number;
  created_at: Date;
  updated_at: Date;
}

@Table({
  tableName: 'stamps_accrual_products',
  timestamps: true,
  underscored: true,
})
export class StampsAccrualProduct extends Model<StampsAccrualProductAttributes> {
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
    type: DataType.ENUM('INTERNAL', 'FOODICS'),
    allowNull: false,
  })
  product_source!: 'INTERNAL' | 'FOODICS';

  // ID for products managed internally
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  internal_product_id?: number;

  // ID for products managed by external system (e.g., Foodics)
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  external_product_id?: string;

  // How many stamps this specific item grants (Default 1)
  @Default(1)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  stamps_per_item!: number;

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

export default StampsAccrualProduct;