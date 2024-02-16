import * as argon2 from "argon2";
import { IsEmail } from "class-validator";
import { Optional } from "sequelize";
import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  refreshToken: string;
  refreshTokenExp: Date;
}

export interface UserInput extends Optional<UserAttributes, "id"> {}

@Table
export class User extends Model<UserAttributes, UserInput> {
  @Column(DataType.STRING)
  firstName: string;

  @Column(DataType.STRING)
  lastName: string;

  @IsEmail()
  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  password: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true, allowNull: false })
  isActive: boolean;

  @Column({ type: DataType.STRING })
  refreshToken: string;

  @Column({ type: DataType.DATE })
  refreshTokenExp: string;

  @CreatedAt
  readonly createdAt: Date;

  @UpdatedAt
  readonly updatedAt: Date;

  @BeforeCreate
  static async hashPassword(user: User) {
    if (user.password) user.password = await argon2.hash(user.password);
  }
}
