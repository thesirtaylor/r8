// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.5
//   protoc               v3.21.12
// source: r8.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "r8";

export interface GetUserRequest {
  id: string;
}

export interface UserResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  /** optional field */
  username?: string | undefined;
  name: string;
  email: string;
  avatar: string;
}

export interface GetRatingStatRequest {
  id: string;
}

export interface GetRatingStatResponse {
  totalRatings: string;
  normalizedMeanScore: string;
  scoreCounts: { [key: string]: number };
}

export interface GetRatingStatResponse_ScoreCountsEntry {
  key: string;
  value: number;
}

export interface GlobalStatsQueryRequest {
  /** 'day' | 'week' | 'month' | 'year' */
  interval?: string | undefined;
  from?: string | undefined;
  to?: string | undefined;
  cursor?: string | undefined;
  limit?: number | undefined;
  city?: string | undefined;
  state?: string | undefined;
  country?: string | undefined;
  keyword?: string | undefined;
}

export interface GlobalRatingStat {
  interval: string;
  entityId: string;
  totalRatings: string;
  minCreatedAt: string;
  maxCreatedAt: string;
  normalizedMeanScore: string;
  scoreCounts: { [key: string]: number };
  entity: Entity | undefined;
}

export interface GlobalRatingStat_ScoreCountsEntry {
  key: string;
  value: number;
}

export interface Entity {
  id: string;
  name: string;
}

export interface NextCursor {
  cursor: string;
}

export interface GlobalRatingStatsResponse {
  data: GlobalRatingStat[];
  nextCursor: NextCursor | undefined;
  hasNextPage: boolean;
}

export interface CreateEntityRatingRequest {
  entityId: string;
  userId: string;
  score: number;
  comment?: string | undefined;
  tags: string[];
  anonymous?: boolean | undefined;
}

export interface EntityReference {
  id: string;
}

export interface UserReference {
  id: string;
}

export interface RatingDetailResponse {
  score: number;
  comment: string;
  tags: string[];
  anonymous: boolean;
  entity: EntityReference | undefined;
  user: UserReference | undefined;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  facebook?: string | undefined;
  twitter?: string | undefined;
  linkedin?: string | undefined;
  instagram?: string | undefined;
  youtube?: string | undefined;
  wechat?: string | undefined;
  telegram?: string | undefined;
  url?: string | undefined;
  truthSocials?: string | undefined;
  tiktok?: string | undefined;
  threads?: string | undefined;
  twitch?: string | undefined;
  snapchat?: string | undefined;
  reddit?: string | undefined;
  quora?: string | undefined;
  discord?: string | undefined;
}

export interface CreateRateEntityRequest {
  type: string;
  name: string;
  street?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  country?: string | undefined;
  googlePlaceId?: string | undefined;
  socials?: SocialLinks | undefined;
}

export interface RateEntityResponse {
  id: string;
  type: string;
  name?: string | undefined;
  street?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  country?: string | undefined;
  googlePlaceId?: string | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  socials?: SocialLinks | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface FindRatingsQuery {
  entityId: string;
  limit?: number | undefined;
  cursorId?: string | undefined;
}

export interface RatingResponseItem {
  id: string;
  score: number;
  comment: string;
  tags: string[];
  anonymous: boolean;
  createdAt: string;
  name: string;
  email: string;
  avatar: string;
}

export interface PaginatedRatingsResponse {
  data: RatingResponseItem[];
  nextCursor: string;
  hasNextPage: boolean;
}

export interface SearchRateEntityRequest {
  q: string;
  type?: string | undefined;
}

export interface RateEntity {
  id: string;
  type: string;
  name?: string | undefined;
  street?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  country?: string | undefined;
  googlePlaceId?: string | undefined;
  socials?: SocialLinks | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface RateEntityListResponse {
  data: RateEntity[];
}

export const R8_PACKAGE_NAME = "r8";

export interface R8ServiceClient {
  createRateEntity(request: CreateRateEntityRequest): Observable<RateEntityResponse>;

  findRatingsForEntity(request: FindRatingsQuery): Observable<PaginatedRatingsResponse>;

  searchRateEntities(request: SearchRateEntityRequest): Observable<RateEntityListResponse>;

  createEntityRating(request: CreateEntityRatingRequest): Observable<RatingDetailResponse>;

  getGlobalRatingStats(request: GlobalStatsQueryRequest): Observable<GlobalRatingStatsResponse>;

  getRatingStat(request: GetRatingStatRequest): Observable<GetRatingStatResponse>;

  getUser(request: GetUserRequest): Observable<UserResponse>;
}

export interface R8ServiceController {
  createRateEntity(
    request: CreateRateEntityRequest,
  ): Promise<RateEntityResponse> | Observable<RateEntityResponse> | RateEntityResponse;

  findRatingsForEntity(
    request: FindRatingsQuery,
  ): Promise<PaginatedRatingsResponse> | Observable<PaginatedRatingsResponse> | PaginatedRatingsResponse;

  searchRateEntities(
    request: SearchRateEntityRequest,
  ): Promise<RateEntityListResponse> | Observable<RateEntityListResponse> | RateEntityListResponse;

  createEntityRating(
    request: CreateEntityRatingRequest,
  ): Promise<RatingDetailResponse> | Observable<RatingDetailResponse> | RatingDetailResponse;

  getGlobalRatingStats(
    request: GlobalStatsQueryRequest,
  ): Promise<GlobalRatingStatsResponse> | Observable<GlobalRatingStatsResponse> | GlobalRatingStatsResponse;

  getRatingStat(
    request: GetRatingStatRequest,
  ): Promise<GetRatingStatResponse> | Observable<GetRatingStatResponse> | GetRatingStatResponse;

  getUser(request: GetUserRequest): Promise<UserResponse> | Observable<UserResponse> | UserResponse;
}

export function R8ServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createRateEntity",
      "findRatingsForEntity",
      "searchRateEntities",
      "createEntityRating",
      "getGlobalRatingStats",
      "getRatingStat",
      "getUser",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("R8Service", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("R8Service", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const R8_SERVICE_NAME = "R8Service";
