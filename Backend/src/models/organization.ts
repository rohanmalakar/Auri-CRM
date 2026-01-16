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
  name_en: string;
  name_ar: string;
  email: string;
  vat_no?: string;
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
  name_en!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name_ar!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [5, 30],
        msg: 'VAT number must be between 5 and 30 characters'
      },
      isValidVat(value: string) {
        if (value && value.length > 0 && (value.length < 5 || value.length > 30)) {
          throw new Error('VAT number must be between 5 and 30 characters');
        }
      }
    },
  })
  vat_no?: string;

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
