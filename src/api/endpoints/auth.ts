import apiClient from "@/lib/apiClient"
import { parseApiResponse } from "@/lib/parseApiResponse"
import { normalizeApiError } from "@/lib/normalizeApiError"
import { AuthDataSchema } from "@/lib/schemas/models/auth"
import type { z } from "zod"

export type AuthData = z.infer<typeof AuthDataSchema>

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  phone: string
  password: string
}

export const loginUser = async (payload: LoginPayload) => {
  try {
    const res = await apiClient.post("/api/auth/login", payload)
    return parseApiResponse<AuthData>(res, AuthDataSchema)
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export const registerUser = async (payload: RegisterPayload) => {
  try {
    const res = await apiClient.post("/api/auth/register", payload)
    return parseApiResponse<AuthData>(res, AuthDataSchema)
  } catch (error) {
    throw normalizeApiError(error)
  }
}
