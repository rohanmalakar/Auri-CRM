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

export interface LoyaltyProgramAttributes {
  program_id: string;
  org_id: string;
  program_type: 'POINTS' | 'STAMPS';
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  status: 'ACTIVE' | 'INACTIVE';
  terms_en?: string;
  terms_ar?: string;
  how_to_use_en?: string;
  how_to_use_ar?: string;
  created_at: Date;
  updated_at: Date;
}

@Table({
  tableName: 'loyalty_programs',
  timestamps: true, // Uses created_at and updated_at
  underscored: true,
})
export class LoyaltyProgram extends Model<LoyaltyProgramAttributes> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  program_id!: string;

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  org_id!: string;

  @Column({
    type: DataType.ENUM('POINTS', 'STAMPS'),
    allowNull: false,
  })
  program_type!: 'POINTS' | 'STAMPS';

  @Column({
    type: DataType.STRING(120),
    allowNull: false,
  })
  name_en!: string;

  @Column({
    type: DataType.STRING(120),
    allowNull: false,
  })
  name_ar!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description_en?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description_ar?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  terms_en?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  terms_ar?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  how_to_use_en?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  how_to_use_ar?: string;

  @Default('ACTIVE')
  @Column({
    type: DataType.ENUM('ACTIVE', 'INACTIVE'),
    allowNull: false,
  })
  status!: 'ACTIVE' | 'INACTIVE';

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

  @HasOne(() => require('./pointsProgramRule').PointsProgramRule)
  pointsRules?: any;

  @HasOne(() => require('./stampsProgramRule').StampsProgramRule)
  stampsRules?: any;

  @HasOne(() => require('./pointsWalletDesign').PointsWalletDesign)
  pointsWallet?: any;

  @HasOne(() => require('./stampsWalletDesign').StampsWalletDesign)
  stampsWallet?: any;

  @HasMany(() => require('./stampsAccrualProduct').StampsAccrualProduct)
  stampsAccrualProducts?: any[];

  @HasMany(() => require('./loyaltyReward').LoyaltyReward)
  rewards?: any[];
}

export default LoyaltyProgram;