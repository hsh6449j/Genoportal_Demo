"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  BarChart3,
  Bot,
  CloudSun,
  Clock3,
  Code2,
  FilePenLine,
  Headset,
  ShieldCheck,
  Sparkles,
  Building2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GenPortalHomeProps {
  displayName: string
}

const services = [
  {
    title: "AI 업무비서",
    description: "일반 질의응답과 문서 요약, 번역, 정리를 지원합니다.",
    href: "/insight-chat?agent=assistant",
    label: "기본 서비스",
    icon: Bot,
    accent: "from-blue-500/10 to-cyan-500/10",
  },
  {
    title: "데이터 분석 에이전트",
    description: "사내 시스템 데이터를 기반으로 매출과 운영 현황을 분석합니다.",
    href: "/market-sensing?tab=dashboard",
    label: "차트 분석",
    icon: BarChart3,
    accent: "from-emerald-500/10 to-teal-500/10",
  },
  {
    title: "문서 작성 에이전트",
    description: "전자결재, 제안요청서, 시방서, 보도자료 초안을 작성합니다.",
    href: "/?task=documentation",
    label: "업무 문서",
    icon: FilePenLine,
    accent: "from-violet-500/10 to-indigo-500/10",
  },
  {
    title: "고객 지원 에이전트",
    description: "예약 안내와 고객 응대 메시지, 책임도박 안내 문안을 생성합니다.",
    href: "/customer-support/resort",
    label: "응대 지원",
    icon: Headset,
    accent: "from-amber-500/10 to-orange-500/10",
  },
  {
    title: "컴플라이언스 에이전트",
    description: "법령·사규 질의응답과 감사·안전 지적사항 검토를 지원합니다.",
    href: "/insight-chat?agent=compliance",
    label: "규정 검토",
    icon: ShieldCheck,
    accent: "from-rose-500/10 to-pink-500/10",
  },
  {
    title: "개발 에이전트",
    description: "코드 생성과 개발 문서 작성, 구현 아이디어 정리를 돕습니다.",
    href: "/insight-chat?agent=development",
    label: "IT 지원",
    icon: Code2,
    accent: "from-slate-500/10 to-zinc-500/10",
  },
] as const

export function GenPortalHome({ displayName }: GenPortalHomeProps) {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("ko-KR", {
      month: "long",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    })

    const updateTime = () => {
      setCurrentTime(formatter.format(new Date()))
    }

    updateTime()
    const timer = window.setInterval(updateTime, 60_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="w-full max-w-6xl space-y-6">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <Card className="border-border/70 bg-card/95 py-0">
          <CardContent className="flex flex-col gap-5 px-6 py-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-blue-600 text-white hover:bg-blue-600">GenPortal</Badge>
              <Badge variant="outline" className="border-border/70 bg-background/60">
                생성형 AI 통합 포털
              </Badge>
              <Badge variant="outline" className="border-border/70 bg-background/60">
                사내 서비스 연계
              </Badge>
            </div>

            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Building2 className="h-4 w-4" />
                강원랜드 생성형 AI 플랫폼
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {displayName}님, 필요한 서비스를 선택해 바로 업무를 시작하세요.
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                GenPortal은 사내 로그인과 연계된 단일 포털에서 업무비서, 데이터 분석, 문서 작성,
                고객 지원, 컴플라이언스, 개발 지원 서비스를 제공하는 데모 환경입니다.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <Card className="border-border/70 bg-card/95 py-0">
            <CardContent className="flex items-center gap-3 px-5 py-4">
              <CloudSun className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-xs text-muted-foreground">정선 날씨</p>
                <p className="text-sm font-semibold text-foreground">맑음 8°C</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/95 py-0">
            <CardContent className="flex items-center gap-3 px-5 py-4">
              <Clock3 className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">현재 시간</p>
                <p className="text-sm font-semibold text-foreground">{currentTime || "시간 확인 중"}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/95 py-0">
            <CardContent className="flex items-center gap-3 px-5 py-4">
              <Sparkles className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-xs text-muted-foreground">로그인 정보</p>
                <p className="text-sm font-semibold text-foreground">{displayName}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon

          return (
            <Card
              key={service.title}
              className={cn(
                "group h-full border-border/70 bg-card/95 py-0 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
                `bg-gradient-to-br ${service.accent}`
              )}
            >
              <CardHeader className="px-5 pt-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-background/80 shadow-sm">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <Badge variant="outline" className="border-border/70 bg-background/75">
                    {service.label}
                  </Badge>
                </div>
                <CardTitle className="pt-2 text-lg">{service.title}</CardTitle>
                <CardDescription className="leading-6">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto px-5 pb-5">
                <Button asChild className="w-full justify-between">
                  <Link href={service.href}>
                    서비스 열기
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
