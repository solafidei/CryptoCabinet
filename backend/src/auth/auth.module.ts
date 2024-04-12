import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "../auth/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "../auth/jwt.strategy";
import { RefreshStrategy } from "../auth/refresh.strategy";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { AuthController } from "./auth.controller";
import { User } from "src/user/user.model";
@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forFeature([User]),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "10s",
      },
    }),
  ],
  exports: [SequelizeModule],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
