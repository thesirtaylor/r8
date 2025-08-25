import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.oauth-guard';
import {
  FinaliseUploadRequest,
  UploadMediaRequest,
} from '@app/commonlib/protos_output/media.pb';
import { AppLoggerService } from '@app/commonlib';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly logger: AppLoggerService,
  ) {}

  @Post('uploads/initiate')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Initiate media upload for specified entity' })
  @ApiBody({ description: '', type: '' })
  @ApiResponse({ status: 200, type: '' })
  async initiateUpload(
    @Request() req: any,
    @Body() payload: UploadMediaRequest,
  ) {
    //the entity creator may upload media for it...
    const { user } = req;
    this.logger.log({ user });

    await this.mediaService.initiateUpload(payload);
  }

  @Post('/uploads/finalise')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Finalise media upload for specified entity batch' })
  @ApiBody({ description: '', type: '' })
  @ApiResponse({ status: 200, type: '' })
  async finaliseUpload(
    @Request() req: any,
    @Body() payload: FinaliseUploadRequest,
  ) {
    //the entity creator may uplaod media for it...
    const { user } = req;
    this.logger.log({ user });

    await this.mediaService.finaliseUpload(payload);
  }
}
