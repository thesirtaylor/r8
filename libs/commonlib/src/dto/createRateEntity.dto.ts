import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityType } from '../entity';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class SocialLinksDto {
  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  twitter?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  youtube?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  wechat?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  telegram?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  truth_socials?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  tiktok?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  threads?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  twitch?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  snapchat?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  reddit?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  quora?: string;

  @ApiPropertyOptional({ format: 'uri' })
  @IsOptional()
  @IsUrl()
  discord?: string;
}

export class CreateRateEntityDto {
  @ApiProperty({ enum: EntityType }) @IsEnum(EntityType) type: EntityType;
  @IsOptional() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() street?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() state?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() country?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() googlePlaceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socials?: SocialLinksDto;
}
