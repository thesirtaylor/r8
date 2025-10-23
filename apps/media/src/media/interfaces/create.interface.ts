export interface CreateUploadUrlParams {
  mime: string;
  size: string;
  idempotencyKey: string;
}

export interface CreateUploadUrlResult {
  cfId: string;
  uploadUrl: string;
  expiresAt: Date;
}
