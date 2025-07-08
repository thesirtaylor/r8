import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  CreateRateEntityDto,
  RateEntity,
  SearchRateEntityDto,
} from '@app/commonlib';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { RateEntityResponseDto } from '../openAPI';
import { JwtAuthGuard } from '../auth/guards/jwt.oauth-guard';
import { RateEntityListResponseDto } from '../openAPI/regularSearch.dto';
import { R8Service } from './r8.service';
import { CreateRateEntityRequest } from '@app/commonlib/protos_output/r8.pb';
import { validateOrReject } from 'class-validator';

@ApiTags('rate-entities')
@Controller('rate-entities')
export class R8Controller {
  constructor(private readonly r8Service: R8Service) {}

  // @Get('search')
  // @ApiOperation({
  //   summary:
  //     'General Search Rate Entity, this does not include autocomplete or ElasticSearch',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Entity Found',
  //   type: RateEntityListResponseDto,
  // })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // async search(@Query() dto: SearchRateEntityDto): Promise<RateEntity[]> {
  //   return await this.r8Service.search(dto);
  // }

  @Post('create')
  // @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-token')
  @ApiOperation({ summary: 'Create a new rateable entity' })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: RateEntityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    description: 'Create new rateable entity',
    type: CreateRateEntityDto,
  })
  async CreateEntity(@Body() payload: CreateRateEntityRequest) {
    // await validateOrReject({ payload });
    return await this.r8Service.createRateEntity(payload);
  }
}
