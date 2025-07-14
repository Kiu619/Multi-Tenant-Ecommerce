import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

interface Props {
  children: ReactNode;
}

export default function HomeLayout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-[#F4F4F0]">
        {children}
      </main>
      <Footer />
    </div>
  )
}
