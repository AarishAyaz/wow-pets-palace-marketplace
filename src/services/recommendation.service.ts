import { RecommendationPayload } from "../types/recommendation.types";


const BASE_URL = "https://www.wowpetspalace.com/test";

export const recommendationService = {
  async getRecommendations(payload: RecommendationPayload) {
    const response = await fetch(
      `${BASE_URL}/recommendation/related`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }

    return response.json();
  },
};