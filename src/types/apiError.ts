export type ApiError = {
  status: number
  message: string
  fieldErrors?: Record<string, string>
  rawErrors?: unknown
  retriable: boolean
}
