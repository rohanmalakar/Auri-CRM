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

export interface InternalProductAttributes {
  id: string;
  org_id: string;
  name_en: string;
  name_ar: string;
  price?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

@Table({
  tableName: 'products_internal',
  timestamps: true,
  underscored: true,
})
export class ProductInternal extends Model<InternalProductAttributes> {
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
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  price?: number;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_active!: boolean;

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
}

export default ProductInternal;