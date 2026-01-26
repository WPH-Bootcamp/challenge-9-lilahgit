export type ApiSuccess<T> = {
  success: true
  message: string
  data: T
}

export type ApiFail = {
  success: false
  message: string
  errors?: unknown
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFail

export const unwrap = <T>(payload: ApiEnvelope<T>): T => {
  if (!payload || payload.success !== true) {
    const message =
      payload && "message" in payload ? payload.message : "Request failed"
    const error = new Error(message)
    ;(error as Error & { errors?: unknown }).errors =
      payload && "errors" in payload ? payload.errors : undefined
    throw error
  }
  return payload.data
}

export const toArray = (data: unknown): unknown[] | null => {
  if (Array.isArray(data)) {
    return data
  }
  if (
    data &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items?: unknown[] }).items)
  ) {
    return (data as { items: unknown[] }).items
  }
  return null
}
