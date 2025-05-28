export interface FindEntitysRatingsWithCursor {
  entityId: string;
  limit?: number;
  cursor?: {
    createdAt: Date;
    id: string;
  };
}

export interface CreateRating {
  userId: string;
  entityId: string;
  score: number;
  comment?: string;
  tags?: string[];
  anonymous?: boolean;
}
