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
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Organization } from './organisation';


export interface BranchAttributes {
  branch_id: string;
  org_id: string;
  name_en: string;
  name_ar: string;
  branch_phone_number: string;
  city: string;
  address: string;
  location_link?: string;
  status: 'Active' | 'Inactive' | 'Deleted';
  creation_datetime: Date;
}

@Table({
  tableName: 'org_branches',
  timestamps: false,
})
export class OrgBranch extends Model<BranchAttributes> {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  branch_id!: string;

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
    type: DataType.STRING,
    allowNull: false,
  })
  branch_phone_number!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  address!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location_link?: string;

  @Default('Active')
  @Column({
    type: DataType.ENUM('Active', 'Inactive', 'Deleted'),
    allowNull: false,
  })
  status!: 'Active' | 'Inactive' | 'Deleted';

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

export default OrgBranch;
