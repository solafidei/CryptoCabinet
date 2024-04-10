import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { AuthService } from "./auth.service";
import { FastifyRequest } from "fastify";
import { AuthPayLoad } from "src/types/auth-payload.types";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh") {
  constructor(private authService: AuthService) {
    super({
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyRequest) => {
          let data: AuthPayLoad = JSON.parse(
            request?.cookies["auth-cookie"] ?? null,
          );
          if (!data) {
            return null;
          }
          return data.token;
        },
      ]),
    });
  }

  async validate(req: FastifyRequest, payload: any) {
    if (!payload) throw new BadRequestException("Invalid JWT Token");

    const data: AuthPayLoad = JSON.parse(req?.cookies["auth-cookie"] ?? null);

    if (!data?.refreshToken)
      throw new BadRequestException("Invalid refresh token");

    const user = await this.authService.validRefreshToken(
      payload.email,
      data.refreshToken,
    );

    if (!user) throw new BadRequestException("Token Expired");

    return user;
  }
}
