import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { FastifyReply } from "fastify";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthPayLoad } from "src/types/auth-payload.types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: FastifyReply) => {
          const data: AuthPayLoad = JSON.parse(
            request?.cookies["auth-cookie"] ?? null,
          );
          if (!data) return null;

          return data.token;
        },
      ]),
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
