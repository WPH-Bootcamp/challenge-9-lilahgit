import { useQuery } from "@tanstack/react-query"
import {
  getBestSellerRestaurants,
  getNearbyRestaurants,
  getRecommendedRestaurants,
  getRestaurantDetail,
  getRestaurants,
  searchRestaurants,
} from "@/api/endpoints/restaurants"
import type { RestaurantFilters } from "@/api/endpoints/restaurants"

export const useRestaurantList = (filters: RestaurantFilters, search?: string) =>
  useQuery({
    queryKey: ["restaurants", "list", filters, search],
    queryFn: () =>
      search && search.trim()
        ? searchRestaurants(search.trim())
        : getRestaurants(filters),
  })

export const useRecommendedRestaurants = () =>
  useQuery({
    queryKey: ["restaurants", "recommended"],
    queryFn: getRecommendedRestaurants,
  })

export const useNearbyRestaurants = (range?: number, limit?: number) =>
  useQuery({
    queryKey: ["restaurants", "nearby", range, limit],
    queryFn: () => getNearbyRestaurants(range, limit),
  })

export const useBestSellerRestaurants = (page?: number, limit?: number) =>
  useQuery({
    queryKey: ["restaurants", "best-seller", page, limit],
    queryFn: () => getBestSellerRestaurants(page, limit),
  })

export const useRestaurantDetail = (id?: number) =>
  useQuery({
    queryKey: ["restaurants", "detail", id],
    queryFn: () => getRestaurantDetail(id ?? 0),
    enabled: Boolean(id),
  })
