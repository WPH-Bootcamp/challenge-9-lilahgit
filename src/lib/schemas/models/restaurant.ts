import { z } from "zod"

export const RestaurantSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  star: z.number().optional(),
  place: z.string().optional(),
  lat: z.number().optional(),
  long: z.number().optional(),
  logo: z.string().optional(),
  images: z.array(z.string()).optional(),
})

export const RestaurantListItemSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  star: z.number().optional(),
  place: z.string().optional(),
  logo: z.string().optional(),
  images: z.array(z.string()).optional(),
  category: z.string().nullable().optional(),
  reviewCount: z.number().optional(),
  menuCount: z.number().optional(),
  priceRange: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
  distance: z.number().optional(),
})

export const RestaurantListSchema = z.object({
  restaurants: z.array(RestaurantListItemSchema).optional(),
  pagination: z
    .object({
      page: z.number().optional(),
      limit: z.number().optional(),
      total: z.number().optional(),
      totalPages: z.number().optional(),
    })
    .optional(),
  searchQuery: z.string().optional(),
})

export const RecommendedRestaurantSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  star: z.number().optional(),
  place: z.string().optional(),
  lat: z.number().optional(),
  long: z.number().optional(),
  logo: z.string().optional(),
  images: z.array(z.string()).optional(),
  category: z.string().nullable().optional(),
  reviewCount: z.number().optional(),
  sampleMenus: z
    .array(
      z.object({
        id: z.number().optional(),
        foodName: z.string().optional(),
        price: z.number().optional(),
        type: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .optional(),
  isFrequentlyOrdered: z.boolean().optional(),
  distance: z.number().optional(),
})

export const RecommendedResponseSchema = z.object({
  recommendations: z.array(RecommendedRestaurantSchema).optional(),
  message: z.string().optional(),
})

export const MenuItemSchema = z.object({
  id: z.number().optional(),
  foodName: z.string().optional(),
  price: z.number().optional(),
  type: z.string().optional(),
  image: z.string().optional(),
})

export const ReviewItemSchema = z.object({
  id: z.number().optional(),
  star: z.number().optional(),
  comment: z.string().optional(),
  createdAt: z.string().optional(),
  user: z
    .object({
      id: z.number().optional(),
      name: z.string().optional(),
      avatar: z.string().optional(),
    })
    .optional(),
})

export const RestaurantDetailSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  star: z.number().optional(),
  averageRating: z.number().optional(),
  place: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number().optional(),
      long: z.number().optional(),
    })
    .optional(),
  distance: z.number().optional(),
  logo: z.string().optional(),
  images: z.array(z.string()).optional(),
  category: z.string().nullable().optional(),
  totalMenus: z.number().optional(),
  totalReviews: z.number().optional(),
  menus: z.array(MenuItemSchema).optional(),
  reviews: z.array(ReviewItemSchema).optional(),
})
