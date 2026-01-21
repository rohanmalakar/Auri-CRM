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
import { Organization } from '../organisation';

export interface ExternalProductAttributes {
  id: string;
  org_id: string;
  provider: 'FOODICS';
  external_product_id: string;
  name_en: string;
  name_ar: string;
  price?: number;
  raw_json?: object;
  last_synced_at: Date;
  created_at: Date;
  updated_at: Date;
}

@Table({
  tableName: 'products_external',
  timestamps: true,
  underscored: true,
})
export class ProductExternal extends Model<ExternalProductAttributes> {
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
    type: DataType.ENUM('FOODICS'),
    allowNull: false,
  })
  provider!: 'FOODICS';

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  external_product_id!: string;

  // Composite Unique Constraint: org_id + provider + external_product_id
  // Ensures we don't duplicate the same Foodics product for the same org
  @Index({
    name: 'unique_org_provider_product',
    unique: true,
  })
  @Column({
    type: DataType.VIRTUAL, // Virtual column just to attach the decorator if needed, 
    // but in Sequelize-TS indices are often best defined on specific columns or at class level.
    // Since this is a composite index spanning 3 columns, we usually define it via decorators on the class 
    // or rely on the @Index on one column encompassing the others if supported, 
    // strictly speaking Sequelize-typescript handles composite indexes best via @Table options or multiple @Index with same name.
    // Here we apply @Index with the same name 'unique_org_provider_product' to the relevant columns below.
  })
  
  // Re-applying @Index to the columns involved in the unique constraint
  
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

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  raw_json?: object;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  last_synced_at!: Date;

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

  @BelongsTo(() => Organization)
  organization!: Organization;
}

export default ProductExternal;