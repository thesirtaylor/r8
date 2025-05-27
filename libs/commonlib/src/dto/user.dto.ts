import {
  IsEmail,
  IsString,
  IsUrl,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class UserDto {
  @IsString() @MaxLength(50) name: string;
  @IsUrl() avatar: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() @MaxLength(50) username: string;
}
