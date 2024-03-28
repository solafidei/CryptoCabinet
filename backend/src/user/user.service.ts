import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { CreateUserDTO, LoginUserDTO } from "./dto";
import * as argon2 from "argon2";
import { validate } from "class-validator";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async create(dto: CreateUserDTO): Promise<User> {
    const { email } = dto;
    const findUser = await this.userModel.findOne({
      where: {
        email,
      },
    });

    if (findUser) {
      const error = { username: "email must be unique" };
      throw new HttpException(
        { message: "Input data validation failed", error },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = new User();
    newUser.firstName = dto.firstName;
    newUser.lastName = dto.lastName;
    newUser.email = dto.email;
    newUser.password = dto.password;

    const errors = await validate(newUser);

    if (errors.length > 0) {
      const _errors = { username: "UserInput is invalid", errors };
      throw new HttpException(
        { message: "Input data validation failed", _errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return newUser.save();
    }
  }

  async update(userData: User): Promise<User> {
    const user = await this.userModel.findByPk(userData.id);

    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.email = userData.email;
    user.password = await argon2.hash(userData.password);
    return await user.save();
  }

  async remove(email: string): Promise<void> {
    const user = await this.userModel.findOne({
      where: {
        email,
      },
    });
    return await user.destroy();
  }
}
