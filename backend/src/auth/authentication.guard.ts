import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "src/user/user.model";
import { InjectModel } from "@nestjs/sequelize";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { CurrentUser } from "src/user/types/current-user.type";
import { Response } from "express";
import { AuthPayLoad } from "src/types/auth-payload.types";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private authService: AuthService,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const res: Response = ctx.switchToHttp().getResponse();
    //console.log("COOKIES", req);
    //console.log("SERVICE", this.jwtService.sign("TEST"));
    const authCookie: AuthPayLoad = req.cookies["auth-cookie"];
    if (authCookie) {
      const refreshToken = authCookie.refreshToken;
      const jwtToken = authCookie.token;
      console.log("DOING MY PRE_GUARD", refreshToken, jwtToken);

      const decodedJWT = this.jwtService.decode(jwtToken);
      console.log("DECODED", decodedJWT);
      const expiredJwtToken = Date.now() >= decodedJWT.exp * 1000;
      if (expiredJwtToken) {
        const validRefreshToken = await this.authService.validRefreshToken(
          decodedJWT.email,
          refreshToken,
        );

        const payload: CurrentUser = {
          email: decodedJWT.email,
          firstName: decodedJWT.firstName,
          lastName: decodedJWT.lastName,
          userId: decodedJWT.userId,
          roles: decodedJWT.roles,
        };
        req["user"] = payload;

        //console.log("REQ", req.app);
        if (validRefreshToken) {
          await this.authService.regenerateTokens(req, res);
          res.redirect(req.originalUrl);
          //res.redirect("/refresh-tokens");
          //console.log("NEW TOKEN", newToken.value);
        }
      } else return true;
    } else
      throw new UnauthorizedException({
        error: "Not logged in",
      });
  }
}
