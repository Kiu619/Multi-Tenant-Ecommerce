import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ReactNode } from "react"

interface NavbarItem {
  href: string
  children: ReactNode
}

interface NavbarSidebarProps {
  items: NavbarItem[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const NavbarSidebar = ({ items, isOpen, onOpenChange }: NavbarSidebarProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-2xl font-semibold">
            Kiuu
          </SheetTitle>
          <SheetDescription className="sr-only">
            Hidden description for accessibility
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {items.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center w-full text-left p-4 hover:bg-black hover:text-white text-base font-medium"
              onClick={() => onOpenChange(false)} 
            >
              {item.children}
            </Link>
          ))}

          <div className="border-t">
            <Link href="/login" className="flex items-center w-full text-left p-4 hover:bg-black hover:text-white text-base font-medium"
              onClick={() => onOpenChange(false)}
            >
              Login
            </Link>
            <Link href="/start-selling" className="flex items-center w-full text-left p-4 hover:bg-black hover:text-white text-base font-medium"
              onClick={() => onOpenChange(false)}
            >
              Start selling
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
