import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsUUID, IsOptional, IsInt, Min } from 'class-validator';

export class FindEntitysRatingsWithCursorQuery {
  @ApiProperty({
    format: 'uuid',
    description: 'ID of the entity to fetch ratings for',
  })
  @IsUUID()
  entityId: string;

  @ApiPropertyOptional({
    minimum: 1,
    default: 10,
    description: 'Number of results to return',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'ID of the last item in previous page',
  })
  @IsUUID()
  @IsOptional()
  cursor_id: string;
}
