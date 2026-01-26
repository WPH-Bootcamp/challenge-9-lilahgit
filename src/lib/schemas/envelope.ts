import { z } from "zod"

export const SuccessEnvelopeSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.unknown(),
})

export const ErrorEnvelopeSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.any().optional().nullable(),
})
