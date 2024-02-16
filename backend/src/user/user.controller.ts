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
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.model";
import { CreateUserDTO, LoginUserDTO } from "./dto";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get("users")
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get("user")
  async findOne(@Body("user") userData: LoginUserDTO): Promise<User> {
    const foundUser = this.userService.findByEmail(userData);

    const error = { User: "not found" };
    if (!foundUser) throw new HttpException({ error }, 401);

    return foundUser;
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
