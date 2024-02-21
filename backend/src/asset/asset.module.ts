import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AssetCategory } from "./asset-category.model";
import { Asset } from "./asset.model";
import { AssetController } from "./asset.controller";
import { AssetService } from "./asset.service";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [SequelizeModule.forFeature([Asset, AssetCategory]), UserModule],
  exports: [SequelizeModule],
  providers: [AssetService],
  controllers: [AssetController],
})
export class AssetModule {}
