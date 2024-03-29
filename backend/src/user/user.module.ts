import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./user.model";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "../auth/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "../auth/jwt.strategy";
import { RefreshStrategy } from "../auth/refresh.strategy";
import { AuthService } from "src/auth/auth.service";
@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "1h",
      },
    }),
  ],
  exports: [SequelizeModule],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
  ],
  controllers: [UserController],
})
export class UserModule {}
