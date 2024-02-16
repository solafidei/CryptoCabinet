import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { CreateUserDTO, LoginUserDTO } from "./dto";
import * as argon2 from "argon2";
import { validate } from "class-validator";
import { CurrentUser } from "./types/current-user.type";
import { JwtService } from "@nestjs/jwt";
import * as randomToken from "rand-token";
import * as moment from "moment";
import { Op } from "sequelize";

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

  async validateLogin({ email, password }: LoginUserDTO): Promise<CurrentUser> {
    const user = await this.userModel.findOne({
      where: {
        email,
      },
    });

    if (!user) return null;

    if (await argon2.verify(user.password, password)) {
      const currentUser = this.buildCurrentUser(user);

      return currentUser;
    }
    return null;
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

  public async getJwtToken(user: CurrentUser): Promise<string> {
    const payload = {
      ...user,
    };

    return this.jwtService.signAsync(payload);
  }

  public async getRefreshToken(userId: number): Promise<string> {
    const userDataToUpdate = {
      refreshToken: randomToken.generate(16),
      refreshTokenExp: moment().format("YYYY/MM/DD"),
    };

    const user = await this.userModel.findByPk(userId);
    user.refreshToken = userDataToUpdate.refreshToken;
    user.refreshTokenExp = userDataToUpdate.refreshTokenExp;

    await user.save();
    return userDataToUpdate.refreshToken;
  }

  public async validRefreshToken(
    email: string,
    refreshToken: string,
  ): Promise<CurrentUser> {
    const weekStart = moment().day(1).format("YYYY/MM/DD");
    const user = await this.userModel.findOne({
      where: {
        email,
        refreshToken,
        refreshTokenExp: { [Op.gte]: weekStart },
      },
    });

    if (!user) return null;

    const currentUser = this.buildCurrentUser(user);

    return currentUser;
  }

  private buildCurrentUser(user: User) {
    const currentUser = new CurrentUser();
    currentUser.userId = user.id;
    currentUser.firstName = user.firstName;
    currentUser.lastName = user.lastName;
    currentUser.email = user.email;

    return currentUser;
  }
}
