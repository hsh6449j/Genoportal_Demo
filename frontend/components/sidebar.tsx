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
  GitFork,
  Headset,
  Search,
  MessageCircleMore,
  Briefcase,
  Settings2,
  Bot,
  Cpu,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { assistantHistoryPresets } from "@/lib/assistant-demo-history"
import { complianceHistoryPresets } from "@/lib/compliance-demo-history"
import { generalQaHistoryPresets } from "@/lib/general-qa-demo-history"
import { staffAssignmentHistoryPresets } from "@/lib/staff-assignment-demo"
import { documentWritingHistoryPresets } from "@/lib/document-writing-demo-history"
import { PortalLogo } from "@/components/portal-logo"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    "고객상담 어시스턴트": true,
    "단순 질의응답 챗봇": true,
    "사내규정 검색": true,
    "업무담당자 배정": true,
    "문서작성 지원 에이전트": true,
    "심사이력 추론 에이전트": true,
  })
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { logout, user } = useAuth()
  const userFullName = (user as { user_metadata?: { full_name?: string } } | null)?.user_metadata?.full_name
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
  const tool = searchParams?.get("tool")

  useEffect(() => {
    if (pathname === "/insight-chat" && agent === "assistant" && feature === "counseling" && preset) {
      setExpandedMenus((prev) => ({ ...prev, "고객상담 어시스턴트": true }))
    }
    if (pathname === "/insight-chat" && agent === "assistant" && feature === "general-qa" && preset) {
      setExpandedMenus((prev) => ({ ...prev, "단순 질의응답 챗봇": true }))
    }
    if (pathname === "/insight-chat" && agent === "compliance" && feature === "policy-search" && preset) {
      setExpandedMenus((prev) => ({ ...prev, "사내규정 검색": true }))
    }
    if (pathname === "/staff-assignment" && preset) {
      setExpandedMenus((prev) => ({ ...prev, "업무담당자 배정": true }))
    }
    if (pathname === "/insight-chat" && agent === "document-writer" && preset) {
      setExpandedMenus((prev) => ({ ...prev, "문서작성 지원 에이전트": true }))
    }
    if (pathname === "/insight-chat" && agent === "debt-transfer") {
      setExpandedMenus((prev) => ({ ...prev, "심사이력 추론 에이전트": true }))
    }
  }, [pathname, agent, feature, preset])

  const serviceSections = [
    {
      title: "플랫폼 홈",
      titleIcon: Home,
      items: [
        {
          name: "AI Portal 홈",
          href: "/",
          icon: Home,
          isActive: pathname === "/" && !searchParams?.get("task"),
        },
      ],
    },
    {
      title: "민원 상담 중 활용",
      titleIcon: Headset,
      items: [
        {
          name: "고객상담 어시스턴트",
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
          name: "단순 질의응답 챗봇",
          href: "/insight-chat?agent=assistant&feature=general-qa",
          icon: Bot,
          isActive: pathname === "/insight-chat" && agent === "assistant" && feature === "general-qa",
          children: generalQaHistoryPresets.map((item) => ({
            name: item.title,
            href: `/insight-chat?agent=assistant&feature=general-qa&preset=${item.id}`,
            isActive:
              pathname === "/insight-chat" &&
              agent === "assistant" &&
              feature === "general-qa" &&
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
          name: "사내규정 검색",
          href: "/insight-chat?agent=compliance&feature=policy-search",
          icon: Shield,
          isActive: pathname === "/insight-chat" && agent === "compliance" && feature === "policy-search",
          children: complianceHistoryPresets.map((item) => ({
            name: item.title,
            href: `/insight-chat?agent=compliance&feature=policy-search&preset=${item.id}`,
            isActive:
              pathname === "/insight-chat" &&
              agent === "compliance" &&
              feature === "policy-search" &&
              preset === item.id,
          })),
        },
        {
          name: "문서분석 지원",
          href: "/translation",
          icon: Search,
          isActive: pathname === "/translation" || (pathname === "/" && searchParams?.get("task") === "translation"),
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
      title: "민원 상담 후 활용",
      titleIcon: Briefcase,
      items: [
        {
          name: "고객민원 처리 지원",
          href: "/formatting",
          icon: MessageCircleMore,
          isActive:
            pathname === "/formatting" ||
            (pathname === "/" && searchParams?.get("task") === "formatting"),
        },
        {
          name: "업무담당자 배정",
          href: "/staff-assignment?view=new",
          icon: MessageSquare,
          isActive: pathname === "/staff-assignment" && !preset,
          children: staffAssignmentHistoryPresets.map((item) => ({
            name: item.title,
            href: `/staff-assignment?preset=${item.id}`,
            isActive: pathname === "/staff-assignment" && preset === item.id,
          })),
        },
        {
          name: "제휴기관 검색",
          href: "/partner-search",
          icon: Search,
          isActive: pathname === "/partner-search",
        },
        {
          name: "데이터길잡이",
          href: "/data-guide",
          icon: BarChart3,
          isActive: pathname === "/data-guide",
        },
        {
          name: "심사이력 추론 에이전트",
          href: "/debt-transfer?tab=knowledge",
          icon: GitFork,
          isActive: pathname === "/debt-transfer" || (pathname === "/insight-chat" && agent === "debt-transfer"),
          children: [
            { name: "이력 데이터 관리", href: "/debt-transfer?tab=knowledge", isActive: pathname === "/debt-transfer" },
            { name: "양수도 추적", href: "/insight-chat?agent=debt-transfer", isActive: pathname === "/insight-chat" && agent === "debt-transfer" },
          ],
        },
        {
          name: "문서작성 지원 에이전트",
          href: "/insight-chat?agent=document-writer&tool=polish",
          icon: FileText,
          isActive: pathname === "/insight-chat" && agent === "document-writer",
          children: [
            { name: "글다듬이", href: "/insight-chat?agent=document-writer&tool=polish", isActive: pathname === "/insight-chat" && agent === "document-writer" && tool === "polish" },
            { name: "번역", href: "/insight-chat?agent=document-writer&tool=translation", isActive: pathname === "/insight-chat" && agent === "document-writer" && tool === "translation" },
            { name: "FAQ 자동생성기", href: "/insight-chat?agent=document-writer&tool=faq", isActive: pathname === "/insight-chat" && agent === "document-writer" && tool === "faq" },
          ],
        },
      ],
    },
    {
      title: "운영 관리",
      titleIcon: Settings2,
      items: [
        {
          name: "품질 모니터링",
          href: "/admin?feature=quality-monitoring",
          icon: Activity,
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
          icon: Cpu,
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
              <div className="flex items-center gap-2 px-3 pb-2 pt-4 text-[11px] font-medium text-sidebar-foreground/60">
                {section.titleIcon ? <section.titleIcon className="h-3.5 w-3.5" /> : null}
                <span>{section.title}</span>
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
                    {extractKoreanName(user?.name || userFullName) ||
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
