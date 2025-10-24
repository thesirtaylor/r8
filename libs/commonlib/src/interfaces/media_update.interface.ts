export interface MediaUpdatePayload {
  batchId: string;
  entityId: string;
  itemIds: string[];
  urls: string[];
  cfIds: string[];
  count: number;
  totalItems: number;
  failedCount: number;
  at: string;
  eventId: string;
}
