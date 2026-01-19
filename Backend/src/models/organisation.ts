import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  Unique,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';


export interface OrganizationAttributes {
  org_id: string;
  org_name_en: string;
  org_name_ar: string;
  email: string;
  vat_no?: number;
  tel?: string;
  country?: string;
  state?: string;
  city?: string;
  pin?: string;
  contact_person?: string;
  c_mobile?: string;
  c_email?: string;
  picture?: string;
  type?: string;
  currency: string;
  timezone: string;
  status: 'Active' | 'Inactive';
  creation_datetime: Date;
}

@Table({
  tableName: 'organizations',
  timestamps: false,
})
export class Organization extends Model<OrganizationAttributes> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  org_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  org_name_en!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  org_name_ar!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    defaultValue: 0,
  })
  vat_no?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  tel?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  country?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  state?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  city?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  pin?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  contact_person?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  c_mobile?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  c_email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  picture?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  type?: string;

  @Default('SAR')
  @Column({
    type: DataType.STRING(3),
    allowNull: false,
  })
  currency!: string;

  @Default('Asia/Riyadh')
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  timezone!: string;

  @Default('Active')
  @Column({
    type: DataType.ENUM('Active', 'Inactive'),
    allowNull: false,
  })
  status!: 'Active' | 'Inactive';

  @Default(DataType.NOW)
  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  creation_datetime!: Date;
}

export default Organization;
