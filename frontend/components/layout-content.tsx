"use client"

import { Suspense } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "@/components/sidebar"
import { usePathname } from "next/navigation"

interface LayoutContentProps {
  children: React.ReactNode
}

export function LayoutContent({ children }: LayoutContentProps) {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  const isPublicPage = pathname === "/" || pathname.startsWith("/auth/callback")

  if (isPublicPage && !isAuthenticated) {
    return <div className="h-screen bg-background text-foreground">{children}</div>
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Suspense fallback={<div>Loading...</div>}>
        <Sidebar />
      </Suspense>
      <main className="flex-1 overflow-y-auto bg-background text-foreground">{children}</main>
    </div>
  )
}
