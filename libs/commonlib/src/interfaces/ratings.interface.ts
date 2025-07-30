export interface IFindEntitysRatingsWithCursor {
  entityId: string;
  limit?: number;
  cursor_id?: string;
  cursor_createdAt?: string;
  cursor?: {
    createdAt?: string;
    id?: string;
  };
}

export interface ICreateRating {
  userId: string;
  entityId: string;
  score: number;
  comment?: string;
  tags?: string[];
  anonymous?: boolean;
}

export interface IGlobalRatingStats {
  // interval: 'day' | 'week' | 'month' | 'year';
  interval?: string;
  cursor?: string;
  limit?: number;
  keyword?: string;
  from?: string;
  to?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface IRatingStats {
  id: string;
}
