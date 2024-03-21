import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { Asset } from "./asset.model";
import { CreateAssetDTO } from "./dto/create-asset.dto";
import { User } from "src/user/user.model";
import { validate } from "class-validator";
import { AssetCategory } from "./asset-category.model";
import { Pagination } from "src/utils/pagination-params.decorator";
import { FindOptions, Op } from "sequelize";

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(Asset)
    private assetModel: typeof Asset,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(AssetCategory)
    private assetCategoryModel: typeof AssetCategory,
  ) {}

  async getUserAssetList(
    paginationParams: Pagination,
    userId: number,
  ): Promise<Asset[]> {
    return this.assetModel.findAll(getQueryOptions(paginationParams, userId));
  }

  async getAssetList(paginationParams: Pagination): Promise<Asset[]> {
    return this.assetModel.findAll(getQueryOptions(paginationParams));
  }

  async getCategoryList(): Promise<AssetCategory[]> {
    return this.assetCategoryModel.findAll();
  }

  async createAsset(
    userId: number,
    categoryId: number,
    dto: CreateAssetDTO,
  ): Promise<Asset> {
    const user = await this.userModel.findOne({
      where: {
        id: userId,
        isActive: true,
      },
    });

    if (user) {
      const asset = new Asset();
      asset.name = dto.name;
      asset.description = dto.description;
      asset.uploadLink = dto.uploadLink;
      asset.userId = userId;
      asset.assetCategoryId = categoryId;

      const errors = await validate(asset);

      if (errors.length > 0) {
        const _errors = { asset: "AssetInput is invalid" };
        throw new HttpException(
          { message: "Input data validation failed", _errors },
          HttpStatus.BAD_REQUEST,
        );
      } else return await asset.save();
    }
    throw new HttpException(
      { message: "User not found: ", userId },
      HttpStatus.BAD_REQUEST,
    );
  }

  async update(
    userId: number,
    categoryId: number,
    assetData: Asset,
  ): Promise<Asset> {
    const asset = await this.assetModel.findByPk(assetData.id);

    asset.name = assetData.name;
    asset.description = assetData.description;
    asset.uploadLink = assetData.uploadLink;
    asset.userId = userId;
    if (categoryId) asset.assetCategoryId = categoryId;

    return await asset.save();
  }

  async transferAsset(userId: number, assetId: number): Promise<Asset> {
    const asset = await this.assetModel.findByPk(assetId);

    asset.userId = userId;

    return await asset.save();
  }
}

function getQueryOptions(
  paginationParams: Pagination,
  userId?: number,
): FindOptions {
  return {
    where: {
      ...(userId ? { userId } : {}),
      ...(paginationParams.filter
        ? { name: { [Op.iLike]: `%${paginationParams.filter}%` } }
        : {}),
    },
    order: [["name", paginationParams.order]],
    limit: paginationParams.limit,
    offset: paginationParams.offset,
  };
}
