import { EntityType } from '@app/commonlib';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class SocialLinksDto {
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @IsOptional()
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  instagram?: string;

  @IsOptional()
  @IsUrl()
  youtube?: string;

  @IsOptional()
  @IsUrl()
  wechat?: string;

  @IsOptional()
  @IsUrl()
  telegram?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsUrl()
  truth_socials?: string;

  @IsOptional()
  @IsUrl()
  tiktok?: string;

  @IsOptional()
  @IsUrl()
  threads?: string;

  @IsOptional()
  @IsUrl()
  twitch?: string;

  @IsOptional()
  @IsUrl()
  snapchat?: string;

  @IsOptional()
  @IsUrl()
  reddit?: string;

  @IsOptional()
  @IsUrl()
  quora?: string;

  @IsOptional()
  @IsUrl()
  discord?: string;
}

export class CreateRateEntityDto {
  @IsEnum(EntityType) type: EntityType;
  @IsOptional() @IsString() name: string;
  @IsOptional() @IsString() street?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() googlePlaceId?: string;
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socials?: SocialLinksDto;
}
