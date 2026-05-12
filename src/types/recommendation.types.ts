export interface RecommendationPayload {
  tag_ids: number[];
  is_product?: boolean;
  is_pets?: boolean;
  is_breed?: boolean;
  is_article?: boolean;
  is_video?: boolean;
  limit?: number;
}

export interface RecommendationResponse {
  pets?: any[];
  products?: any[];
  breeds?: any[];
  articles?: any[];
  videos?: any [];
}

