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

export interface StampsWalletDesignAttributes {
  id: string;
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
  created_at: Date;
  updated_at: Date;
}

@Table({
  tableName: 'stamps_wallet_designs',
  timestamps: true,
  underscored: true,
})
export class StampsWalletDesign extends Model<StampsWalletDesignAttributes> {
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
  @Unique // Enforces one design per stamps program
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  program_id!: string;

  // Visual Design Fields
  @Column({
    type: DataType.CHAR(7),
    allowNull: true,
  })
  card_color?: string;

  @Column({
    type: DataType.CHAR(7),
    allowNull: true,
  })
  card_title_color?: string;

  @Column({
    type: DataType.CHAR(7),
    allowNull: true,
  })
  card_text_color?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  strip_image_url?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  logo_url?: string;

  // Stamp Specific Visuals
  @Column({
    type: DataType.STRING(50), // e.g., 'CHECK', 'STAR', 'CUSTOM_SVG'
    allowNull: true,
  })
  fulfilled_stamp_icon_key?: string;

  @Column({
    type: DataType.CHAR(7),
    allowNull: true,
  })
  fulfilled_stamp_color?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  unfulfilled_stamp_icon_key?: string;

  @Column({
    type: DataType.CHAR(7),
    allowNull: true,
  })
  unfulfilled_stamp_color?: string;

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

export default StampsWalletDesign;