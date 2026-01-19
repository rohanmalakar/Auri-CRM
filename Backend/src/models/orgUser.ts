import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  BeforeCreate,
  BeforeUpdate,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import { OrgBranch } from './branch';

export interface OrgUserAttributes {
  org_user_id: string;
  org_id: string;
  branch_id?: string;
  name: string;
  email: string;
  password: string;
  tel?: string;
  address?: string;
  picture?: string;
  status: 'Active' | 'Inactive' | 'Deleted';
  designation?: 'Cashier' | 'Manager' | 'Admin' | 'Other';
  creation_datetime: Date;
}

@Table({
  tableName: 'org_users',
  timestamps: false,
})
export class OrgUser extends Model<OrgUserAttributes> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  org_user_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  org_id!: string;

  @ForeignKey(() => OrgBranch)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  branch_id?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  tel?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  picture?: string;

  @Default('Active')
  @Column({
    type: DataType.ENUM('Active', 'Inactive', 'Deleted'),
    allowNull: false,
  })
  status!: 'Active' | 'Inactive' | "Deleted";


  @Column({
    type: DataType.ENUM('Cashier', 'Manager', 'Admin','Other'),
    allowNull: true,
    defaultValue: 'Cashier'
  })
  designation?: 'Cashier' | 'Manager' | 'Admin' | "Other";

  @Default(DataType.NOW)
  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  creation_datetime!: Date;

  // Hooks for password hashing
  @BeforeCreate
  static async hashPasswordBeforeCreate(instance: OrgUser) {
    if (instance.password) {
      instance.password = await bcrypt.hash(instance.password, 10);
    }
  }

  @BeforeUpdate
  static async hashPasswordBeforeUpdate(instance: OrgUser) {
    if (instance.changed('password')) {
      instance.password = await bcrypt.hash(instance.password, 10);
    }
  }

  // Instance method to check password
  async checkPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  // Return user without password
  toSafeObject() {
    const { password, ...safeUser } = this.get({ plain: true });
    return safeUser;
  }

  @BelongsTo(() => OrgBranch)
  branch!: OrgBranch;
}

export default OrgUser;
