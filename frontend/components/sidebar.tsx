"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn, extractKoreanName } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BarChart3,
  User,
  MessageSquare,
  LogOut,
  ChevronUp,
  Shield,
  Home,
  Languages,
  FileText,
  Headset,
  Search,
  MessageCircleMore,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { assistantHistoryPresets } from "@/lib/assistant-demo-history"
import { PortalLogo } from "@/components/portal-logo"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    "민원상담 어시스턴트": true,
  })
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { logout, user } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showUserMenu])

  const agent = searchParams?.get("agent")
  const preset = searchParams?.get("preset")
  const tab = searchParams?.get("tab")
  const feature = searchParams?.get("feature")

  useEffect(() => {
    if (pathname === "/insight-chat" && agent === "assistant" && feature === "counseling" && preset) {
      setExpandedMenus((prev) => ({ ...prev, "민원상담 어시스턴트": true }))
    }
  }, [pathname, agent, feature, preset])

  const serviceSections = [
    {
      title: "플랫폼 홈",
      items: [
        {
          name: "GenPortal 홈",
          href: "/",
          icon: Home,
          isActive: pathname === "/" && !searchParams?.get("task"),
        },
      ],
    },
    {
      title: "핵심 에이전트",
      items: [
        {
          name: "민원상담 어시스턴트",
          href: "/insight-chat?agent=assistant&feature=counseling",
          icon: Headset,
          isActive: pathname === "/insight-chat" && (!agent || agent === "assistant") && (!feature || feature === "counseling"),
          children: assistantHistoryPresets.map((item) => ({
            name: item.title,
            href: `/insight-chat?agent=assistant&feature=counseling&preset=${item.id}`,
            isActive:
              pathname === "/insight-chat" &&
              (!agent || agent === "assistant") &&
              (!feature || feature === "counseling") &&
              preset === item.id,
          })),
        },
        {
          name: "상담지식 에이전트",
          href: "/counseling-knowledge",
          icon: Shield,
          isActive: pathname === "/counseling-knowledge",
        },
        {
          name: "표준 상담 스크립트 개발",
          href: "/documentation?feature=script-studio",
          icon: FileText,
          isActive:
            pathname === "/documentation" &&
            searchParams?.get("feature") === "script-studio",
        },
      ],
    },
    {
      title: "데이터/지식 활용",
      items: [
        {
          name: "데이터길잡이",
          href: "/data-guide",
          icon: BarChart3,
          isActive: pathname === "/data-guide",
        },
        {
          name: "사내규정 검색",
          href: "/insight-chat?agent=compliance&feature=policy-search",
          icon: Shield,
          isActive: pathname === "/insight-chat" && agent === "compliance" && feature === "policy-search",
        },
        {
          name: "채권양수도 추론",
          href: "/market-sensing?tab=dashboard&feature=debt-transfer",
          icon: BarChart3,
          isActive: pathname === "/market-sensing" && tab === "dashboard" && feature === "debt-transfer",
        },
        {
          name: "문서분석 지원",
          href: "/translation",
          icon: Search,
          isActive: pathname === "/translation" || (pathname === "/" && searchParams?.get("task") === "translation"),
        },
      ],
    },
    {
      title: "업무 지원",
      items: [
        {
          name: "문서작성 지원",
          href: "/documentation?feature=document-writing",
          icon: FileText,
          isActive:
            pathname === "/documentation" &&
            (!searchParams?.get("feature") || searchParams?.get("feature") === "document-writing"),
        },
        {
          name: "민원처리 지원",
          href: "/formatting",
          icon: MessageCircleMore,
          isActive:
            pathname === "/formatting" ||
            (pathname === "/" && searchParams?.get("task") === "formatting"),
        },
        {
          name: "업무담당자 검색",
          href: "/insight-chat?agent=assistant&feature=staff-search",
          icon: MessageSquare,
          isActive: pathname === "/insight-chat" && (!agent || agent === "assistant") && feature === "staff-search",
        },
        {
          name: "협약기관 검색",
          href: "/partner-search",
          icon: Search,
          isActive: pathname === "/partner-search",
        },
      ],
    },
    {
      title: "운영 관리",
      items: [
        {
          name: "품질 모니터링",
          href: "/admin?feature=quality-monitoring",
          icon: Shield,
          isActive: pathname === "/admin" && (!feature || feature === "quality-monitoring"),
        },
        {
          name: "프롬프트 라이브러리",
          href: "/prompt-hub",
          icon: FileText,
          isActive: pathname === "/prompt-hub",
        },
        {
          name: "자원 관리",
          href: "/admin?feature=resource-management",
          icon: Shield,
          isActive: pathname === "/admin" && feature === "resource-management",
        },
      ],
    },
  ]

  return (
    <div
      className={cn(
        "relative flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        className,
      )}
      style={{
        width: isCollapsed ? "4rem" : "13rem",
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className="flex h-16 items-center px-3">
        <Link href="/" className="flex w-full items-center justify-start pl-1">
          {isCollapsed ? (
            <PortalLogo compact />
          ) : (
            <PortalLogo />
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {serviceSections.map((section, index) => (
          <div key={section.title}>
            {!isCollapsed && (
              <div className="px-3 pb-2 pt-4 text-[11px] font-medium text-sidebar-foreground/60">
                {section.title}
              </div>
            )}
            <nav className="space-y-1 px-2">
              {section.items.map((item) => (
                <div key={item.name}>
                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-lg pr-1 transition-colors",
                      item.isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        item.isActive ? "font-bold" : "",
                      )}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                    {!isCollapsed && item.children?.length ? (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedMenus((prev) => ({
                            ...prev,
                            [item.name]: !prev[item.name],
                          }))
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-accent/80"
                        aria-label={`${item.name} 하위 메뉴 ${expandedMenus[item.name] ? "접기" : "펼치기"}`}
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedMenus[item.name] ? "rotate-180" : "",
                          )}
                        />
                      </button>
                    ) : null}
                  </div>
                  {!isCollapsed && item.children?.length && expandedMenus[item.name] ? (
                    <div className="mt-1 space-y-1 pl-9">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            "block rounded-md px-3 py-2 text-xs leading-5 transition-colors",
                            child.isActive
                              ? "bg-sidebar-accent/80 font-medium text-sidebar-accent-foreground"
                              : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
            {index < serviceSections.length - 1 && <div className="mx-4 my-4 border-t border-sidebar-border" />}
          </div>
        ))}
      </div>

      <div ref={menuRef} className="border-t border-sidebar-border relative">
        {showUserMenu && !isCollapsed && (
          <div className="absolute bottom-full left-0 right-0 bg-background border border-sidebar-border rounded-t-lg shadow-lg p-2 mb-1">
            <ThemeToggle
              showLabel
              className="w-full justify-start hover:bg-accent text-foreground mb-1"
            />
            <div className="my-1 border-t border-border" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout()
                setShowUserMenu(false)
              }}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </div>
        )}

        <div className="p-4">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 w-full text-left hover:bg-muted rounded-lg p-2 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4" />
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {extractKoreanName(user?.name || user?.user_metadata?.full_name) ||
                      user?.email?.split("@")[0] ||
                      "사용자"}
                  </p>
                </div>
                <ChevronUp className={cn("h-4 w-4 transition-transform", showUserMenu ? "rotate-180" : "")} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
