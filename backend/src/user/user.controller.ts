import {
  Get,
  Controller,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpException,
  UsePipes,
  UseGuards,
  Req,
  Res,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.model";
import { CreateUserDTO, LoginUserDTO } from "./dto";
import { CurrentUser } from "./types/current-user.type";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get("users")
  @UseGuards(AuthGuard("jwt"))
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post("login")
  @UseGuards(AuthGuard("local"))
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const token = await this.userService.getJwtToken(req.user as CurrentUser);
    const refreshToken = await this.userService.getRefreshToken(
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
    const token = await this.userService.getJwtToken(req.user as CurrentUser);
    const refreshToken = await this.userService.getRefreshToken(
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
