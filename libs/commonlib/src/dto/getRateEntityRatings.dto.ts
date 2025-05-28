import { Type } from 'class-transformer';
import {
  IsUUID,
  IsOptional,
  IsInt,
  Min,
  ValidateNested,
  IsDateString,
} from 'class-validator';

class CursorDto {
  @IsDateString()
  @IsOptional()
  createdAt: Date;

  @IsUUID()
  @IsOptional()
  id: string;
}

export class FindEntitysRatingsWithCursorQuery {
  @IsUUID()
  entityId: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @ValidateNested()
  @Type(() => CursorDto)
  cursor?: CursorDto;
}
