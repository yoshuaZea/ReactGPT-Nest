import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class OrthographyDto {
  @IsString()
  readonly prompt: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number) // * Convert to Number
  readonly maxTokens?: number;
}
