import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"

export const useSession = () => {
  const trpc = useTRPC()
  return useQuery(trpc.auth.session.queryOptions())
}
