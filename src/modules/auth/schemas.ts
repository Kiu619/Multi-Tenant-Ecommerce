import { z } from "zod"

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    username: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Username can only contain lowercase letters, numbers, and hyphens")
      .refine((username) => !username.includes(" "), "Username cannot contain spaces")
      .refine((username) => !username.includes("."), "Username cannot contain dots")
      .refine((username) => !username.includes("_"), "Username cannot contain underscores")
      .refine((username) => !username.includes("-"), "Username cannot contain hyphens")
      .refine((username) => !username.includes("!"), "Username cannot contain exclamation marks")
      .refine((username) => !username.includes("@"), "Username cannot contain at signs")
      .refine((username) => !username.includes("#"), "Username cannot contain hashes")
      .refine((username) => !username.includes("$"), "Username cannot contain dollar signs")
      .refine((username) => !username.includes("%"), "Username cannot contain percent signs")
      .transform((username) => username.toLowerCase()),
})

export type RegisterSchema = z.infer<typeof registerSchema>

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export type LoginSchema = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
})
