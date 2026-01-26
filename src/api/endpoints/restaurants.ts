import apiClient from "@/lib/apiClient"
import { parseApiResponse } from "@/lib/parseApiResponse"
import { normalizeApiError } from "@/lib/normalizeApiError"
import {
  RecommendedResponseSchema,
  RestaurantDetailSchema,
  RestaurantListSchema,
} from "@/lib/schemas/models/restaurant"
import type { z } from "zod"

export type RestaurantList = z.infer<typeof RestaurantListSchema>
export type RecommendedResponse = z.infer<typeof RecommendedResponseSchema>
export type RestaurantDetail = z.infer<typeof RestaurantDetailSchema>

export type RestaurantFilters = {
  location?: string
  range?: number
  priceMin?: number
  priceMax?: number
  rating?: number
  category?: string
  page?: number
  limit?: number
}

export const getRestaurants = async (params: RestaurantFilters) => {
  try {
    const res = await apiClient.get("/api/resto", { params })
    return parseApiResponse<RestaurantList>(res, RestaurantListSchema)
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export const getRecommendedRestaurants = async () => {
  try {
    const res = await apiClient.get("/api/resto/recommended")
    return parseApiResponse<RecommendedResponse>(res, RecommendedResponseSchema)
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export const getNearbyRestaurants = async (range?: number, limit?: number) => {
  try {
    const res = await apiClient.get("/api/resto/nearby", {
      params: { range, limit },
    })
    return parseApiResponse<RestaurantList>(res, RestaurantListSchema)
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export const getBestSellerRestaurants = async (page?: number, limit?: number) => {
  try {
    const res = await apiClient.get("/api/resto/best-seller", {
      params: { page, limit },
    })
    return parseApiResponse<RestaurantList>(res, RestaurantListSchema)
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export const searchRestaurants = async (q: string, page = 1, limit = 20) => {
  try {
    const res = await apiClient.get("/api/resto/search", {
      params: { q, page, limit },
    })
    return parseApiResponse<RestaurantList>(res, RestaurantListSchema)
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export const getRestaurantDetail = async (id: number) => {
  try {
    const res = await apiClient.get(`/api/resto/${id}`, {
      params: { limitMenu: 50, limitReview: 6 },
    })
    return parseApiResponse<RestaurantDetail>(res, RestaurantDetailSchema)
  } catch (error) {
    throw normalizeApiError(error)
  }
}
