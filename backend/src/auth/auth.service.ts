import { InjectModel } from "@nestjs/sequelize";

import * as argon2 from "argon2";

import { JwtService } from "@nestjs/jwt";
import * as randomToken from "rand-token";
import * as moment from "moment";
import { Op } from "sequelize";
import { User } from "src/user/user.model";
import { Injectable } from "@nestjs/common";
import { LoginUserDTO } from "src/user/dto";
import { CurrentUser } from "src/user/types/current-user.type";
import { AuthPayLoad } from "src/types/auth-payload.types";
import { ApiResponseObject } from "src/shared/api-response.types";
import { FastifyReply } from "fastify";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

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

  public async getJwtToken(user: CurrentUser): Promise<string> {
    const payload = {
      ...user,
    };

    // had to manually put cos not cant get them when calling from authguard
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: "10s",
    });
  }

  public async getRefreshToken(userId: number): Promise<string> {
    const userDataToUpdate = {
      refreshToken: randomToken.generate(16),
      refreshTokenExp: new Date(moment().format("YYYY/MM/DD")),
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
    const weekStart = moment().day(1).format("YYYY-MM-DD");
    const conditional = email
      ? {
          email,
          refreshToken,
          refreshTokenExp: { [Op.gte]: weekStart },
        }
      : {
          refreshToken,
          refreshTokenExp: { [Op.gte]: weekStart },
        };
    const user = await this.userModel.findOne({
      where: conditional,
    });

    if (!user) return null;

    const currentUser = this.buildCurrentUser(user);

    return currentUser;
  }

  public async regenerateTokens(
    req,
    res: FastifyReply,
  ): Promise<ApiResponseObject> {
    const token = await this.getJwtToken(req.user as CurrentUser);
    const refreshToken = await this.getRefreshToken(req.user.userId);

    const authPayload: AuthPayLoad = {
      token,
      refreshToken,
    };

    res.setCookie("auth-cookie", JSON.stringify(authPayload), {
      httpOnly: true,
    });
    return { action: "none", value: "success" };
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
