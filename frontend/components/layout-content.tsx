"use client"

import { Suspense, useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "@/components/sidebar"
import { usePathname } from "next/navigation"
import { Bell, Bot, Check, ChevronDown, Megaphone, MessageSquare, Palette, Pin, Settings, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn, extractKoreanName } from "@/lib/utils"

interface LayoutContentProps {
  children: React.ReactNode
}

export function LayoutContent({ children }: LayoutContentProps) {
  const { isAuthenticated, user } = useAuth()
  const pathname = usePathname()
  const isPublicPage = pathname === "/" || pathname.startsWith("/auth/callback")
  const [showThemePanel, setShowThemePanel] = useState(false)
  const [timestamp, setTimestamp] = useState("")

  useEffect(() => {
    const formatNow = () => {
      const now = new Date()
      setTimestamp(
        now
          .toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
          .replace(/\. /g, "-")
          .replace(".", ""),
      )
    }

    formatNow()
    const timer = window.setInterval(formatNow, 60_000)
    return () => window.clearInterval(timer)
  }, [])

  if (isPublicPage && !isAuthenticated) {
    return <div className="h-screen bg-background text-foreground">{children}</div>
  }

  const userLabel =
    extractKoreanName(user?.name) ||
    user?.email?.split("@")[0] ||
    "상담사"

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f4f7fb] text-foreground">
      <header className="flex h-12 shrink-0 items-center justify-between bg-[#252c35] px-4 text-white shadow-sm">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-1.5 text-sm font-semibold">
            <Bot className="h-4 w-4 text-[#7fc7ff]" />
            AI 상담지원 Agent
          </div>
          <div className="hidden items-center gap-2 text-xs font-semibold md:flex">
            <Megaphone className="h-4 w-4 text-[#ffb13b]" />
            <span className="text-[#ffcf70]">긴급공지</span>
            <span className="text-white/85">상담 업무 기준 업데이트 2건</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="hidden text-white/85 lg:inline">
            {userLabel} · {timestamp || "시간 동기화 중"}
          </span>
          <div className="hidden items-center gap-1 lg:flex">
            {[
              { label: "메모", icon: Pin },
              { label: "챗봇", icon: MessageSquare },
              { label: "알림", icon: Bell },
              { label: "테마", icon: Palette, action: () => setShowThemePanel(true) },
              { label: "내메뉴", icon: Star },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="inline-flex items-center gap-1 rounded border border-white/15 bg-black/25 px-2 py-1 text-white/90 transition hover:bg-white/15"
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setShowThemePanel(true)}
            className="h-8 rounded-full bg-white/10 px-3 text-white hover:bg-white/20 hover:text-white lg:hidden"
          >
            <Palette className="mr-1.5 h-4 w-4" />
            테마
          </Button>
        </div>
      </header>

      <div className="flex h-8 shrink-0 items-center gap-1 border-b border-[#c4cfdd] bg-[#d9e2ee] px-3 text-xs text-[#24364a]">
        {["HOME", "상담 관리", "상담 후처리", "AI 운영 관리"].map((tab, index) => (
          <div
            key={tab}
            className={cn(
              "flex h-8 items-center gap-2 border-x border-[#c4cfdd] bg-white px-4 font-medium",
              index === 0 ? "text-[#005bac]" : "text-[#24364a]",
            )}
          >
            {tab}
            {index > 0 ? <X className="h-3 w-3 text-muted-foreground" /> : null}
          </div>
        ))}
      </div>

      <div className="flex min-h-0 flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <Sidebar />
        </Suspense>
        <main className="flex-1 overflow-y-auto bg-[#f7f9fc] text-foreground">{children}</main>
      </div>

      {showThemePanel ? (
        <div className="fixed inset-y-0 right-0 z-50 w-[280px] border-l border-[#c4cfdd] bg-white shadow-2xl">
          <div className="flex h-12 items-center justify-between border-b bg-[#f7f9fc] px-4">
            <div className="flex items-center gap-2 font-semibold text-[#10233f]">
              <Settings className="h-4 w-4 text-primary" />
              테마 설정
            </div>
            <button
              type="button"
              onClick={() => setShowThemePanel(false)}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="테마 설정 닫기"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-6 p-4 text-sm">
            <div>
              <p className="mb-3 font-semibold">테마 컬러</p>
              <div className="grid grid-cols-8 gap-2">
                {["#005bac", "#0b2f5b", "#006fba", "#00a3e0", "#26b7ff", "#ff8a00", "#d64545", "#20242a"].map(
                  (color, index) => (
                    <div
                      key={color}
                      className="flex h-7 w-7 items-center justify-center rounded border"
                      style={{ backgroundColor: color }}
                    >
                      {index === 0 ? <Check className="h-4 w-4 text-white" /> : null}
                    </div>
                  ),
                )}
              </div>
            </div>
            <div>
              <p className="mb-3 font-semibold">포인트 컬러</p>
              <div className="grid grid-cols-8 gap-2">
                {["#009de0", "#1d74d8", "#1a91c9", "#00a3e0", "#ff9f1a", "#ef6f6c", "#b248d4", "#6b7280"].map(
                  (color, index) => (
                    <div
                      key={color}
                      className="flex h-7 w-7 items-center justify-center rounded border"
                      style={{ backgroundColor: color }}
                    >
                      {index === 3 ? <Check className="h-4 w-4 text-white" /> : null}
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="rounded-lg border bg-[#f7f9fc] p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold">폰트 사이즈</span>
                <div className="flex items-center rounded border bg-white">
                  <button className="px-2 py-1 text-muted-foreground" type="button">-</button>
                  <span className="border-x px-3 py-1">13</span>
                  <button className="px-2 py-1 text-muted-foreground" type="button">+</button>
                </div>
              </div>
              <ThemeToggle showLabel className="border bg-white hover:bg-[#edf6ff]" />
            </div>
            <Button
              type="button"
              onClick={() => setShowThemePanel(false)}
              className="w-full rounded-full bg-[#0b4f91] text-white hover:bg-[#083b70]"
            >
              테마 적용
              <ChevronDown className="ml-2 h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
