export interface CloudflareStreamUploadResponse {
  result: {
    uid: string;
    uploadURL: string;
  };
  success: boolean;
  errors: any[];
  messages: any[];
}
