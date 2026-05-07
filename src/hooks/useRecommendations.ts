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

interface RecommendationsResponse {
  products?: RecommendationProduct[];
  pets?: RecommendationPet[];
  articles?: RecommendationArticle[];
  breeds?: RecommendationBreed[];
}

export const useRecommendations = (payload: RecommendationPayload) => {
  const [data, setData] =
    useState<RecommendationsResponse | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!payload.tag_ids.length) return;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);

        const response =
          await recommendationService.getRecommendations(payload);

        setData(response?.data || response);

      } catch (err) {
        setError("Failed to fetch recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [JSON.stringify(payload)]);

  return {
    data,
    loading,
    error,
  };
};