import { ApiProperty } from '@nestjs/swagger';

export class RatingResponseItemDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  score: number;

  @ApiProperty()
  comment: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  anonymous: boolean;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatar: string;
}

export class PaginatedRatingsResponseDto {
  @ApiProperty({ type: [RatingResponseItemDto] })
  data: RatingResponseItemDto[];

  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  hasNextPage: boolean;
}
