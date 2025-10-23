export interface CloudflareImageUploadResponse {
  result: {
    id: string;
    uploadURL: string;
  };
  success: boolean;
  errors: any[];
  messages: any[];
}
