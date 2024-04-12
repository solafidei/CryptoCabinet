import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { AuthPayLoad } from "src/types/auth-payload.types";
import { CurrentUser } from "src/user/types/current-user.type";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: () => void) {
    console.log("COOKIE", req.cookies);
    const authCookie: AuthPayLoad = req.cookies["auth-cookie"];

    console.log("AUTH", authCookie);
    const refreshToken = authCookie.refreshToken;
    const token = authCookie.token;
    //res.cookie("TEST", "TEST");
    console.log("TOKEN", req.cookies["auth-cookie"].token);
    if (authCookie) {
      const decodedJWT = this.jwtService.decode(token);
      console.log("DECODED", decodedJWT);
      const payload: CurrentUser = {
        email: decodedJWT.email,
        firstName: decodedJWT.firstName,
        lastName: decodedJWT.lastName,
        userId: decodedJWT.userId,
        roles: decodedJWT.roles,
      };
      req["user"] = payload;
      const expired = Date.now() >= decodedJWT.exp * 1000;

      console.log("EXPIRED", expired);
      if (expired) {
        const validRefreshToken = await this.authService.validRefreshToken(
          decodedJWT.email,
          refreshToken,
        );
        console.log("VALID REFRESH", validRefreshToken);
        if (validRefreshToken) {
          console.log("valid refresh token", validRefreshToken);
          await this.authService.regenerateTokens(req, res);
          res.redirect(req.originalUrl);
        }
      } else {
        next();
      }
    } else {
      res.send({ message: "Invalid token" });
    }
  }
}
