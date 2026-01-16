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
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';

export interface OrgUserAttributes {
  org_user_id: string;
  org_id: string;
  name: string;
  email: string;
  password: string;
  tel?: string;
  address?: string;
  picture?: string;
  status: 'Active' | 'Inactive';
  type: string;
  app_access?: string;
  designation?: number;
  station_id?: number;
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
    type: DataType.ENUM('Active', 'Inactive'),
    allowNull: false,
  })
  status!: 'Active' | 'Inactive';

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  app_access?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  designation?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  station_id?: number;

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
      console.log('🔐 beforeCreate hook - Hashing password');
      instance.password = await bcrypt.hash(instance.password, 10);
      console.log('✅ Password hashed successfully');
    }
  }

  @BeforeUpdate
  static async hashPasswordBeforeUpdate(instance: OrgUser) {
    if (instance.changed('password')) {
      console.log('🔐 beforeUpdate hook - Password changed, hashing new password');
      instance.password = await bcrypt.hash(instance.password, 10);
      console.log('✅ Password hashed successfully');
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
}

export default OrgUser;
