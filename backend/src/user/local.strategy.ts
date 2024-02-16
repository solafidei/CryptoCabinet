import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserService } from "./user.service";
import { CurrentUser } from "./types/current-user.type";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private userService: UserService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<CurrentUser> {
    const user = await this.userService.validateLogin({ email, password });

    if (!user) throw new UnauthorizedException();
    return user;
  }
}
