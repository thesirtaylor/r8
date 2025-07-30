import { ApiProperty } from '@nestjs/swagger';

class EntityDto {
  @ApiProperty({ example: 'e01a6bd5-7c5a-4bbc-a8d2-512b9bd62562' })
  id: string;

  @ApiProperty({ example: 'Phyllis Haley' })
  name: string;
}

export class GlobalRatingStatDto {
  @ApiProperty({ example: '2025-06-22T23:00:00.000Z' })
  interval: string;

  @ApiProperty({ example: 'e01a6bd5-7c5a-4bbc-a8d2-512b9bd62562' })
  entityId: string;

  @ApiProperty({ example: '4' })
  totalRatings: string;

  @ApiProperty({ example: '2025-06-24T12:00:05.516Z' })
  minCreatedAt: string;

  @ApiProperty({ example: '2025-06-24T17:28:37.347Z' })
  maxCreatedAt: string;

  @ApiProperty({ example: '2.00' })
  normalizedMeanScore: string;

  @ApiProperty({
    example: { '2': 4, '3': 1 },
    description: 'Key is the score, value is the number of occurrences',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  scoreCounts: Record<string, number>;

  @ApiProperty({ type: EntityDto })
  entity: EntityDto;
}

export class NextCursorDto {
  @ApiProperty({ example: '2025-06-22T23:00:00.000Z' })
  cursor: string;
}

export class GlobalRatingStatsResponseDto {
  @ApiProperty({ type: [GlobalRatingStatDto] })
  data: GlobalRatingStatDto[];

  @ApiProperty({ type: NextCursorDto, nullable: true })
  nextCursor: NextCursorDto | null;

  @ApiProperty({ example: false })
  hasNextPage: boolean;
}
