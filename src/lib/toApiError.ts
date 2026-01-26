import type { ApiError } from "@/types/apiError"

export const toApiError = (error: unknown): ApiError | undefined => {
  if (!error || typeof error !== "object") {
    return undefined
  }

  const candidate = error as ApiError
  if (
    typeof candidate.status === "number" &&
    typeof candidate.message === "string" &&
    typeof candidate.retriable === "boolean"
  ) {
    return candidate
  }

  return undefined
}
