import {
  Get,
  Controller,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.model";
import { CreateUserDTO } from "./dto";
import { AuthGuard } from "@nestjs/passport";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get("users")
  @UseGuards(AuthGuard("jwt"))
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
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
}
