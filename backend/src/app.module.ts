import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { TestModule } from "./test/test.module";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "",
      database: "decentralized-marketplace",
      autoLoadModels: true,
      synchronize: true,
    }),
    TestModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
