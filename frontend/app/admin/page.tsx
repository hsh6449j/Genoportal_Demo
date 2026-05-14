"use client"

import { Suspense, type ComponentType, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  Cpu,
  Gauge,
  Loader2,
  RefreshCw,
  ServerCog,
  ShieldCheck,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Login } from "@/components/login"
import { useAuth } from "@/contexts/auth-context"

type HealthLevel = "정상" | "주의" | "점검 필요"

function levelColor(level: HealthLevel) {
  switch (level) {
    case "정상":
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    case "주의":
      return "bg-sky-100 text-sky-700 border-sky-200"
    case "점검 필요":
      return "bg-red-100 text-red-700 border-red-200"
  }
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string
  value: string
  description: string
  icon: ComponentType<{ className?: string }>
}) {
  const IconComponent = Icon as ComponentType<{ className?: string }>
  return (
    <Card className="py-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <IconComponent className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1 pb-5">
        <div className="text-2xl font-semibold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function AdminPageContent() {
  const { isAuthenticated, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const [seed, setSeed] = useState(1)
  const feature = searchParams.get("feature") || "quality-monitoring"

  const data = useMemo(() => {
    const rand = (n: number) => {
      const x = Math.sin(seed * (n + 1)) * 10000
      return x - Math.floor(x)
    }

    const serviceQualityRows = [
      {
        service: "고객상담 어시스턴트",
        accuracy: `${(91 + Math.round(rand(1) * 5))}%`,
        hallucination: `${(2.1 + rand(2) * 1.2).toFixed(1)}%`,
        latency: `${(2.8 + rand(3) * 0.8).toFixed(1)}초`,
        feedback: `${(84 + Math.round(rand(4) * 8))}%`,
        level: (rand(5) > 0.8 ? "주의" : "정상") as HealthLevel,
      },
      {
        service: "상담지식 에이전트",
        accuracy: `${(93 + Math.round(rand(6) * 4))}%`,
        hallucination: `${(1.5 + rand(7) * 1.0).toFixed(1)}%`,
        latency: `${(2.0 + rand(8) * 0.7).toFixed(1)}초`,
        feedback: `${(87 + Math.round(rand(9) * 6))}%`,
        level: (rand(10) > 0.88 ? "주의" : "정상") as HealthLevel,
      },
      {
        service: "민원처리 지원",
        accuracy: `${(88 + Math.round(rand(11) * 5))}%`,
        hallucination: `${(2.7 + rand(12) * 1.4).toFixed(1)}%`,
        latency: `${(3.1 + rand(13) * 0.9).toFixed(1)}초`,
        feedback: `${(81 + Math.round(rand(14) * 9))}%`,
        level: (rand(15) > 0.72 ? "주의" : "정상") as HealthLevel,
      },
      {
        service: "업무담당자 배정",
        accuracy: `${(86 + Math.round(rand(16) * 6))}%`,
        hallucination: `${(1.2 + rand(17) * 0.8).toFixed(1)}%`,
        latency: `${(1.7 + rand(18) * 0.8).toFixed(1)}초`,
        feedback: `${(83 + Math.round(rand(19) * 8))}%`,
        level: (rand(20) > 0.84 ? "점검 필요" : "정상") as HealthLevel,
      },
    ]

    const resourceRows = [
      {
        model: "gpt-4.1",
        role: "규정 검색 / 민원 처리 / 담당자 배정",
        gpu: 72,
        cpu: 38,
        memory: "31.4 / 40 GB",
        throughput: "19 req/min",
        latency: "2.8초",
        instances: 3,
      },
      {
        model: "gpt-4.1 mini",
        role: "민원상담 / 단순 질의응답 / 문서작성",
        gpu: 49,
        cpu: 29,
        memory: "15.7 / 24 GB",
        throughput: "42 req/min",
        latency: "1.9초",
        instances: 4,
      },
      {
        model: "Python Sandbox Worker",
        role: "데이터길잡이 분석 코드 실행",
        gpu: 0,
        cpu: 64,
        memory: "11.3 / 16 GB",
        throughput: "8 jobs/hr",
        latency: "44초",
        instances: 2,
      },
      {
        model: "Embedding Encoder",
        role: "문서분석 / 규정검색 / 유사사례 검색",
        gpu: 34,
        cpu: 18,
        memory: "9.8 / 12 GB",
        throughput: "85 chunks/min",
        latency: "0.6초",
        instances: 2,
      },
    ]

    return {
      qualityHighlights: {
        answerAccuracy: `${(91 + Math.round(rand(21) * 4))}%`,
        hallucination: `${(1.9 + rand(22) * 1.0).toFixed(1)}%`,
        positiveFeedback: `${(86 + Math.round(rand(23) * 6))}%`,
        averageLatency: `${(2.4 + rand(24) * 0.8).toFixed(1)}초`,
      },
      qualityEvents: [
        "민원처리 지원에서 답변 초안 재생성 요청 비율이 오전 시간대에 소폭 증가했습니다.",
        "사내규정 검색에서 조항 출처 누락 응답이 감지되어 프롬프트 점검이 필요합니다.",
        "업무담당자 배정에서 2순위 후보 호출 비율이 증가하여 규칙 튜닝이 필요합니다.",
      ],
      serviceQualityRows,
      resourceRows,
      resourceHighlights: {
        gpuUsage: 63 + Math.round(rand(25) * 12),
        cpuUsage: 41 + Math.round(rand(26) * 16),
        activeModels: 4,
        queueDepth: 18 + Math.round(rand(28) * 7),
      },
      resourceAlerts: [
        "gpt-4.1 모델 풀이 규정검색·민원처리 요청 증가로 70% 이상 점유되고 있어 fallback 정책 점검이 필요합니다.",
        "Python Sandbox Worker는 분석 요청이 몰리는 시간대에 대기 작업이 증가해 실행 슬롯 조정이 필요합니다.",
        "Embedding Encoder는 안정적이지만 문서 업로드가 집중되면 추가 인스턴스 증설이 필요할 수 있습니다.",
      ],
      serviceModelMappings: [
        {
          service: "고객상담 어시스턴트",
          primary: "gpt-4.1 mini",
          fallback: "gpt-4.1",
          note: "일반 상담 응답은 mini, 장문 응대나 복합 문의는 gpt-4.1로 전환",
        },
        {
          service: "상담지식 에이전트",
          primary: "gpt-4.1",
          fallback: "Embedding Encoder",
          note: "규정/지식 RAG 검색 후 근거형 답변을 gpt-4.1이 정리",
        },
        {
          service: "데이터길잡이",
          primary: "gpt-4.1 + Python Sandbox Worker",
          fallback: "gpt-4.1 mini",
          note: "질의 해석은 LLM, 분석 코드 실행은 샌드박스 워커 담당",
        },
        {
          service: "문서작성 지원",
          primary: "gpt-4.1 mini",
          fallback: "gpt-4.1",
          note: "초안 생성은 mini, 장문 정제나 고난도 문안은 gpt-4.1 사용",
        },
      ],
    }
  }, [seed])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  const isResourceView = feature === "resource-management"

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mx-auto flex max-w-7xl items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {isResourceView ? <ServerCog className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            <span>운영 관리</span>
          </div>
          <h1 className="text-2xl font-semibold">
            {isResourceView ? "자원 관리" : "품질 모니터링"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isResourceView
              ? "서비스별 GPU/CPU 사용률, 모델 할당량, 대기열 상황을 운영 관점에서 확인합니다."
              : "응답 품질, 환각률, 만족도, 재생성 요청 비율을 기반으로 서비스 안정성을 점검합니다."}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSeed((value) => value + 1)}>
          <RefreshCw className="mr-2 h-4 w-4" />
          새로고침
        </Button>
      </div>

      <div className="mx-auto mt-6 max-w-7xl space-y-6">
        {isResourceView ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="전체 GPU 사용률"
                value={`${data.resourceHighlights.gpuUsage}%`}
                description="현재 운영 중인 생성형 AI 워크로드 기준"
                icon={Cpu}
              />
              <StatCard
                title="전체 CPU 사용률"
                value={`${data.resourceHighlights.cpuUsage}%`}
                description="API, 검색, 배치 서비스 평균"
                icon={Gauge}
              />
              <StatCard
                title="활성 모델 수"
                value={`${data.resourceHighlights.activeModels}개`}
                description="현재 운영 중인 주요 추론/검색 모델"
                icon={BrainCircuit}
              />
              <StatCard
                title="대기열 깊이"
                value={`${data.resourceHighlights.queueDepth}건`}
                description="대기 중인 생성·분석 요청"
                icon={BarChart3}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <Card className="py-0">
                <CardHeader>
                  <CardTitle className="text-base">모델별 점유 현황</CardTitle>
                  <CardDescription>어떤 모델이 자원을 점유하고 있는지 운영 관점에서 확인합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {data.resourceRows.map((row) => (
                    <div key={row.model} className="rounded-xl border p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{row.model}</p>
                          <p className="text-xs text-muted-foreground">{row.role}</p>
                        </div>
                        <Badge variant="outline">{row.instances}개 인스턴스</Badge>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>GPU</span>
                            <span>{row.gpu}%</span>
                          </div>
                          <Progress value={row.gpu} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>CPU</span>
                            <span>{row.cpu}%</span>
                          </div>
                          <Progress value={row.cpu} className="h-2" />
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-3">
                        <div>메모리 {row.memory}</div>
                        <div>처리량 {row.throughput}</div>
                        <div>평균 응답 {row.latency}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="py-0">
                <CardHeader>
                  <CardTitle className="text-base">서비스-모델 매핑</CardTitle>
                  <CardDescription>각 서비스가 어떤 모델 풀을 사용하는지와 fallback 구조를 보여줍니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.serviceModelMappings.map((item) => (
                    <div key={item.service} className="rounded-xl border p-4">
                      <div className="font-medium">{item.service}</div>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <div>주 모델: {item.primary}</div>
                        <div>대체 경로: {item.fallback}</div>
                        <div>{item.note}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="py-0">
              <CardHeader>
                <CardTitle className="text-base">운영 유의사항</CardTitle>
                <CardDescription>리소스 재조정이나 fallback 정책 점검이 필요한 항목입니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.resourceAlerts.map((alert) => (
                  <div key={alert} className="rounded-xl border border-sky-200 bg-sky-50/70 p-4 text-sm leading-6">
                    {alert}
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="답변 정확도"
                value={data.qualityHighlights.answerAccuracy}
                description="최근 7일 운영 검수 기준"
                icon={ShieldCheck}
              />
              <StatCard
                title="환각률"
                value={data.qualityHighlights.hallucination}
                description="근거 없는 응답으로 분류된 비율"
                icon={AlertTriangle}
              />
              <StatCard
                title="긍정 피드백"
                value={data.qualityHighlights.positiveFeedback}
                description="좋아요·만족 응답 비중"
                icon={BrainCircuit}
              />
              <StatCard
                title="평균 응답시간"
                value={data.qualityHighlights.averageLatency}
                description="서비스 전체 평균 응답 지연"
                icon={Activity}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <Card className="py-0">
                <CardHeader>
                  <CardTitle className="text-base">서비스별 품질 현황</CardTitle>
                  <CardDescription>운영 중인 핵심 서비스의 품질 지표를 비교합니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>서비스</TableHead>
                        <TableHead>정확도</TableHead>
                        <TableHead>환각률</TableHead>
                        <TableHead>응답시간</TableHead>
                        <TableHead>만족도</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.serviceQualityRows.map((row) => (
                        <TableRow key={row.service}>
                          <TableCell className="font-medium">{row.service}</TableCell>
                          <TableCell>{row.accuracy}</TableCell>
                          <TableCell>{row.hallucination}</TableCell>
                          <TableCell>{row.latency}</TableCell>
                          <TableCell>{row.feedback}</TableCell>
                          <TableCell>
                            <Badge className={levelColor(row.level)} variant="outline">
                              {row.level}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="py-0">
                <CardHeader>
                  <CardTitle className="text-base">품질 점검 메모</CardTitle>
                  <CardDescription>모니터링 중 우선 확인이 필요한 이슈입니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.qualityEvents.map((event) => (
                    <div key={event} className="rounded-xl border p-4 text-sm leading-6">
                      {event}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Separator />

            <Card className="py-0">
              <CardHeader>
                <CardTitle className="text-base">최근 품질 이벤트</CardTitle>
                <CardDescription>서비스 운영 중 발생한 품질 관련 이벤트를 시간 순으로 보여줍니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[160px]">구분</TableHead>
                      <TableHead>내용</TableHead>
                      <TableHead className="w-[180px]">발생 시각</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>출처 누락</TableCell>
                      <TableCell>사내규정 검색 응답에서 시행일 누락 사례가 감지되었습니다.</TableCell>
                      <TableCell>오늘 09:12</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>재생성 증가</TableCell>
                      <TableCell>민원처리 지원에서 후속 요청 반영 비율이 기준 대비 8%p 상승했습니다.</TableCell>
                      <TableCell>오늘 10:04</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>검증 필요</TableCell>
                      <TableCell>업무담당자 배정 2순위 추천 비율이 증가해 배정 규칙 검토가 필요합니다.</TableCell>
                      <TableCell>오늘 10:31</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">운영 관리 화면을 불러오는 중입니다.</div>}>
      <AdminPageContent />
    </Suspense>
  )
}
