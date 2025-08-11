import type { User } from "@/payload-types"
import { ClientUser } from "payload"

export const isSuperAdmin = (user: User | ClientUser | null) => {
  return Boolean(user?.roles?.includes('super-admin'))
}

export const isAdmin = (user: User | ClientUser) => {
  return Boolean(user?.roles?.includes('admin'))
}

export const isUser = (user: User | ClientUser) => {
  return Boolean(user?.roles?.includes('user'))
}