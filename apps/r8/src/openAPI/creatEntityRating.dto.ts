import { ApiProperty } from '@nestjs/swagger';

export class EntityReferenceDto {
  @ApiProperty({ format: 'uuid' })
  id: string;
}

export class UserReferenceDto {
  @ApiProperty({ format: 'uuid' })
  id: string;
}

export class RatingDetailResponseDto {
  @ApiProperty({ minimum: 1, maximum: 5 })
  score: number;

  @ApiProperty()
  comment: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  anonymous: boolean;

  @ApiProperty({ type: EntityReferenceDto })
  entity: EntityReferenceDto;

  @ApiProperty({ type: UserReferenceDto })
  user: UserReferenceDto;

  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;
}
