import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import type { ApiEnvelope } from "@/lib/envelope"
import { toArray, unwrap } from "@/lib/envelope"

type RecommendedItem = {
  id: number | string
  name: string
  imageUrl?: string
  rating?: number
  place?: string
  distanceKm?: number
}

const mapRecommendedItem = (
  item: Record<string, unknown>,
  index: number
): RecommendedItem => {
  const ratingValue = item.rating ?? item.star
  const parsedRating =
    typeof ratingValue === "number"
      ? ratingValue
      : ratingValue !== undefined
        ? Number(ratingValue)
        : undefined

  return {
    id:
      (item.id as number | string | undefined) ??
      (item.resto_id as number | string | undefined) ??
      (item.uuid as number | string | undefined) ??
      index,
    name: (item.name as string | undefined) ?? (item.title as string | undefined) ?? "Untitled",
    imageUrl:
      (item.logo as string | undefined) ??
      (item.image_url as string | undefined) ??
      (item.imageUrl as string | undefined) ??
      (item.thumbnail as string | undefined) ??
      (item.photo as string | undefined),
    rating: Number.isNaN(parsedRating) ? undefined : parsedRating,
    place: (item.place as string | undefined) ?? (item.location as string | undefined),
    distanceKm:
      typeof item.distance === "number"
        ? item.distance
        : item.distance !== undefined
          ? Number(item.distance)
          : undefined,
  }
}

export const fetchRecommended = async (): Promise<RecommendedItem[]> => {
  const res = await api.get<ApiEnvelope<unknown>>("/resto/recommended")
  const data = unwrap(res.data)
  const items = toArray(data)
  if (!items) {
    if (import.meta.env.DEV) {
      console.log("Unexpected /resto/recommended shape:", res.data)
    }
    throw new Error("Unexpected API response for /resto/recommended")
  }
  return items.map((item, index) =>
    mapRecommendedItem(item as Record<string, unknown>, index)
  )
}

export const useRecommended = () =>
  useQuery({
    queryKey: ["resto", "recommended"],
    queryFn: fetchRecommended,
  })