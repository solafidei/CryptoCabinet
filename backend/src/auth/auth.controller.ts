import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { CurrentUser } from "src/user/types/current-user.type";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("login")
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.getJwtToken(req.user as CurrentUser);
    const refreshToken = await this.authService.getRefreshToken(
      req.user.userId,
    );

    const secretData = {
      token,
      refreshToken,
    };

    res.cookie("auth-cookie", secretData, { httpOnly: true });
    return { msg: "success" };
  }

  @Get("refresh-tokens")
  @UseGuards(AuthGuard("refresh"))
  async regenerateTokens(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.getJwtToken(req.user as CurrentUser);
    const refreshToken = await this.authService.getRefreshToken(
      req.user.userId,
    );

    const secretData = {
      token,
      refreshToken,
    };

    res.cookie("auth-cookie", secretData, { httpOnly: true });
    return { msg: "success" };
  }
}
