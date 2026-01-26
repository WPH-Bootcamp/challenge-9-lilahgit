import { useMutation, useQuery } from "@tanstack/react-query"
import { checkoutOrder, getMyOrders } from "@/api/endpoints/orders"
import type { CheckoutPayload } from "@/api/endpoints/orders"

export const useCheckoutOrder = () =>
  useMutation({
    mutationFn: (payload: CheckoutPayload) => checkoutOrder(payload),
  })

export const useMyOrders = (status: string, page = 1, limit = 10) =>
  useQuery({
    queryKey: ["orders", status, page, limit],
    queryFn: () => getMyOrders(status, page, limit),
  })
