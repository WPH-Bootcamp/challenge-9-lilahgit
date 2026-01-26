import axios from "axios"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://restaurant-be-400174736012.asia-southeast2.run.app"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    localStorage.setItem("auth_token", token)
  } else {
    delete api.defaults.headers.common.Authorization
    localStorage.removeItem("auth_token")
  }
}

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("auth_token") || localStorage.getItem("authToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      window.dispatchEvent(new Event("storage"))

      const currentPath = window.location.pathname
      const protectedPaths = ["/profile", "/cart", "/checkout", "/orders"]
      const isProtectedPage = protectedPaths.some((path) =>
        currentPath.startsWith(path)
      )

      if (
        isProtectedPage &&
        !currentPath.includes("/login") &&
        !currentPath.includes("/register")
      ) {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

export interface RegisterRequest {
  name: string
  email: string
  phone: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: {
      id: number
      name: string
      email: string
      phone: string
      avatar?: string
      latitude?: number
      longitude?: number
      createdAt?: string
    }
  }
}

export interface ErrorResponse {
  message: string
  errors?: Record<string, string[]>
}

export default api