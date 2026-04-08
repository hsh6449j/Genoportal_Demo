"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  BarChart3,
  Bot,
  CloudSun,
  Clock3,
  FilePenLine,
  ShieldCheck,
  Sparkles,
  Building2,
  Search,
  MessageCircleMore,
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
    title: "민원상담 어시스턴트",
    description: "민원 상담 대응 문구와 상담 흐름 가이드를 대화형으로 지원합니다.",
    href: "/insight-chat?agent=assistant&feature=counseling",
    label: "핵심 서비스",
    icon: Bot,
    accent: "from-orange-500/12 to-amber-500/12",
  },
  {
    title: "상담지식 에이전트",
    description: "규정과 상담 지식을 바탕으로 질의 의도에 맞는 답변 근거를 제공합니다.",
    href: "/insight-chat?agent=compliance",
    label: "지식 검색",
    icon: ShieldCheck,
    accent: "from-amber-500/10 to-orange-400/10",
  },
  {
    title: "데이터길잡이",
    description: "상담·업무 데이터를 자연어 질의로 분석하고 주요 지표를 시각화합니다.",
    href: "/market-sensing?tab=dashboard",
    label: "데이터 분석",
    icon: BarChart3,
    accent: "from-amber-500/10 to-orange-500/10",
  },
  {
    title: "문서작성 지원",
    description: "공문, 제안요청서, FAQ 초안 등 업무 문서를 생성하고 수정합니다.",
    href: "/?task=documentation",
    label: "업무 문서",
    icon: FilePenLine,
    accent: "from-orange-400/10 to-amber-400/15",
  },
  {
    title: "문서분석 지원",
    description: "업로드한 문서를 요약·발췌·번역해 상담과 업무 처리에 필요한 정보를 정리합니다.",
    href: "/translation",
    label: "문서 분석",
    icon: Search,
    accent: "from-orange-500/10 to-yellow-400/10",
  },
  {
    title: "민원처리 지원",
    description: "민원 내용을 바탕으로 유사 사례와 답변 초안을 빠르게 정리합니다.",
    href: "/formatting",
    label: "민원 대응",
    icon: MessageCircleMore,
    accent: "from-amber-500/10 to-orange-500/10",
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
              <Badge className="bg-[#FF9100] text-white hover:bg-[#FF9100]">GenPortal</Badge>
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
                신용회복위원회 생성형 AI 포털
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {displayName}님, 필요한 서비스를 선택해 바로 업무를 시작하세요.
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                GenPortal은 사내 로그인과 연계된 단일 포털에서 민원 상담, 상담지식 검색, 데이터 분석,
                문서 작성, 문서 분석, 민원 처리 서비스를 통합 제공하는 데모 환경입니다.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <Card className="border-border/70 bg-card/95 py-0">
            <CardContent className="flex items-center gap-3 px-5 py-4">
              <CloudSun className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-xs text-muted-foreground">서울 날씨</p>
                <p className="text-sm font-semibold text-foreground">맑음 15°C</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/95 py-0">
            <CardContent className="flex items-center gap-3 px-5 py-4">
              <Clock3 className="h-8 w-8 text-[#FF9100]" />
              <div>
                <p className="text-xs text-muted-foreground">현재 시간</p>
                <p className="text-sm font-semibold text-foreground">{currentTime || "시간 확인 중"}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/95 py-0">
            <CardContent className="flex items-center gap-3 px-5 py-4">
              <Sparkles className="h-8 w-8 text-[#FFAC33]" />
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
