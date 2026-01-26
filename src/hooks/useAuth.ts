import { useMutation } from "@tanstack/react-query"
import { loginUser, registerUser } from "@/api/endpoints/auth"
import type { LoginPayload, RegisterPayload } from "@/api/endpoints/auth"
import type { ApiError } from "@/types/apiError"

export const useLogin = () =>
  useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem("auth_token", data.token)
      }
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }
    },
  })

export const useRegister = () =>
  useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem("auth_token", data.token)
      }
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }
    },
  })

export const getErrorMessage = (error: unknown) =>
  (error as ApiError | undefined)?.message ?? "Request failed."
