import { describe, expect, it } from "vitest"
import { normalizeApiError } from "@/lib/normalizeApiError"

describe("normalizeApiError", () => {
  it("maps 422 field errors with array values", () => {
    const error = normalizeApiError({
      response: {
        status: 422,
        data: {
          success: false,
          message: "Validation error",
          errors: { email: ["Invalid email"] },
        },
      },
    })
    expect(error.fieldErrors?.email).toBe("Invalid email")
  })

  it("maps 422 field errors with string values", () => {
    const error = normalizeApiError({
      response: {
        status: 422,
        data: {
          success: false,
          message: "Validation error",
          errors: { email: "Invalid email" },
        },
      },
    })
    expect(error.fieldErrors?.email).toBe("Invalid email")
  })

  it("handles 401", () => {
    const error = normalizeApiError({
      response: { status: 401, data: {} },
    })
    expect(error.message).toBe("Unauthorized / session expired")
  })

  it("handles 429 as retriable", () => {
    const error = normalizeApiError({
      response: { status: 429, data: {} },
    })
    expect(error.retriable).toBe(true)
  })

  it("handles 500 as retriable", () => {
    const error = normalizeApiError({
      response: { status: 500, data: {} },
    })
    expect(error.retriable).toBe(true)
  })

  it("handles network errors as retriable", () => {
    const error = normalizeApiError({})
    expect(error.retriable).toBe(true)
  })
})
