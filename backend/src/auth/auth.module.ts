import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "../auth/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "../auth/jwt.strategy";
import { RefreshStrategy } from "../auth/refresh.strategy";
import { AuthService } from "./auth.service";
@Module({
  imports: [
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
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
  controllers: [],
})
export class AuthModule {}
