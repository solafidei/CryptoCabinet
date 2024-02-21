import { Optional } from "sequelize";
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { AssetCategory } from "./asset-category.model";
import { User } from "src/user/user.model";

interface AssetAttributes {
  id: number;
  name: string;
  description: string;
  assetCategoryId: number;
  userId: number;
  uploadLink: string;
}

export interface AssetInput extends Optional<AssetAttributes, "id"> {}

@Table
export class Asset extends Model<AssetAttributes, AssetInput> {
  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  description: string;

  @Column(DataType.STRING)
  uploadLink: string;

  @ForeignKey(() => AssetCategory)
  assetCategoryId: number;

  @ForeignKey(() => User)
  userId: number;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  @BelongsTo(() => AssetCategory)
  category: AssetCategory;

  @BelongsTo(() => User)
  user: User;
}
