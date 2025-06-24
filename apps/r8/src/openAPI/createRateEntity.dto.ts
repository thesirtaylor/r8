import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityType, SocialLinksDto } from '@app/commonlib';

export class RateEntityResponseDto {
  @ApiProperty({ enum: EntityType })
  type: EntityType;

  @ApiProperty()
  name: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  country: string;

  @ApiPropertyOptional()
  googlePlaceId?: string;

  @ApiPropertyOptional()
  socials?: SocialLinksDto;

  @ApiPropertyOptional()
  latitude?: number;

  @ApiPropertyOptional()
  longitude?: number;

  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
