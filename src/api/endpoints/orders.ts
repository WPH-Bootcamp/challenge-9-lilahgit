import apiClient from "@/lib/apiClient"
import { parseApiResponse } from "@/lib/parseApiResponse"
import { normalizeApiError } from "@/lib/normalizeApiError"
import {
  CheckoutResponseSchema,
  OrdersResponseSchema,
} from "@/lib/schemas/models/order"
import type { z } from "zod"

export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>
export type OrdersResponse = z.infer<typeof OrdersResponseSchema>

export type CheckoutItem = {
  menuId: number
  quantity: number
}

export type CheckoutRestaurant = {
  restaurantId: number
  items: CheckoutItem[]
}

export type CheckoutPayload = {
  restaurants: CheckoutRestaurant[]
  deliveryAddress: string
  phone?: string
  paymentMethod?: string
  notes?: string
}

export const checkoutOrder = async (payload: CheckoutPayload) => {
  try {
    const res = await apiClient.post("/api/order/checkout", payload)
    return parseApiResponse<CheckoutResponse>(res, CheckoutResponseSchema)
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export const getMyOrders = async (status = "done", page = 1, limit = 10) => {
  try {
    const res = await apiClient.get("/api/order/my-order", {
      params: { status, page, limit },
    })
    return parseApiResponse<OrdersResponse>(res, OrdersResponseSchema)
  } catch (error) {
    throw normalizeApiError(error)
  }
}
