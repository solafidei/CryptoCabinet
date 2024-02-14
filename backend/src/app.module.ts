import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { TestModule } from "./test/test.module";

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "",
      database: "decentralized-marketplace",
      autoLoadModels: true,
      synchronize: true,
    }),
    TestModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
