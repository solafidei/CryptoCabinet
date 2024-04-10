import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthGuard } from "@nestjs/passport";
import { ApiResponseObject } from "src/shared/api-response.types";
import { FastifyReply } from "fastify";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("login")
  @UseGuards(LocalAuthGuard)
  async login(
    @Req() req,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<ApiResponseObject> {
    return this.authService.regenerateTokens(req, res);
  }

  @Get("refresh-tokens")
  @UseGuards(AuthGuard("refresh"))
  async regenerateTokens(
    @Req() req,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return this.authService.regenerateTokens(req, res);
  }
}
