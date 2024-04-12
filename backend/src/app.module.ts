import { ConfigModule } from "@nestjs/config";
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Req,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { TestModule } from "./test/test.module";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { AssetModule } from "./asset/asset.module";
import { Dialect } from "sequelize";
import { AuthModule } from "./auth/auth.module";
import { LoggerMiddleware } from "./middleware/logging.middleware";
import { AuthService } from "./auth/auth.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as Dialect,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      //synchronize: true,
    }),
    TestModule,
    UserModule,
    AssetModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    /*  consumer
      .apply(LoggerMiddleware)
      .exclude({ path: "/login", method: RequestMethod.POST })
      .forRoutes("*");*/
  }
}
