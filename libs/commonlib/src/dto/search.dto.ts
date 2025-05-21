import { EntityType } from '@app/commonlib';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class SearchRateEntityDto {
  @IsString() q: string;
  @IsOptional() @IsEnum(EntityType) type?: EntityType;
}
