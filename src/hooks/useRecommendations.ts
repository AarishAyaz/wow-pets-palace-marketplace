import { useEffect, useState } from "react";
import { recommendationService } from "../services/recommendation.service";
import { RecommendationPayload } from "../types/recommendation.types";

interface RecommendationTag {
  id: number;
  name: string;
}

interface RecommendationProduct {
  id: number;
  name: string;
  slug: string;
  featured_image: string;
  original_price: number;
  tags: RecommendationTag[];
}

interface RecommendationPet {
  pet_id: number;
  pet_name: string;
  image: string;
  breed: string;
  description: string;
  slug: string;
  tags: RecommendationTag[];
}

interface RecommendationArticle {
  id: number;
  title: string;
  slug: string;
  image: string;
  description: string;
  tags: RecommendationTag[];
}

interface RecommendationBreed {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  tags: RecommendationTag[];
}

interface RecommendationVideo {
  video_id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  duration_seconds: number;
  total_views: number;
  total_likes: number;
  published_at: string;
  tags: RecommendationTag[];
}

interface RecommendationsResponse {
  products?: RecommendationProduct[];
  pets?: RecommendationPet[];
  articles?: RecommendationArticle[];
  breeds?: RecommendationBreed[];
  videos?: RecommendationVideo[];
}

export const useRecommendations = (payload: RecommendationPayload) => {
  const [data, setData] =
    useState<RecommendationsResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  if (!payload?.tag_ids?.length) return;

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Calling recommendations API...", payload);

      const response =
        await recommendationService.getRecommendations(payload);

      console.log("Recommendations response:", response);

      setData(response?.data || response);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  fetchRecommendations();
}, [payload]);

  return {
    data,
    loading,
    error,
  };
};