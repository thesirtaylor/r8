import { ApiProperty } from '@nestjs/swagger';
import { RateEntityResponseDto } from './createRateEntity.dto';

export class RateEntityListResponseDto {
  @ApiProperty({ type: [RateEntityResponseDto] })
  data: RateEntityResponseDto[];
}
