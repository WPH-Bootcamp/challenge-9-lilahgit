import type { AxiosResponse } from "axios"
import type { z } from "zod"
import { ErrorEnvelopeSchema, SuccessEnvelopeSchema } from "./schemas/envelope"
import { normalizeApiError } from "./normalizeApiError"
import type { ApiError } from "@/types/apiError"

export const parseApiResponse = <T>(
  res: AxiosResponse,
  dataSchema: z.ZodType<T>
): T => {
  if (res.status === 204) {
    return undefined as T
  }

  const success = SuccessEnvelopeSchema.safeParse(res.data)
  if (success.success) {
    const parsed = dataSchema.safeParse(success.data.data)
    if (!parsed.success) {
      const error: ApiError = {
        status: 500,
        message: "Unexpected API response",
        retriable: false,
      }
      throw error
    }
    return parsed.data
  }

  const error = ErrorEnvelopeSchema.safeParse(res.data)
  if (error.success) {
    throw normalizeApiError({
      response: { status: res.status, data: error.data },
    })
  }

  throw {
    status: res.status,
    message: "Unexpected API response",
    retriable: false,
  } as ApiError
}
