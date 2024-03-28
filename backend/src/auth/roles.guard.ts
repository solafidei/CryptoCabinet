import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "./role.enum";
import { ROLES_KEYS } from "./roles.decorator";
import { User } from "src/user/user.model";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEYS, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user } = ctx.switchToHttp().getRequest();
    const dbUser = await this.userModel.findOne(user.username);

    return requiredRoles.some((role) => dbUser.roles?.includes(role));
  }
}
