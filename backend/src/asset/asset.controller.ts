import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AssetService } from "./asset.service";
import { Asset } from "./asset.model";
import { CurrentUser } from "src/user/types/current-user.type";
import { AssetCategory } from "./asset-category.model";
import {
  Pagination,
  PaginationParams,
} from "src/utils/pagination-params.decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "src/auth/role.enum";

@Controller()
export class AssetController {
  constructor(private readonly assetService: AssetService) {}
  @Get("user-assets")
  @UseGuards(JwtAuthGuard)
  async getUserAssetList(
    @PaginationParams() paginationParams: Pagination,
    @Req() req,
  ): Promise<Asset[]> {
    return this.assetService.getUserAssetList(
      paginationParams,
      (req.user as CurrentUser).userId,
    );
  }

  @Get("assets")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getAssetList(
    @PaginationParams() paginationParams: Pagination,
  ): Promise<Asset[]> {
    return this.assetService.getAssetList(paginationParams);
  }

  @Get("asset-categories")
  async getAssetCategories(): Promise<AssetCategory[]> {
    return this.assetService.getCategoryList();
  }

  @Post("asset")
  @UseGuards(JwtAuthGuard)
  async createAsset(
    @Req() req,
    @Body("categoryId") categoryId: number,
    @Body("asset") asset: Asset,
  ): Promise<Asset> {
    const userId = (req.user as CurrentUser).userId;
    return this.assetService.createAsset(userId, categoryId, asset);
  }

  @Put("asset")
  @UseGuards(JwtAuthGuard)
  async update(
    @Req() req,
    @Body("categoryID") categoryId: number,
    @Body("asset") asset: Asset,
  ): Promise<Asset> {
    const userId = (req.user as CurrentUser).userId;
    return this.assetService.update(userId, categoryId, asset);
  }

  @Put("asset/transfer")
  @UseGuards(JwtAuthGuard)
  async transfterAsset(
    @Body("userId") userId: number,
    @Body("assetId") assetId: number,
  ): Promise<Asset> {
    return this.assetService.transferAsset(userId, assetId);
  }
}
