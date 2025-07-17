"use client"
import { Poppins } from "next/font/google"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { loginSchema, LoginSchema } from "../../schemas"

import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const SignInView = () => {
  const router = useRouter()

  const trpc = useTRPC()

  const queryClient = useQueryClient()
  const signIn = useMutation(trpc.auth.login.mutationOptions({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: async () => {
      toast.success("Signed in successfully")
      await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
      router.push("/")
    },
  }))

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'all',
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: LoginSchema) => {
    signIn.mutate(data)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 p-4 lg:p-16"
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/">
                <span className={cn("text-2xl font-bold", poppins.className)}>
                  Kiuu
                </span>
              </Link>
              <Button asChild variant="ghost" size="sm" className="text-base border-none underline">
                <Link prefetch href="/sign-up">
                    Sign up
                </Link>
              </Button>
            </div>

            <h1 className={cn("text-3xl font-bold", poppins.className)}>
              Welcome back!
            </h1>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
                name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <Button type="submit"
              size="lg"
              variant='elevated'
              className="bg-black text-white hover:bg-pink-400 hover:text-primary"
              disabled={signIn.isPending}
            >
              {signIn.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
      </div>
    </div>
  )
}
