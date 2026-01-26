import { QueryClient } from "@tanstack/react-query"
import { toApiError } from "@/lib/toApiError"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const apiError = toApiError(error)
        if (!apiError?.retriable) return false
        return failureCount < 3
      },
      retryDelay: (attempt, error) => {
        const apiError = toApiError(error)
        if (apiError?.status === 429) {
          return Math.min(1000 * 2 ** attempt, 10000)
        }
        return Math.min(500 * 2 ** attempt, 8000)
      },
    },
  },
})
