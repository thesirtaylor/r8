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
  @IsUUID() entityId: string;
  @IsInt() @Min(1) @Max(5) score: number;
  @IsOptional() @IsString() comment?: string;
  @IsArray() tags?: string[];
  @IsOptional() @IsBoolean() anonymous?: boolean;
}
