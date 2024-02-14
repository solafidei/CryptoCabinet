import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Test } from "./test.model";

@Injectable()
export class TestService {
  constructor(
    @InjectModel(Test)
    private testModel: typeof Test,
  ) {}

  async findAll(): Promise<Test[]> {
    return this.testModel.findAll();
  }

  async findOne(id: string): Promise<Test> {
    return this.testModel.findOne({
      where: {
        id,
      },
    });
  }

  createTest(name: string): Promise<Test> {
    const test = new Test({ name });
    return test.save();
  }

  async updateTest(id: string, name: string): Promise<Test> {
    const test = await Test.findOne({
      where: {
        id,
      },
    });
    test.name = name;
    return await test.save();
  }

  async remove(id: string): Promise<void> {
    const test = await this.findOne(id);
    return await test.destroy();
  }
}
