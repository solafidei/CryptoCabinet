import { Get, Controller } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  root(): string {
    return "Welcome to my super secret API. I hope you find what you're looking for :)";
  }
}
