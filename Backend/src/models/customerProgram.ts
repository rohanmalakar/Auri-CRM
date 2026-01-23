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
  Index,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Organization } from './organisation';
import { OrgCustomer } from './customer';
import { LoyaltyProgram } from './loyalty/loyaltyProgram';

export interface CustomerProgramAttributes {
  customer: string;
  org_id: string;
  customer_id: string;
  program_id: string;
  status: 'ENROLLED' | 'OPTED_OUT' | 'SUSPENDED';
  enrolled_at: Date;
  created_at: Date;
  updated_at: Date;
  qr_code_url: string;
}

@Table({
  tableName: 'customer_programs',
  timestamps: true,
  underscored: true,
})
export class CustomerProgram extends Model<CustomerProgramAttributes> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => Organization)
  @Index({ name: 'unique_customer_program_enrollment', unique: true }) // Composite Unique Part 1
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  org_id!: string;

  @ForeignKey(() => OrgCustomer)
  @Index({ name: 'unique_customer_program_enrollment', unique: true }) // Composite Unique Part 2
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  customer_id!: string;

  @ForeignKey(() => LoyaltyProgram)
  @Index({ name: 'unique_customer_program_enrollment', unique: true }) // Composite Unique Part 3
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  program_id!: string;

  @Default('ENROLLED')
  @Column({
    type: DataType.ENUM('ENROLLED', 'OPTED_OUT', 'SUSPENDED'),
    allowNull: false,
  })
  status!: 'ENROLLED' | 'OPTED_OUT' | 'SUSPENDED';

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  enrolled_at!: Date;

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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  qr_code_url!: string;

  // Associations
  @BelongsTo(() => Organization)
  organization!: Organization;

  @BelongsTo(() => OrgCustomer)
  customer!: OrgCustomer;

  @BelongsTo(() => LoyaltyProgram)
  program!: LoyaltyProgram;
}

export default CustomerProgram;