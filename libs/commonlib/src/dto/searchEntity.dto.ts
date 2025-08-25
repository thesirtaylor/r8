import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityType } from '../entity';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class SearchTheEntityDto {
  @ApiProperty({ description: 'Search query' })
  @IsString()
  q: string;

  @ApiPropertyOptional({
    enum: EntityType,
    description: 'Filter by entity type',
  })
  @IsOptional()
  @IsEnum(EntityType)
  type?: EntityType;
}

export class SearchEngineSearchTheEntityDto {
  @ApiProperty({ description: 'Search query' })
  @IsString()
  q: string;
}
