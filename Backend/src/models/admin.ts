import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Unique,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';



export interface AdminAttributes {
  super_u_id: string;
  email: string;
  password: string;
  type: string;
  adminToken: string;
  name: string;
  status: 'active' | 'inactive' | 'deleted';
}

@Table({
  tableName: 'admin',
  timestamps: false,
})
export class Admin extends Model<AdminAttributes> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  super_u_id!: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Unique
  @Default(() => uuidv4())
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  adminToken!: string;


  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'admin',
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Default('admin')
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: string;

  @Default('active')
  @Column({
    type: DataType.ENUM('active', 'inactive', 'deleted'),
    allowNull: false,
  })
  status!: 'active' | 'inactive' | 'deleted';

  // Hooks for password hashing
  @BeforeCreate
  static async hashPasswordBeforeCreate(instance: Admin) {
    if (instance.password) {
      console.log('🔐 beforeCreate hook - Hashing password');
      instance.password = await bcrypt.hash(instance.password, 10);
      console.log('✅ Password hashed successfully');
    }
  }

  @BeforeUpdate
  static async hashPasswordBeforeUpdate(instance: Admin) {
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

  // Return admin without password
  toSafeObject() {
    const { password, ...safeAdmin } = this.get({ plain: true });
    return safeAdmin;
  }
}

export default Admin;
