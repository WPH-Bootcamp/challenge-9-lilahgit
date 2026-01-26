import { z } from "zod"

export const UserSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    avatar: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    createdAt: z.string().optional(),
  })
  .partial()
