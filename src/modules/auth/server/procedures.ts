
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { TRPCError } from "@trpc/server"
import { headers as getHeaders } from "next/headers"
import { z } from "zod"
import { generateAuthCookie } from "../utils"

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders()
    const session = await ctx.payload.auth({
      headers
    })
    return session
  }),

  register: baseProcedure.input(z.object({
    email: z.string().email(),
    password: z.string().min(3),
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
  })).mutation(async ({ input, ctx }) => {
    const { email, password, username } = input
    console.log(email, password, username)
    const existingUser = await ctx.payload.find({
      collection: "users",
      where: {
        username: {
          equals: username,
        },
      },
      limit: 1,
    })

    console.log(existingUser)
    if (existingUser.totalDocs > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Username already taken",
      })
    }
    await ctx.payload.create({
      collection: "users",
      data: {
        email,
        password,
        username,
      },
    })
    const user = await ctx.payload.login({
      collection: "users",
      data: {
        email,
        password,
      }
    })

    if (!user.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      })
    }
    await generateAuthCookie({
      prefix: ctx.payload.config.cookiePrefix,
      value: user.token,
    })
  }),

  forgotPassword: baseProcedure.input(z.object({
    email: z.string().email(),
  })).mutation(async ({ ctx, input }) => {
    const { email } = input
    await ctx.payload.forgotPassword({
      collection: "users",
      data: {
        email,
      },
    })
  }),

  login: baseProcedure.input(z.object({
    email: z.string().email(),
    password: z.string(),
  })).mutation(async ({ ctx, input }) => {
    const { email, password } = input
    const user = await ctx.payload.login({
      collection: "users",
      data: {
        email,
        password,
      }
    })
    if (!user.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      })
    }

    await generateAuthCookie({
      prefix: ctx.payload.config.cookiePrefix,
      value: user.token,
    })
    return user
  })  
})
