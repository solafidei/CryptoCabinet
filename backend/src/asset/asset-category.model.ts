import { Optional } from "sequelize";
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { Asset } from "./asset.model";

interface AssetCategoryAttributes {
  id: number;
  name: string;
}

export interface AssetCategoryInput
  extends Optional<AssetCategoryAttributes, "id"> {}

@Table
export class AssetCategory extends Model<
  AssetCategoryAttributes,
  AssetCategoryInput
> {
  @Column(DataType.STRING)
  name: string;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  @HasMany(() => Asset)
  asset: Asset[];
}
