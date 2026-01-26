import { useMemo, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useLogin, useRegister } from "@/hooks/useAuth"
import type { ApiError } from "@/types/apiError"
import FieldError from "@/components/form/FieldError"
import FormErrorSummary from "@/components/form/FormErrorSummary"
import { AuthInput, AuthPrimaryButton } from "@/components/form/AuthFormControls"

type AuthMode = "signin" | "signup"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
const toApiError = (error: unknown): ApiError | undefined => {
  if (!error || typeof error !== "object") return undefined
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

const AuthPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const initialMode = useMemo<AuthMode>(() => {
    if (location.pathname.includes("register")) return "signup"
    if (location.pathname.includes("login")) return "signin"
    return "signin"
  }, [location.pathname])

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    remember: false,
  })

  const updateField = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const mode = initialMode

  const registerMutation = useRegister()
  const loginMutation = useLogin()

  const serverEmailError = useMemo(() => {
    const apiError = toApiError(registerMutation.error)
    if (apiError?.status === 409) {
      return "This email is already registered. Please sign in instead."
    }
    return ""
  }, [registerMutation.error])

  const nameError = useMemo(() => {
    if (!submitted) return ""
    if (!form.name.trim()) return "Required: Please enter your name."
    if (form.name.trim().length < 2)
      return "Too short: Name must be at least 2 characters."
    return ""
  }, [submitted, form.name])

  const phoneError = useMemo(() => {
    if (!submitted) return ""
    if (!form.phone.trim()) return "Required: Please enter your phone number."
    if (!/^\d+$/.test(form.phone.trim()))
      return "Invalid format: Enter a valid phone number"
    return ""
  }, [submitted, form.phone])

  const emailError = useMemo(() => {
    if (!submitted) return ""
    if (!form.email.trim()) return "Required: Please enter your email address."
    if (!emailPattern.test(form.email.trim()))
      return "Invalid format: Enter a valid email (e.g., name@domain.com)."
    if (serverEmailError) return serverEmailError
    return ""
  }, [submitted, form.email, serverEmailError])

  const passwordError = useMemo(() => {
    if (!submitted) return ""
    if (!form.password)
      return "Required: Please enter a password."
    if (!passwordPattern.test(form.password))
      return "Too short: Password must be at least 8 characters. Use at least 1 uppercase letter, 1 number, and 1 symbol."
    return ""
  }, [submitted, form.password])

  const confirmError = useMemo(() => {
    if (mode !== "signup") return ""
    if (submitted && !form.confirmPassword)
      return "Re-enter your password to confirm"
    if (
      form.confirmPassword &&
      form.password &&
      form.confirmPassword !== form.password
    )
      return "Passwords do not match"
    return ""
  }, [mode, submitted, form.confirmPassword, form.password])


  const handleMode = (next: AuthMode) => {
    setSubmitted(false)
    navigate(next === "signin" ? "/login" : "/register")
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (mode === "signin") {
      if (emailError || passwordError) return
      loginMutation.mutate(
        { email: form.email.trim(), password: form.password },
        {
          onSuccess: (data) => {
            if (data?.token) {
              localStorage.setItem("auth_token", data.token)
            }
            if (data?.user) {
              localStorage.setItem("user", JSON.stringify(data.user))
            }
            navigate("/")
          },
        }
      )
    } else {
      if (nameError || phoneError || emailError || passwordError || confirmError)
        return
      registerMutation.mutate(
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        },
        {
          onSuccess: (data) => {
            if (data?.token) {
              localStorage.setItem("auth_token", data.token)
            }
            if (data?.user) {
              localStorage.setItem("user", JSON.stringify(data.user))
            }
            setSubmitted(false)
            navigate("/")
          },
        }
      )
    }
  }

  const showConfirmError = Boolean(confirmError)

  const registerFieldErrors = toApiError(registerMutation.error)?.fieldErrors
  const loginFieldErrors = toApiError(loginMutation.error)?.fieldErrors
  const activeErrors = mode === "signin" ? loginFieldErrors : registerFieldErrors
  const registerError = toApiError(registerMutation.error)
  const loginError = toApiError(loginMutation.error)
  const formErrorMessage =
    mode === "signin"
      ? loginError?.message
      : registerError?.status === 409
        ? "This email is already registered. Please sign in instead."
        : registerError?.message

  return (
    <div className="min-h-screen w-screen bg-neutral-50 text-neutral-900">
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-[1fr_1fr]">
        <div className="hidden h-full lg:block">
          <img
            src="/register-image.svg"
            alt="Burger background"
            className="h-screen w-full object-cover"
          />
        </div>
        <div className="relative flex items-center justify-center bg-white px-6 py-10 lg:h-screen lg:overflow-hidden lg:px-0 lg:py-0">
          <button
            type="button"
            className="absolute right-6 top-6 z-10 flex h-8 w-8 items-center justify-center text-neutral-950"
            onClick={() => navigate("/")}
            aria-label="Close auth"
          >
            <img src="/components/icons/x-close.png" alt="" className="h-4 w-4" />
          </button>
          <div className="w-full max-w-93.5 space-y-5 lg:h-auto lg:mx-auto">
            <div className="flex items-center gap-3">
              <img
                src="/Logo.svg"
                alt="Foody logo"
                className="logo-primary h-8 w-8 lg:h-10.5 lg:w-10.5"
              />
              <span className="text-display-md font-extrabold leading-10 text-neutral-950">
                Foody
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="text-display-sm font-extrabold leading-9.5 text-neutral-950">
                Welcome Back
              </h1>
              <p className="text-md font-medium leading-7.5 text-neutral-950">
                Good to see you again! Let&apos;s eat
              </p>
            </div>

            <div className="flex rounded-md bg-neutral-100 p-1 text-md">
              <button
                className={`flex-1 rounded-md py-2 transition ${
                  mode === "signin" ? "bg-white shadow-sm font-bold" : "text-neutral-500"
                }`}
                onClick={() => handleMode("signin")}
              >
                Sign in
              </button>
              <button
                className={`flex-1 rounded-md py-2 transition ${
                  mode === "signup" ? "bg-white shadow-sm font-bold" : "text-neutral-500"
                }`}
                onClick={() => handleMode("signup")}
              >
                Sign up
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <FormErrorSummary message={formErrorMessage} />
              {mode === "signup" && (
                <div className="space-y-2">
                  <AuthInput
                    placeholder="Name"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                  />
                  <FieldError message={activeErrors?.name ?? nameError} />
                </div>
              )}
              <div className="space-y-2">
                <AuthInput
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(event) => {
                    updateField("email", event.target.value)
                  }}
                />
                <FieldError message={activeErrors?.email ?? emailError} />
              </div>
              {mode === "signup" && (
                <div className="space-y-2">
                  <AuthInput
                    placeholder="Number Phone"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                  />
                  <FieldError message={activeErrors?.phone ?? phoneError} />
                </div>
              )}
              <div className="space-y-2">
                <div className="relative">
                  <AuthInput
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <FieldError message={activeErrors?.password ?? passwordError} />
              </div>
              {mode === "signup" && (
                <div className="space-y-2">
                  <div className="relative">
                    <AuthInput
                      placeholder="Confirm Password"
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(event) =>
                        updateField("confirmPassword", event.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                      onClick={() => setShowConfirm((prev) => !prev)}
                      aria-label="Toggle confirm password visibility"
                    >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  </div>
                  {showConfirmError && <FieldError message={confirmError} />}
                </div>
              )}
              {mode === "signin" && (
                <label className="flex items-center gap-2 text-md text-neutral-900">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(event) =>
                      updateField("remember", event.target.checked)
                    }
                    className="h-4 w-4 rounded border-neutral-300 accent-primary"
                  />
                  Remember Me
                </label>
              )}
              <AuthPrimaryButton
                type="submit"
              >
                {mode === "signin" ? "Login" : "Register"}
              </AuthPrimaryButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
