"use client"
import { Poppins } from "next/font/google"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { registerSchema, RegisterSchema } from "../../schemas"

import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const SignUpView = () => {
  const router = useRouter()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const register = useMutation(trpc.auth.register.mutationOptions({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: async () => {
      toast.success("Account created successfully")
      await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
      router.push("/")
    },
  }))

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: 'all',
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  })

  const onSubmit = (data: RegisterSchema) => {
    register.mutate(data)
  }

  const username = form.watch("username")
  const usernameError = form.formState.errors.username

  const showPreview = username && !usernameError

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
                <Link prefetch href="/sign-in">
                    Sign in
                </Link>
              </Button>
            </div>

            <h1 className={cn("text-3xl font-bold", poppins.className)}>
              Join over 2003 creators and start selling your products
            </h1>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Username</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription
                    className={cn("hidden", showPreview && "block")}
                  >
                    Your store will be available at <span className="font-bold">{username}.kiuu.com</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              disabled={register.isPending}
            >
              {register.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create account"
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
