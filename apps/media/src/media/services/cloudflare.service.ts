import { LoadEnvVar } from '@app/commonlib';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import {
  CloudflareImageUploadResponse,
  CloudflareStreamUploadResponse,
  CreateUploadUrlParams,
  CreateUploadUrlResult,
} from '../interfaces';

@Injectable()
export class CloudflareServices {
  private readonly accountId: string;
  private readonly imagesToken: string;
  private readonly streamToken: string;
  private readonly imageApiBase: string;
  private readonly streamApiBase: string;

  constructor() {
    this.accountId = LoadEnvVar('CLOUDFLARE_ACCOUNT_ID');
    this.imagesToken = LoadEnvVar('CLOUDFLARE_IMAGES_TOKEN');
    this.streamToken = LoadEnvVar('CLOUDFLARE_STREAM_TOKEN');

    this.imageApiBase = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/images/v2`;
    this.streamApiBase = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/stream`;
  }

  private isVideo(mime: string): boolean {
    return mime.startsWith('video/');
  }

  private isImage(mime: string): boolean {
    return mime.startsWith('image/');
  }

  private validateMime(mime: string): void {
    const supportedImages = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    const supportedVideos = [
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-msvideo',
      'video/mpeg',
    ];

    if (this.isImage(mime) && !supportedImages.includes(mime)) {
      throw new RpcException({
        code: GrpcStatus.INVALID_ARGUMENT,
        message: `Unsupported image format: ${mime}`,
      });
    }

    if (this.isVideo(mime) && !supportedVideos.includes(mime)) {
      throw new RpcException({
        code: GrpcStatus.INVALID_ARGUMENT,
        message: `Invalid media type: ${mime}`,
      });
    }
  }
  private mediaSize(size: number): number {
    return size * 1024 * 1024;
  }
  private validateSize(size: string, mime: string): void {
    const sizeNum = parseInt(size, 10);
    if (this.isImage(mime) && sizeNum > this.mediaSize(10)) {
      throw new RpcException({
        code: GrpcStatus.INVALID_ARGUMENT,
        message: 'Image size exceeds 10MB limit',
      });
    }

    if (this.isVideo(mime) && sizeNum > this.mediaSize(200)) {
      throw new RpcException({
        code: GrpcStatus.INVALID_ARGUMENT,
        message: 'Video size exceeds 200MB limit',
      });
    }
  }

  async createUploadUrl(
    params: CreateUploadUrlParams,
  ): Promise<CreateUploadUrlResult> {
    const { mime, size, idempotencyKey } = params;

    this.validateMime(mime);
    this.validateSize(size, mime);

    if (this.isImage(mime)) {
      return await this.createImageUploadUrl(idempotencyKey);
    } else {
      return await this.createStreamUploadUrl(idempotencyKey, size);
    }
  }

  private async createImageUploadUrl(
    idempotencyKey: string,
  ): Promise<CreateUploadUrlResult> {
    try {
      const response = await fetch(`${this.imageApiBase}/direct_upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.imagesToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requireSignedURLs: false,
          metadata: {
            idempotencyKey,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Cloudflare Images API error: ${error}`);
      }

      const data: CloudflareImageUploadResponse = await response.json();

      if (!data.success) {
        throw new Error(
          `Cloudflare Images API failed: ${JSON.stringify(data.errors)}`,
        );
      }

      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      return {
        cfId: data.result.id,
        uploadUrl: data.result.uploadURL,
        expiresAt,
      };
    } catch (error) {
      throw new RpcException({
        code: GrpcStatus.INTERNAL,
        message: `Failed to create image upload URL: ${error.message}`,
      });
    }
  }

  private async createStreamUploadUrl(
    idempotencyKey: string,
    size: string,
  ): Promise<CreateUploadUrlResult> {
    try {
      const response = await fetch(`${this.streamApiBase}?direct_user=true`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.streamToken}`,
          'Content-Type': 'application/json',
          'Tus-Resumable': '1.0.0',
          'Upload-Length': size,
        },
        body: JSON.stringify({
          maxDurationSeconds: 3600,
          meta: {
            idempotencyKey,
          },
          uploadCreator: idempotencyKey,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Cloudflare Stream API error: ${error}`);
      }

      const data: CloudflareStreamUploadResponse = await response.json();

      if (!data.success) {
        throw new Error(
          `Cloudflare Stream API failed: ${JSON.stringify(data.errors)}`,
        );
      }

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      return {
        cfId: data.result.uid,
        uploadUrl: data.result.uploadURL,
        expiresAt,
      };
    } catch (error) {
      throw new RpcException({
        code: GrpcStatus.INTERNAL,
        message: `Failed to create video upload URL: ${error.message}`,
      });
    }
  }

  async verify(params: {
    cfId: string;
    mime: string;
    idempotencyKey: string;
  }): Promise<{ success: boolean; reason: string }> {
    const { cfId, mime, idempotencyKey } = params;

    if (this.isImage(mime)) {
      return this.verifyImage(cfId, idempotencyKey);
    } else {
      return this.verifyVideo(cfId, idempotencyKey);
    }
  }

  private async verifyImage(
    cfId: string,
    idempotencyKey: string,
  ): Promise<{ success: boolean; reason: string }> {
    try {
      const response = await fetch(`${this.imageApiBase}/${cfId}`, {
        method: 'GET',
        headers: {
          Autorization: `Bearer ${this.imagesToken}`,
        },
      });

      if (!response.ok) {
        return {
          success: false,
          reason: `Image not found or not uploaded: ${cfId}`,
        };
      }

      const data = await response.json();

      if (!data.success) {
        return {
          success: false,
          reason: `Image verification failed: ${JSON.stringify(data.errors)}`,
        };
      }

      if (data.result.meta?.idempotencyKey !== idempotencyKey) {
        return {
          success: false,
          reason: 'Idempotency key mismatch',
        };
      }

      return { success: true, reason: '' };
    } catch (error) {
      return {
        success: false,
        reason: `Image verification error: ${error.message}`,
      };
    }
  }

  private async verifyVideo(
    cfId: string,
    idempotencyKey: string,
  ): Promise<{ success: boolean; reason: string }> {
    try {
      const response = await fetch(`${this.streamApiBase}/${cfId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.streamToken}`,
        },
      });

      if (!response.ok) {
        return {
          success: false,
          reason: `Video not found or not uploaded: ${cfId}`,
        };
      }

      const data = await response.json();

      if (!data.success) {
        return {
          success: false,
          reason: `Video verification failed: ${JSON.stringify(data.errors)}`,
        };
      }

      const video = data.result;

      if (video.status?.state === 'error') {
        return {
          success: false,
          reason: `Video processing error: ${video.status.errorReasonText}`,
        };
      }

      if (
        video.status?.state !== 'ready' &&
        video.status?.state !== 'inprogress'
      ) {
        return {
          success: false,
          reason: `Video not ready, current state: ${video.status?.state}`,
        };
      }

      if (video.meta?.idempotencyKey !== idempotencyKey) {
        return {
          success: false,
          reason: 'Idempotency key mismatch',
        };
      }

      return { success: true, reason: '' };
    } catch (error) {
      return {
        success: false,
        reason: `Video verification error: ${error.message}`,
      };
    }
  }
}
