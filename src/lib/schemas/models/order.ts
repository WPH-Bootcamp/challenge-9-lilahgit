import { z } from "zod"

export const OrderRestaurantInfoSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  logo: z.string().optional(),
})

export const OrderItemSchema = z.object({
  menuId: z.number().optional(),
  menuName: z.string().optional(),
  price: z.number().optional(),
  image: z.string().nullable().optional(),
  quantity: z.number().optional(),
  itemTotal: z.number().optional(),
})

export const OrderRestaurantGroupSchema = z.object({
  restaurant: OrderRestaurantInfoSchema.optional(),
  items: z.array(OrderItemSchema).optional(),
  subtotal: z.number().optional(),
})

export const PricingSchema = z.object({
  subtotal: z.number().optional(),
  serviceFee: z.number().optional(),
  deliveryFee: z.number().optional(),
  totalPrice: z.number().optional(),
})

export const OrderSchema = z.object({
  id: z.number().optional(),
  transactionId: z.string().optional(),
  status: z
    .enum(["preparing", "on_the_way", "delivered", "done", "cancelled"])
    .optional(),
  paymentMethod: z.string().optional(),
  deliveryAddress: z.string().optional(),
  phone: z.string().optional(),
  pricing: PricingSchema.optional(),
  restaurants: z.array(OrderRestaurantGroupSchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const OrdersResponseSchema = z.object({
  orders: z.array(OrderSchema).optional(),
  pagination: z
    .object({
      page: z.number().optional(),
      limit: z.number().optional(),
      total: z.number().optional(),
      totalPages: z.number().optional(),
    })
    .optional(),
  filter: z
    .object({
      status: z.string().optional(),
    })
    .optional(),
})

export const CheckoutTransactionSchema = z.object({
  id: z.number().optional(),
  transactionId: z.string().optional(),
  paymentMethod: z.string().optional(),
  status: z.string().optional(),
  pricing: PricingSchema.optional(),
  restaurants: z.array(OrderRestaurantGroupSchema).optional(),
  createdAt: z.string().optional(),
})

export const CheckoutResponseSchema = z.object({
  transaction: CheckoutTransactionSchema.optional(),
})
