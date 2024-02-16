import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { CreateUserDTO, LoginUserDTO } from "./dto";
import * as argon2 from "argon2";
import { validate } from "class-validator";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findByEmail({ email, password }: LoginUserDTO): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        email,
      },
    });

    if (!user) return null;

    if (await argon2.verify(user.password, password)) return user;
    return null;
  }

  async create(dto: CreateUserDTO): Promise<User> {
    const { firstName, lastName, email, password } = dto;
    const findUser = await this.userModel.findOne({
      where: {
        email,
      },
    });
    console.log("FOUND USER", !!findUser);

    if (findUser) {
      const error = { username: "email must be unique" };
      throw new HttpException(
        { message: "Input data validation failed", error },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser = new User(dto);

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
    user.password = userData.password;
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
