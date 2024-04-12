import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { CurrentUser } from "../user/types/current-user.type";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<CurrentUser> {
    const user = await this.authService.validateLogin({ email, password });

    if (!user)
      throw new UnauthorizedException({
        error: "Incorrect username or password",
      });
    return user;
  }
}
