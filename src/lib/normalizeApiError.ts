import type { AxiosError } from "axios"
import { ErrorEnvelopeSchema } from "./schemas/envelope"
import type { ApiError } from "@/types/apiError"

const isRetriableStatus = (status?: number) =>
  status === 429 || status === 500 || status === 502 || status === 503

export const normalizeApiError = (error: unknown): ApiError => {
  const existing = error as ApiError
  if (
    existing &&
    typeof existing.status === "number" &&
    typeof existing.message === "string"
  ) {
    return existing
  }
  const axiosError = error as AxiosError
  const status = axiosError.response?.status ?? 0
  const data = axiosError.response?.data
  const envelope = ErrorEnvelopeSchema.safeParse(data)

  const fallbackMessage =
    status === 401
      ? "Unauthorized / session expired"
      : status === 403
        ? "You do not have permission to access this resource."
        : status === 404
          ? "Resource not found."
          : status === 429
            ? "Too many requests. Please try again."
            : status >= 500 || status === 0
              ? "Server error. Please try again."
              : "Request failed."

  const fieldErrors =
    status === 422 && envelope.success
      ? parseFieldErrors(envelope.data.errors)
      : undefined

  const forcedMessage =
    status === 401
      ? "Unauthorized / session expired"
      : status === 403
        ? "You do not have permission to access this resource."
        : status === 404
          ? "Resource not found."
          : status === 429
            ? "Too many requests. Please try again."
            : status >= 500 || status === 0
              ? "Server error. Please try again."
              : undefined

  return {
    status,
    message: forcedMessage ?? (envelope.success ? envelope.data.message : fallbackMessage),
    fieldErrors,
    rawErrors: envelope.success ? envelope.data.errors : data,
    retriable: isRetriableStatus(status) || status === 0,
  }
}

const parseFieldErrors = (errors: unknown): Record<string, string> | undefined => {
  if (!errors || typeof errors !== "object") return undefined
  const entries = Object.entries(errors as Record<string, unknown>)
  const fieldErrors: Record<string, string> = {}
  entries.forEach(([key, value]) => {
    if (Array.isArray(value)) {
      fieldErrors[key] = String(value[0])
    } else if (typeof value === "string") {
      fieldErrors[key] = value
    }
  })
  return Object.keys(fieldErrors).length ? fieldErrors : undefined
}
