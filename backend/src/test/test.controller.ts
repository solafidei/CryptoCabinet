import {
  Get,
  Controller,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from "@nestjs/common";
import { TestService } from "./test.service";
import { Test } from "./test.model";

@Controller("test")
export class TestController {
  constructor(private readonly testService: TestService) {}
  @Get()
  async findAll(): Promise<Test[]> {
    return this.testService.findAll();
  }

  @Post()
  async createTest(@Body() body: { name: string }): Promise<Test> {
    return this.testService.createTest(body.name);
  }

  @Get("/:id")
  async findOne(@Param() params: { id: string }): Promise<Test> {
    return this.testService.findOne(params.id);
  }

  @Put("/:id")
  async updateTest(
    @Param() params: { id: string },
    @Body() body: { name: string },
  ): Promise<Test> {
    return this.testService.updateTest(params.id, body.name);
  }

  @Delete("/:id")
  async removeTest(@Param() params: { id: string }): Promise<void> {
    return this.testService.remove(params.id);
  }
}
