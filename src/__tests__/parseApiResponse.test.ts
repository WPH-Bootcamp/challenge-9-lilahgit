import { describe, expect, it } from "vitest"
import { z } from "zod"
import { parseApiResponse } from "@/lib/parseApiResponse"

describe("parseApiResponse", () => {
  it("parses success envelope with valid data", () => {
    const schema = z.object({ foo: z.string() })
    const res = {
      status: 200,
      data: { success: true, message: "ok", data: { foo: "bar" } },
    }
    const data = parseApiResponse(res as never, schema)
    expect(data.foo).toBe("bar")
  })

  it("throws on invalid data shape", () => {
    const schema = z.object({ foo: z.string() })
    const res = {
      status: 200,
      data: { success: true, message: "ok", data: { foo: 123 } },
    }
    expect(() => parseApiResponse(res as never, schema)).toThrow(
      "Unexpected API response"
    )
  })
})
