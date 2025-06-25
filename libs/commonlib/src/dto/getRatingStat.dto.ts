import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetRatingStatDto {
  @ApiProperty() @IsOptional() @IsString() id: string;
}
