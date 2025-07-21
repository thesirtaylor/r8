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

interface locationFilter {
  city?: string;
  state?: string;
  country?: string;
}

export interface IGlobalRatingStats {
  // interval: 'day' | 'week' | 'month' | 'year';
  interval: string;
  cursor?: string;
  limit?: number;
  locationFilter?: locationFilter;
  keyword?: string;
  from?: string;
  to?: string;
}

export interface IRatingStats {
  id: string;
}
