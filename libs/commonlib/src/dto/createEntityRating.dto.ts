import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateEntityRatingDto {
  @ApiProperty() @IsUUID() entityId: string;
  @ApiProperty() @IsInt() @Min(1) @Max(5) score: number;
  @ApiPropertyOptional() @IsOptional() @IsString() comment?: string;
  @ApiProperty() @IsArray() tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() anonymous?: boolean;
}
