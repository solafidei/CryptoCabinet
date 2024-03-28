import {
  Get,
  Controller,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Req,
  Res,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.model";
import { CreateUserDTO } from "./dto";
import { CurrentUser } from "./types/current-user.type";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { LocalAuthGuard } from "src/auth/local-auth.guard";
import { AuthService } from "src/auth/auth.service";

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Get("users")
  @UseGuards(AuthGuard("jwt"))
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

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

  @Post("users")
  async create(@Body("user") userData: CreateUserDTO): Promise<User> {
    return this.userService.create(userData);
  }

  @Put("user")
  async update(@Body("user") userData: User): Promise<User> {
    return this.userService.update(userData);
  }

  @Delete("users/:email")
  async remove(@Param() params: { email: string }): Promise<void> {
    return this.userService.remove(params.email);
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
