import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { Test } from "./test.model";
import { TestService } from "./test.service";
import { TestController } from "./test.controller";

@Module({
  imports: [SequelizeModule.forFeature([Test])],
  providers: [TestService],
  controllers: [TestController],
})
export class TestModule {}
