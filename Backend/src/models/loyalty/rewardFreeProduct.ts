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
import { LoyaltyReward } from './loyaltyReward';

export interface RewardFreeProductAttributes {
  id: string;
  org_id: string;
  reward_id: string;
  product_source: 'INTERNAL' | 'FOODICS';
  internal_product_id?: number; // BIGINT
  external_product_id?: string; // VARCHAR
  qty_free: number;
  created_at: Date;
  updated_at: Date;
}

@Table({
  tableName: 'reward_free_products',
  timestamps: true,
  underscored: true,
})
export class RewardFreeProduct extends Model<RewardFreeProductAttributes> {
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
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reward_id!: string;

  @Column({
    type: DataType.ENUM('INTERNAL', 'FOODICS'),
    allowNull: false,
  })
  product_source!: 'INTERNAL' | 'FOODICS';

  // ID for products managed internally within this system
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

  @Default(1)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  qty_free!: number;

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

export default RewardFreeProduct;