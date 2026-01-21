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
  Index,
  Unique
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Organization } from './organisation';

export interface CustomerAttributes {
  customer_id: string;
  org_id: string;
  name_en: string;
  name_ar: string;
  phone: string;
  email?: string;
  status: 'Active' | 'Inactive' | 'Deleted';
  qr_token: string;
  joined_at: Date;
  creation_datetime: Date;
}

@Table({
  tableName: 'org_customers',
  timestamps: false,
})
export class OrgCustomer extends Model<CustomerAttributes> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  customer_id!: string;

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  org_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name_en!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name_ar!: string;

  // Unique Constraint: (org_id, phone)
  @Index({
    name: 'unique_org_customer_phone',
    unique: true,
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email?: string;

  @Default('Active')
  @Column({
    type: DataType.ENUM('Active', 'Inactive', 'Deleted'),
    allowNull: false,
  })
  status!: 'Active' | 'Inactive' | 'Deleted';

  // Unique Constraint: qr_token
  @Unique
  @Default(() => uuidv4()) // Auto-generate if not provided
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  qr_token!: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  joined_at!: Date;

  @Default(DataType.NOW)
  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  creation_datetime!: Date;

  @BelongsTo(() => Organization)
  organization!: Organization;
}

export default OrgCustomer;