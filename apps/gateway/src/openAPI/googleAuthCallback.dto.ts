import { ApiProperty } from '@nestjs/swagger';

export class OAuthCallbackResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refresh_token: string;
}
