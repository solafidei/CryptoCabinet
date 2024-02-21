import { IsNotEmpty } from "class-validator";

export class CreateAssetDTO {
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly description: string;
  readonly uploadLink: string;
}
