import { z } from "zod"
import { UserSchema } from "./user"

export const AuthDataSchema = z.object({
  user: UserSchema.optional(),
  token: z.string().optional(),
})
