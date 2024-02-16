import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "./user.service";
import { Request } from "express";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh") {
  constructor(private userService: UserService) {
    super({
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let data = request?.cookies["auth-cookie"];
          if (!data) {
            return null;
          }
          return data.token;
        },
      ]),
    });
  }

  async validate(req: Request, payload: any) {
    if (!payload) throw new BadRequestException("Invalid JWT Token");

    const data = req?.cookies["auth-cookie"];

    if (!data?.refreshToken)
      throw new BadRequestException("Invalid refresh token");

    const user = await this.userService.validRefreshToken(
      payload.email,
      data.refreshToken,
    );

    if (!user) throw new BadRequestException("Token Expired");

    return user;
  }
}
