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
import { AuthGuard } from "@nestjs/passport";
import { Asset } from "./asset.model";
import { CurrentUser } from "src/user/types/current-user.type";
import { AssetCategory } from "./asset-category.model";

@Controller()
export class AssetController {
  constructor(private readonly assetService: AssetService) {}
  @Get("user-assets")
  @UseGuards(AuthGuard("jwt"))
  async getUserAssetList(@Req() req): Promise<Asset[]> {
    return this.assetService.getUserAssetList((req.user as CurrentUser).userId);
  }

  @Get("assets")
  async getAssetList(): Promise<Asset[]> {
    return this.assetService.getAssetList();
  }

  @Get("asset-categories")
  async getAssetCategories(): Promise<AssetCategory[]> {
    return this.assetService.getCategoryList();
  }

  @Post("asset")
  @UseGuards(AuthGuard("jwt"))
  async createAsset(
    @Req() req,
    @Body("categoryId") categoryId: number,
    @Body("asset") asset: Asset,
  ): Promise<Asset> {
    const userId = (req.user as CurrentUser).userId;
    return this.assetService.createAsset(userId, categoryId, asset);
  }

  @Put("asset")
  @UseGuards(AuthGuard("jwt"))
  async update(
    @Req() req,
    @Body("categoryID") categoryId: number,
    @Body("asset") asset: Asset,
  ): Promise<Asset> {
    const userId = (req.user as CurrentUser).userId;
    return this.assetService.update(userId, categoryId, asset);
  }
}
