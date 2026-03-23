"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Bell, TrendingUp, TrendingDown, BarChart3, X, Settings, ChevronDown, ChevronUp, Globe, Clock, Play, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import MarketSensingSettingsModal from "@/components/market-sensing-settings-modal"
import WordCloudCanvas from "@/components/word-cloud-canvas"
import InsightView from "@/components/insight-view"
import InsightList from "@/components/insight-list"
import { Insight } from "@/hooks/use-insight"
import { baseWordData } from "@/lib/mock/baseWordData"
import { sectorColors } from "@/lib/mock/sectorColors"
import { sampleChartData } from "@/lib/mock/sampleChartData"
import { mockSNSNews } from "@/lib/mock/mockSNSNews"
import { aiInsightReports } from "@/lib/mock/aiInsightReports"

// 섹터별 데이터 종류 정의
const sectorData = {
  "리조트 운영": [
    {
      id: "total-revenue",
      name: "월별 매출 추이",
      source: "통합 매출 집계",
      enabled: false
    },
    {
      id: "room-occupancy",
      name: "객실 점유율",
      source: "PMS",
      enabled: false
    },
    {
      id: "adr",
      name: "평균 객실 단가",
      source: "예약 시스템",
      enabled: false
    },
    {
      id: "package-sales",
      name: "패키지 판매량",
      source: "패키지 판매 DB",
      enabled: false
    }
  ],
  "카지노 운영": [
    {
      id: "casino-drop",
      name: "테이블 드롭액",
      source: "카지노 운영 DB",
      enabled: false
    },
    {
      id: "slot-utilization",
      name: "슬롯 이용률",
      source: "게임 머신 로그",
      enabled: false
    },
    {
      id: "vip-visitors",
      name: "VIP 방문객 수",
      source: "VIP CRM",
      enabled: false
    }
  ],
  "고객 서비스": [
    {
      id: "voc-resolution",
      name: "VOC 해결률",
      source: "고객지원 시스템",
      enabled: false
    },
    {
      id: "membership-join",
      name: "멤버십 신규 가입",
      source: "멤버십 시스템",
      enabled: false
    },
    {
      id: "app-active-users",
      name: "앱 활성 이용자",
      source: "모바일 앱 로그",
      enabled: false
    }
  ],
  "관광/지역 연계": [
    {
      id: "visitor-traffic",
      name: "방문객 추이",
      source: "입장 데이터",
      enabled: false
    },
    {
      id: "shuttle-ridership",
      name: "셔틀 이용객 수",
      source: "교통 운영 데이터",
      enabled: false
    },
    {
      id: "nearby-spending",
      name: "주변 상권 소비액",
      source: "지역 연계 통계",
      enabled: false
    }
  ]
}


const getSampleData = (dataType: string) => {
  return sampleChartData[dataType] || sampleChartData["room-occupancy"];
}

const dashboardQueryScenarios = [
  {
    id: "resort-sales",
    question: "3월 리조트 매출 추이와 객실 점유율 변화를 함께 분석해줘.",
    summaryTitle: "리조트 운영 매출 분석",
    summaryPoints: [
      "3월 중순 이후 객실 점유율 상승과 함께 리조트 매출이 동반 증가했습니다.",
      "주말 패키지 판매량이 늘면서 평균 객실 단가도 함께 개선되는 흐름입니다.",
      "성수기 직전 수요가 집중되는 구간이라 체크인 운영 인력 보강이 필요해 보입니다.",
    ],
    metrics: ["월별 매출 추이", "객실 점유율", "평균 객실 단가"],
    exampleQuestion: "이 결과를 기준으로 운영 대응 포인트는 뭐야?",
    exampleAnswer:
      "주말 체크인 인력과 현장 안내 채널을 우선 보강하고, 패키지 판매 증가 구간에는 객실 운영과 프런트 대응을 함께 준비하는 것이 좋습니다.",
    selections: {
      "리조트 운영-total-revenue": true,
      "리조트 운영-room-occupancy": true,
      "리조트 운영-adr": true,
      "카지노 운영-casino-drop": false,
      "고객 서비스-voc-resolution": false,
      "관광/지역 연계-visitor-traffic": false,
    },
  },
  {
    id: "weekend-traffic",
    question: "주말 방문객 증가가 매출과 VOC에 어떤 영향을 주는지 보여줘.",
    summaryTitle: "주말 운영 영향 분석",
    summaryPoints: [
      "방문객 증가 시 객실과 카지노 매출은 상승하지만 고객센터 문의량도 함께 높아집니다.",
      "주말 피크 구간에는 셔틀 이용객 수와 VOC 해결률을 동시에 관리할 필요가 있습니다.",
      "운영 지표를 보면 수요 증가 대비 안내 인력과 응대 채널 보강이 필요한 시점입니다.",
    ],
    metrics: ["월별 매출 추이", "VOC 해결률", "방문객 추이"],
    exampleQuestion: "주말 운영 영향이 큰 구간은 어떻게 대비하는 게 좋을까?",
    exampleAnswer:
      "방문객 증가 시점에 맞춰 고객센터 응답 인력과 셔틀·현장 안내를 함께 보강하는 것이 효과적이며, VOC 대응 속도를 별도 지표로 묶어 관리하는 것이 좋습니다.",
    selections: {
      "리조트 운영-total-revenue": true,
      "고객 서비스-voc-resolution": true,
      "관광/지역 연계-visitor-traffic": true,
      "리조트 운영-room-occupancy": false,
      "카지노 운영-casino-drop": false,
    },
  },
  {
    id: "casino-service",
    question: "카지노 운영 지표와 고객 서비스 지표를 함께 분석해줘.",
    summaryTitle: "카지노 및 고객 서비스 분석",
    summaryPoints: [
      "카지노 드롭액이 높은 날에는 고객 문의량과 상담 수요도 함께 커지는 경향이 보입니다.",
      "VIP 방문객 증가 구간에서는 현장 응대 품질과 보호 안내 메시지 품질이 중요합니다.",
      "고객보호센터 안내와 고객센터 응답 품질을 함께 보는 통합 관제가 효과적입니다.",
    ],
    metrics: ["테이블 드롭액", "VOC 해결률", "멤버십 신규 가입"],
    exampleQuestion: "이 조합으로 보면 어떤 운영 리스크를 먼저 볼 수 있어?",
    exampleAnswer:
      "카지노 이용 증가와 고객 문의 증가가 함께 나타나는 구간에서 현장 응대 품질 저하 가능성을 먼저 볼 수 있고, 보호 안내 메시지와 고객센터 연결 체계를 같이 점검하는 것이 좋습니다.",
    selections: {
      "카지노 운영-casino-drop": true,
      "고객 서비스-voc-resolution": true,
      "고객 서비스-membership-join": true,
      "리조트 운영-total-revenue": false,
      "관광/지역 연계-visitor-traffic": false,
    },
  },
]

function inferDashboardScenarioId(question: string) {
  const normalized = question.toLowerCase()

  if (normalized.includes("카지노")) return "casino-service"
  if (normalized.includes("voc") || normalized.includes("방문객") || normalized.includes("주말")) return "weekend-traffic"
  return "resort-sales"
}

function buildEmptySectorSelections() {
  const emptySelections: { [key: string]: boolean } = {}

  Object.entries(sectorData).forEach(([sectorName, dataItems]) => {
    dataItems.forEach((dataItem) => {
      emptySelections[`${sectorName}-${dataItem.id}`] = false
    })
  })

  return emptySelections
}

function getMetricMeta(metricKey: string) {
  const separatorIndex = metricKey.indexOf("-")
  if (separatorIndex === -1) return null

  const sectorName = metricKey.slice(0, separatorIndex)
  const dataId = metricKey.slice(separatorIndex + 1)
  const items = sectorData[sectorName as keyof typeof sectorData] || []
  const dataItem = items.find((item) => item.id === dataId)

  if (!dataItem) return null

  return {
    key: metricKey,
    dataId,
    sectorName,
    label: dataItem.name,
    source: dataItem.source,
  }
}

function getMetricKeysForScenario(scenarioId: string) {
  const scenario = dashboardQueryScenarios.find((item) => item.id === scenarioId)
  if (!scenario) return []

  const keys: string[] = []
  scenario.metrics.forEach((metricLabel) => {
    Object.entries(sectorData).forEach(([sectorName, dataItems]) => {
      const matchedItem = dataItems.find((item) => item.name === metricLabel)
      if (matchedItem) {
        keys.push(`${sectorName}-${matchedItem.id}`)
      }
    })
  })

  return keys
}

function formatMetricValue(metricKey: string, value: number) {
  if (metricKey === "total-revenue" || metricKey === "casino-drop") return `${value}억원`
  if (metricKey === "room-occupancy" || metricKey === "voc-resolution" || metricKey === "slot-utilization") return `${value}%`
  if (metricKey === "adr") return `${value}만원`
  if (metricKey === "visitor-traffic") return `${value}만명`
  if (metricKey === "membership-join") return `${value}천명`
  return `${value}`
}

function buildDashboardSummary(
  question: string,
  selectedMetrics: Array<{ key: string; dataId: string; label: string; sectorName: string; source: string }>,
) {
  const bullets: string[] = []
  const summaryTitle = question.trim() ? `질의 분석: ${question.trim()}` : "질의 분석 요약"

  selectedMetrics.forEach((metric) => {
    const series = sampleChartData[metric.dataId] || []
    if (series.length === 0) return

    const first = series[0]
    const last = series[series.length - 1]
    const peak = series.reduce((max, item) => (item.value > max.value ? item : max), series[0])

    if (metric.key === "total-revenue") {
      bullets.push(`월별 매출은 ${first.month} ${formatMetricValue(metric.dataId, first.value)}에서 ${peak.month} ${formatMetricValue(metric.dataId, peak.value)}까지 상승했고, 연말 ${last.month}에도 ${formatMetricValue(metric.dataId, last.value)} 수준을 유지했습니다.`)
    } else if (metric.dataId === "room-occupancy") {
      bullets.push(`객실 점유율은 ${first.month} ${formatMetricValue(metric.dataId, first.value)}에서 성수기 ${peak.month} ${formatMetricValue(metric.dataId, peak.value)}까지 높아져 수요 집중 구간이 뚜렷하게 나타납니다.`)
    } else if (metric.dataId === "adr") {
      bullets.push(`평균 객실 단가는 ${first.month} ${formatMetricValue(metric.dataId, first.value)}에서 ${peak.month} ${formatMetricValue(metric.dataId, peak.value)}까지 상승해 수요 증가가 단가 개선으로 연결된 흐름을 보입니다.`)
    } else if (metric.dataId === "voc-resolution") {
      bullets.push(`VOC 해결률은 ${first.month} ${formatMetricValue(metric.dataId, first.value)}에서 ${peak.month} ${formatMetricValue(metric.dataId, peak.value)}까지 개선됐지만, 이후 ${last.month} ${formatMetricValue(metric.dataId, last.value)} 수준으로 조정돼 성수기 응대 부하를 점검할 필요가 있습니다.`)
    } else if (metric.dataId === "visitor-traffic") {
      bullets.push(`방문객 추이는 ${first.month} ${formatMetricValue(metric.dataId, first.value)}에서 ${peak.month} ${formatMetricValue(metric.dataId, peak.value)}까지 증가해 주말 및 성수기 운영 부담이 커지는 시점을 설명해줍니다.`)
    } else if (metric.dataId === "casino-drop") {
      bullets.push(`테이블 드롭액은 ${first.month} ${formatMetricValue(metric.dataId, first.value)}에서 ${peak.month} ${formatMetricValue(metric.dataId, peak.value)}로 확대돼 카지노 수요가 여름 성수기에 집중되는 패턴을 보입니다.`)
    } else if (metric.dataId === "membership-join") {
      bullets.push(`멤버십 신규 가입은 ${first.month} ${formatMetricValue(metric.dataId, first.value)}에서 ${peak.month} ${formatMetricValue(metric.dataId, peak.value)}까지 늘어 신규 고객 유입과 재방문 전환 가능성이 함께 높아졌습니다.`)
    }
  })

  const selectedMetricLabels = selectedMetrics.map((metric) => metric.label)

  if (selectedMetricLabels.includes("월별 매출 추이") && selectedMetricLabels.includes("객실 점유율")) {
    bullets.push("매출과 객실 점유율이 같은 구간에서 함께 상승해 리조트 수요 증가가 실제 매출 개선으로 연결된 것으로 해석할 수 있습니다.")
  }
  if (selectedMetricLabels.includes("월별 매출 추이") && selectedMetricLabels.includes("VOC 해결률")) {
    bullets.push("매출 상승 구간에 VOC 해결률을 함께 보면 수요 확대가 고객 응대 품질에 미치는 영향을 동시에 관리할 수 있습니다.")
  }
  if (selectedMetricLabels.includes("테이블 드롭액") && selectedMetricLabels.includes("VOC 해결률")) {
    bullets.push("카지노 이용 지표와 고객 서비스 지표를 함께 보면 현장 응대 품질 저하 가능성과 보호 안내 필요 시점을 더 빨리 포착할 수 있습니다.")
  }

  if (bullets.length === 0) {
    bullets.push("선택한 지표를 기준으로 기간별 변화를 비교하면 운영 개선 포인트를 도출할 수 있습니다.")
  }

  return { summaryTitle, bullets }
}

function buildFollowUpAnswer(scenarioId: string, question: string, selectedMetricLabels: string[]) {
  const normalized = question.toLowerCase()
  const metricText = selectedMetricLabels.length > 0 ? selectedMetricLabels.join(", ") : "선택된 운영 지표"

  if (normalized.includes("원인") || normalized.includes("이유")) {
    return `${metricText} 기준으로 보면 최근 변화는 성수기 수요 집중, 운영 채널 이용 증가, 고객 접점 확대 영향으로 해석할 수 있습니다.`
  }

  if (normalized.includes("대응") || normalized.includes("조치") || normalized.includes("액션")) {
    return `${scenarioId === "casino-service" ? "고객보호 안내와 현장 응대 인력" : "운영 인력과 안내 채널"}를 우선 보강하고, 선택 지표를 기준으로 주간 단위 모니터링을 권장합니다.`
  }

  if (normalized.includes("비교") || normalized.includes("함께")) {
    return `${metricText}를 함께 보면 단일 지표만으로는 보이지 않는 운영 영향도를 비교할 수 있습니다. 특히 매출 지표와 서비스 지표를 묶어서 보는 방식이 유효합니다.`
  }

  return `${metricText}를 기준으로 보면 현재 질의와 연관된 운영 변화는 계속 설명할 수 있습니다. 필요하면 특정 기간, 운영 영역, 고객 서비스 영향 중심으로 더 좁혀서 분석할 수 있습니다.`
}

function buildScenarioFollowUpSeed(scenarioId: string) {
  const scenario = dashboardQueryScenarios.find((item) => item.id === scenarioId)
  if (!scenario) return []

  return [
    {
      id: `seed-${scenario.id}`,
      question: scenario.exampleQuestion,
      answer: scenario.exampleAnswer,
    },
  ]
}


// 연관 키워드는 선택 키워드 패널에서 더 이상 사용하지 않음

// 실시간 알림 데이터
const generateRandomAlert = () => {
  const alertTypes = [
    {
      type: "occupancy",
      icon: TrendingUp,
      title: "예약 수요 급증",
      companies: ["객실 예약", "패키지 예약", "워터월드 예약", "주말 프로모션"],
      messages: [
        "예약 건수가 30분 내 25% 증가했습니다",
        "성수기 객실 점유율이 목표치를 초과했습니다",
        "패키지 상품 전환율이 빠르게 상승하고 있습니다"
      ]
    },
    {
      type: "volume",
      icon: BarChart3,
      title: "운영 지표 변동",
      companies: ["카지노 객장", "셔틀 운영", "멤버십", "고객센터"],
      messages: [
        "이용량이 일평균 대비 18% 증가했습니다",
        "고객 문의량이 평소보다 빠르게 늘고 있습니다",
        "운영 인력 재배치가 필요한 수준으로 지표가 변동 중입니다"
      ]
    },
    {
      type: "keyword",
      icon: TrendingUp,
      title: "이슈 키워드 상승",
      companies: ["리조트예약", "책임도박", "셔틀이용", "고객만족"],
      messages: [
        "키워드 언급량이 1시간 내 200% 증가",
        "고객 후기 및 VOC 언급량이 빠르게 증가하고 있습니다",
        "운영 관련 이슈가 집중적으로 확산되고 있습니다"
      ]
    }
  ]

  const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
  const randomCompany = randomType.companies[Math.floor(Math.random() * randomType.companies.length)]
  const randomMessage = randomType.messages[Math.floor(Math.random() * randomType.messages.length)]

  return {
    id: Date.now() + Math.random(),
    type: randomType.type,
    icon: randomType.icon,
    title: randomType.title,
    company: randomCompany,
    message: randomMessage,
    time: new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    isRead: false,
    timestamp: Date.now()
  }
}

// 초기 알림 데이터 (빈 배열로 시작)
const initialAlerts: any[] = []


// 섹터 선택 컴포넌트
function SectorSelector({
  selectedSectors,
  onToggleSector,
  onToggleAllSector
}: {
  selectedSectors: { [key: string]: boolean }
  onToggleSector: (sectorName: string, dataId: string) => void
  onToggleAllSector: (sectorName: string) => void
}) {
  return (
    <div className="space-y-4">
      {Object.entries(sectorData).map(([sectorName, dataItems]) => (
        <div key={sectorName} className="space-y-2">
          <div className="flex items-center space-x-2 pb-2 border-b">
            <Checkbox
              id={`sector-${sectorName}`}
              checked={dataItems.some(item => selectedSectors[`${sectorName}-${item.id}`])}
              onCheckedChange={() => onToggleAllSector(sectorName)}
            />
            <label htmlFor={`sector-${sectorName}`} className="font-medium text-sm">
              {sectorName}
            </label>
          </div>

          {dataItems.map((dataItem) => (
            <div key={dataItem.id} className="flex items-start space-x-2 ml-4">
              <Checkbox
                id={`${sectorName}-${dataItem.id}`}
                checked={selectedSectors[`${sectorName}-${dataItem.id}`] || false}
                onCheckedChange={() => onToggleSector(sectorName, dataItem.id)}
              />
              <div className="flex-1 min-w-0">
                <label
                  htmlFor={`${sectorName}-${dataItem.id}`}
                  className="text-sm font-medium cursor-pointer block"
                >
                  {dataItem.name}
                </label>
                <p className="text-xs text-muted-foreground">{dataItem.source}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// 대시보드 차트 컴포넌트
function DashboardCharts({
  selectedSectors
}: {
  selectedSectors: { [key: string]: boolean }
}) {
  // 선택된 데이터 항목들 가져오기
  const getSelectedDataItems = () => {
    const selectedItems: Array<{ sectorName: string, dataItem: any }> = []

    Object.entries(sectorData).forEach(([sectorName, dataItems]) => {
      dataItems.forEach(dataItem => {
        if (selectedSectors[`${sectorName}-${dataItem.id}`]) {
          selectedItems.push({ sectorName, dataItem })
        }
      })
    })

    return selectedItems
  }

  const selectedItems = getSelectedDataItems()

  if (selectedItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-muted-foreground">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">표시할 데이터를 선택해주세요</h3>
          <p className="text-sm">좌측에서 운영 영역과 지표를 선택하면 차트가 표시됩니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {selectedItems.map(({ sectorName, dataItem }, index) => (
        <Card key={`${sectorName}-${dataItem.id}`} className="bg-card">
          <CardHeader className="bg-card">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{dataItem.name}</CardTitle>
                <CardDescription>
                  <Badge
                    variant="outline"
                    className="mr-2"
                    style={{
                      borderColor: sectorColors[sectorName] || "#2563eb",
                      color: sectorColors[sectorName] || "#2563eb"
                    }}
                  >
                    {sectorName}
                  </Badge>
                  출처: {dataItem.source}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-card">
            <div className="h-64 bg-background rounded-md">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getSampleData(dataItem.id)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.5rem",
                      color: "var(--foreground)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={sectorColors[sectorName] || "#2563eb"}
                    strokeWidth={2}
                    name={dataItem.name}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function MarketSensingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = useState(
    tabParam === "wordcloud" || tabParam === "ai-insights" ? tabParam : "dashboard"
  )

  useEffect(() => {
    if (tabParam === "wordcloud" || tabParam === "dashboard" || tabParam === "ai-insights") {
      setActiveTab(tabParam)
    }
  }, [tabParam])
  const [sourceFilter, setSourceFilter] = useState("all") // all, sns, news
  const [timeFilter, setTimeFilter] = useState("realtime") // realtime, daily, weekly, monthly
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [relatedContentTab, setRelatedContentTab] = useState<"news" | "sns">("news")
  const topPopularKeywords = useMemo(() => baseWordData.slice(0, 5), [])

  // 섹터 선택 상태 (기본 선택 항목들)
  const [selectedSectors, setSelectedSectors] = useState<{ [key: string]: boolean }>({
    "리조트 운영-total-revenue": true,
    "리조트 운영-room-occupancy": true,
    "카지노 운영-casino-drop": true,
    "고객 서비스-voc-resolution": true,
    "관광/지역 연계-visitor-traffic": true
  })
  const [selectedDashboardScenarioId, setSelectedDashboardScenarioId] = useState("resort-sales")
  const [dashboardQuestion, setDashboardQuestion] = useState(dashboardQueryScenarios[0].question)
  const [followUpQuestion, setFollowUpQuestion] = useState("")
  const [followUpResponses, setFollowUpResponses] = useState<Array<{ id: string; question: string; answer: string }>>(
    buildScenarioFollowUpSeed("resort-sales"),
  )

  // 알림 관련 상태
  const [alerts, setAlerts] = useState(initialAlerts)
  const [alertCounter, setAlertCounter] = useState(0) // 초기에는 알림이 없으므로 0부터 시작
  const [isAlertPanelOpen, setIsAlertPanelOpen] = useState(false)
  const [slidingAlert, setSlidingAlert] = useState<any>(null)
  const [showSlidingAlert, setShowSlidingAlert] = useState(false)
  // 좌측 패널 타이핑 애니메이션은 더 이상 사용하지 않음
  const [relatedSummaryStreamingText, setRelatedSummaryStreamingText] = useState("")
  const [isRelatedSummaryStreaming, setIsRelatedSummaryStreaming] = useState(false)
  const relatedSummaryIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 선택 키워드 패널에서 관련 종목 리스트는 제거됨

  // 설정 모달 상태
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  // 리포트 모달 상태
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  // 인기 키워드 드롭다운 상태
  const [expandedKeywords, setExpandedKeywords] = useState<{ [key: string]: boolean }>({})

  // AI 인사이트 필터 상태
  const [activeInsightFilter, setActiveInsightFilter] = useState<string>("전체")

  // AI Insight List/Detail View State
  const [viewMode, setViewMode] = useState<"list" | "detail">("list")
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)

  const handleSelectInsight = (insight: Insight) => {
    setSelectedInsight(insight)
    setViewMode("detail")
  }

  const handleBackToList = () => {
    setSelectedInsight(null)
    setViewMode("list")
  }

  // Manual insight generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleGenerateInsight = async () => {
    setIsGenerating(true)

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/insights/generate', {
        method: 'POST',
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error('Failed to generate insight')
      }

      // Refresh the insight list after generation
      window.location.reload()
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Insight generation cancelled')
      } else {
        console.error('Error generating insight:', error)
        alert('인사이트 생성에 실패했습니다.')
      }
    } finally {
      setIsGenerating(false)
      abortControllerRef.current = null
    }
  }

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsGenerating(false)
    }
  }

  const handleWordClick = (word: string) => {
    setSelectedWord(word)
    setRelatedContentTab("news")
  }

  const handleReportClick = (report: any) => {
    setSelectedReport(report)
    setIsReportModalOpen(true)
  }

  const toggleKeywordExpansion = (word: string) => {
    setExpandedKeywords(prev => ({
      ...prev,
      [word]: !prev[word]
    }))
  }

  const handleItemClick = (url: string) => {
    window.open(url, '_blank')
  }

  // 섹터 선택 관련 핸들러
  const handleToggleSector = (sectorName: string, dataId: string) => {
    setSelectedSectors(prev => ({
      ...prev,
      [`${sectorName}-${dataId}`]: !prev[`${sectorName}-${dataId}`]
    }))
  }

  const handleToggleAllSector = (sectorName: string) => {
    const sectorItems = sectorData[sectorName as keyof typeof sectorData] || []
    const allEnabled = sectorItems.every(item => selectedSectors[`${sectorName}-${item.id}`])

    const newSelections = { ...selectedSectors }
    sectorItems.forEach(item => {
      newSelections[`${sectorName}-${item.id}`] = !allEnabled
    })
    setSelectedSectors(newSelections)
  }

  const selectedDashboardScenario = useMemo(
    () => dashboardQueryScenarios.find((item) => item.id === selectedDashboardScenarioId) ?? dashboardQueryScenarios[0],
    [selectedDashboardScenarioId],
  )
  const recommendedMetricKeys = useMemo(
    () => getMetricKeysForScenario(selectedDashboardScenarioId),
    [selectedDashboardScenarioId],
  )
  const selectedMetricMeta = useMemo(
    () =>
      Object.entries(selectedSectors)
        .filter(([, isSelected]) => Boolean(isSelected))
        .map(([key]) => getMetricMeta(key))
        .filter((item): item is NonNullable<ReturnType<typeof getMetricMeta>> => Boolean(item)),
    [selectedSectors],
  )
  const dashboardSummary = useMemo(
    () => buildDashboardSummary(dashboardQuestion, selectedMetricMeta),
    [dashboardQuestion, selectedMetricMeta],
  )
  const analysisMessages = useMemo(
    () => [
      {
        id: "analysis-user",
        role: "user" as const,
        content: dashboardQuestion,
      },
      {
        id: "analysis-assistant",
        role: "assistant" as const,
        content: dashboardSummary.bullets,
      },
    ],
    [dashboardQuestion, dashboardSummary],
  )

  const applyDashboardScenario = (scenarioId: string, nextQuestion?: string) => {
    const scenario = dashboardQueryScenarios.find((item) => item.id === scenarioId)
    if (!scenario) return
    setSelectedDashboardScenarioId(scenario.id)
    setDashboardQuestion(nextQuestion ?? scenario.question)
    setFollowUpResponses(buildScenarioFollowUpSeed(scenario.id))
    setFollowUpQuestion("")
    setSelectedSectors({
      ...buildEmptySectorSelections(),
      ...scenario.selections,
    })
  }

  const runDashboardQuestion = () => {
    const scenarioId = inferDashboardScenarioId(dashboardQuestion)
    applyDashboardScenario(scenarioId, dashboardQuestion)
  }

  const toggleRecommendedMetric = (metricKey: string) => {
    setSelectedSectors((prev) => ({
      ...prev,
      [metricKey]: !prev[metricKey],
    }))
  }

  const submitFollowUpQuestion = () => {
    if (!followUpQuestion.trim()) return

    const answer = buildFollowUpAnswer(
      selectedDashboardScenarioId,
      followUpQuestion,
      selectedMetricMeta.map((item) => item.label),
    )

    setFollowUpResponses((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        question: followUpQuestion.trim(),
        answer,
      },
    ])
    setFollowUpQuestion("")
  }

  // 알림 관련 핸들러
  const addNewAlert = () => {
    let newAlert
    // alertCounter를 사용해서 처음 추가되는 5개는 핵심 운영 키워드 고정, 이후 랜덤으로 생성
    if (alertCounter < 5) {
      newAlert = {
        id: Date.now() + Math.random(),
        type: "keyword",
        icon: TrendingUp,
        title: "키워드 급상승",
        company: "리조트예약",
        message: "예약 문의 언급량이 1시간 내 250% 증가",
        time: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        isRead: false,
        timestamp: Date.now()
      }
    } else {
      newAlert = generateRandomAlert()
    }

    setAlerts(prev => [newAlert, ...prev].slice(0, 20)) // 최대 20개까지만 유지
    setAlertCounter(prev => prev + 1)

    // 슬라이딩 알림 표시
    setSlidingAlert(newAlert)
    // 약간의 지연을 두고 애니메이션 시작
    setTimeout(() => {
      setShowSlidingAlert(true)
    }, 10)

    // 3초 후 슬라이딩 알림 숨김
    setTimeout(() => {
      setShowSlidingAlert(false)
    }, 4000)
  }

  const markAlertAsRead = (alertId: number | string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    )
  }

  const handleAlertClick = (alert: any) => {
    // 알림을 읽음으로 표시
    markAlertAsRead(alert.id)

    // 핵심 운영 키워드 알림은 워드클라우드 탭으로 이동
    if (alert.company === "리조트예약" && alert.type === "keyword") {
      setActiveTab("wordcloud")
      setIsAlertPanelOpen(false) // 알림 패널 닫기
    }
  }

  const markAllAlertsAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })))
  }

  const getUnreadCount = () => {
    return alerts.filter(alert => !alert.isRead).length
  }

  const handleCorrelationAnalysis = (stockName: string, stockCode: string) => {
    // 상관관계 분석 고도화 페이지로 이동
    router.push('/catalyst')
  }

  const handleFilterChange = (type: 'source' | 'time', value: string) => {
    if (type === 'source') {
      setSourceFilter(value)
    } else {
      setTimeFilter(value)
    }
    setSelectedWord(null)
    setRelatedContentTab("news")
  }

  const getFilteredWordData = () => {
    if (sourceFilter === "all") {
      return baseWordData
    } else if (sourceFilter === "sns") {
      return baseWordData.map(([word, freq]) => [word, Math.floor((freq as number) * 0.8)])
    } else {
      return baseWordData.map(([word, freq]) => [word, Math.floor((freq as number) * 0.6)])
    }
  }

  // Wordcloud rendering is handled by WordCloudCanvas component

  // 이전 좌측 패널 타이핑 애니메이션 로직 제거됨

  // Resize handled within WordCloudCanvas

  // 방향키 왼쪽으로 새로운 알림 생성
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        addNewAlert()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const getRelatedItems = (word: string) => {
    const items = mockSNSNews[word as keyof typeof mockSNSNews] || []
    if (sourceFilter === "sns") {
      return items.filter(item => item.type === "SNS")
    } else if (sourceFilter === "news") {
      return items.filter(item => item.type === "뉴스")
    }
    return items
  }

  useEffect(() => {
    if (relatedSummaryIntervalRef.current) {
      clearInterval(relatedSummaryIntervalRef.current)
      relatedSummaryIntervalRef.current = null
    }

    if (!selectedWord) {
      setRelatedSummaryStreamingText("")
      setIsRelatedSummaryStreaming(false)
      return
    }

    const items = getRelatedItems(selectedWord)
    const aiSummaryItem = items.find(item => item.type === "AI 뉴스 요약")

    if (!aiSummaryItem) {
      setRelatedSummaryStreamingText("")
      setIsRelatedSummaryStreaming(false)
      return
    }

    const fullText = aiSummaryItem.content
    setIsRelatedSummaryStreaming(true)
    setRelatedSummaryStreamingText("")

    let currentIndex = 0
    const intervalId = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setRelatedSummaryStreamingText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        if (relatedSummaryIntervalRef.current) {
          clearInterval(relatedSummaryIntervalRef.current)
          relatedSummaryIntervalRef.current = null
        }
        setIsRelatedSummaryStreaming(false)
      }
    }, 20)

    relatedSummaryIntervalRef.current = intervalId

    return () => {
      clearInterval(intervalId)
    }
  }, [selectedWord, sourceFilter])

  const tabTriggerClass = "relative h-auto rounded-none border-0 bg-transparent px-0 pb-3 pt-2 text-base font-semibold text-[#5d6470] transition-colors hover:text-[#1a4dd6] data-[state=active]:text-[#1a4dd6] data-[state=active]:bg-transparent data-[state=active]:shadow-none after:absolute after:left-0 after:right-0 after:bottom-[-1px] after:h-[2px] after:bg-transparent data-[state=active]:after:bg-[#1a4dd6]"

  return (
    <div className="h-full overflow-auto">
    <div className="container mx-auto p-6 space-y-6 relative">
      {/* 헤더 섹션 */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              {activeTab === "wordcloud" && "이슈 키워드"}
              {activeTab === "dashboard" && "사내(시스템) 정보 분석"}
              {activeTab === "ai-insights" && "분석 리포트"}
            </h2>
          </div>

          {/* Generate Insight Button - Only show on AI Insights tab */}
          {activeTab === "ai-insights" && (
            <div className="flex items-center gap-3">
              <Button
                onClick={isGenerating ? handleStopGeneration : handleGenerateInsight}
                variant={isGenerating ? "destructive" : "default"}
                className={isGenerating ? "" : "bg-[#1a4dd6] hover:bg-[#1540b8] text-white"}
              >
                {isGenerating ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    중단
                  </>
                ) : (
                  "인사이트 생성"
                )}
              </Button>
              {isGenerating && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>생성 중...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 실시간 알림 아이콘 */}
        <Sheet open={isAlertPanelOpen} onOpenChange={setIsAlertPanelOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="relative p-3">
              <Bell className="h-10 w-10" />
              {getUnreadCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {getUnreadCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                실시간 운영 알림
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAlertsAsRead}
                  className="text-xs"
                >
                  모두 읽음
                </Button>
              </SheetTitle>
              <SheetDescription>
                실시간으로 주가, 거래량, 키워드 변화를 모니터링합니다
              </SheetDescription>
            </SheetHeader>

            {/* 알림 리스트 */}
            <div className="mt-6 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto px-2">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  알림이 없습니다
                </div>
              ) : (
                alerts.map((alert) => {
                  const IconComponent = alert.icon
                  return (
                    <div
                      key={alert.id}
                      className={`border rounded-lg p-4 mx-2 cursor-pointer transition-colors ${!alert.isRead
                        ? 'bg-primary/5 border-primary/40'
                        : 'bg-card border-border'
                        } hover:bg-muted/60`}
                      onClick={() => handleAlertClick(alert)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`rounded-full p-2 ${alert.type === 'stock' ? 'bg-green-100' :
                          alert.type === 'volume' ? 'bg-blue-100' : 'bg-purple-100'
                          }`}>
                          <IconComponent className={`h-4 w-4 ${alert.type === 'stock' ? 'text-green-600' :
                            alert.type === 'volume' ? 'text-blue-600' : 'text-purple-600'
                            }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {alert.title}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{alert.time}</span>
                          </div>
                          <p className="font-medium text-sm mb-1">{alert.company}</p>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          {!alert.isRead && (
                            <div className="mt-2">
                              <Badge variant="default" className="text-xs">새 알림</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="wordcloud" className="space-y-6 block">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
            <div className="space-y-6">
              <Card className="bg-card">
                <CardHeader className="space-y-4 bg-card pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">키워드 군집 시각화</CardTitle>
                      <CardDescription>실시간 언급량 기반으로 키워드 크기와 색상이 달라집니다.</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm text-[#1a4dd6] hover:text-[#153ad4]"
                      onClick={() => setSelectedWord(null)}
                    >
                      선택 초기화
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#6c7380]">소스</span>
                      {[
                        { label: "전체", value: "all" },
                        { label: "SNS만", value: "sns" },
                        { label: "뉴스만", value: "news" }
                      ].map((option) => (
                        <Button
                          key={option.value}
                          size="sm"
                          variant={sourceFilter === option.value ? "default" : "outline"}
                          className={`rounded-full px-4 ${sourceFilter === option.value ? "bg-[#1a4dd6] text-white hover:bg-[#153ad4]" : "border-[#d4d8e3] text-[#4f5665]"}`}
                          onClick={() => handleFilterChange("source", option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#6c7380]">기간</span>
                      {[
                        { label: "실시간", value: "realtime" },
                        { label: "일간", value: "daily" },
                        { label: "주간", value: "weekly" },
                        { label: "월간", value: "monthly" }
                      ].map((option) => (
                        <Button
                          key={option.value}
                          size="sm"
                          variant={timeFilter === option.value ? "default" : "outline"}
                          className={`rounded-full px-4 ${timeFilter === option.value ? "bg-[#1a4dd6] text-white hover:bg-[#153ad4]" : "border-[#d4d8e3] text-[#4f5665]"}`}
                          onClick={() => handleFilterChange("time", option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="bg-card">
                  <WordCloudCanvas
                    className="h-[420px] w-full rounded-xl border border-dashed border-border bg-muted/40"
                    list={getFilteredWordData() as any}
                    selectedWord={selectedWord}
                    onWordClick={(w) => w ? handleWordClick(w) : setSelectedWord(null)}
                    grayscaleOthers
                  />
                </CardContent>
              </Card>

              {selectedWord && (
                <Card className="bg-card">
                  <CardHeader className="bg-card pb-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <Badge variant="outline" className="mb-1 w-fit border-[#1a4dd6] text-[#1a4dd6]">
                          선택 키워드
                        </Badge>
                        <CardTitle className="text-2xl text-[#1a2a5b]">{selectedWord}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        {sourceFilter !== "all" && (
                          <Badge variant="secondary" className="bg-[#ecf0ff] text-[#1a4dd6]">
                            {sourceFilter.toUpperCase()}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="bg-[#f1f3f8] text-[#4f5665]">
                          {timeFilter === "realtime" ? "실시간" : timeFilter === "daily" ? "일간" : timeFilter === "weekly" ? "주간" : "월간"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs font-semibold text-[#1a4dd6]">AI 요약/분석</p>
                    <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm leading-relaxed text-foreground">
                      {(() => {
                        const relatedItems = getRelatedItems(selectedWord)
                        const aiSummary = relatedItems.find(item => item.type === "AI 뉴스 요약")
                        if (aiSummary) {
                          return (
                            <p className="whitespace-pre-line">
                              {isRelatedSummaryStreaming ? relatedSummaryStreamingText : (relatedSummaryStreamingText || aiSummary.content)}
                              {isRelatedSummaryStreaming && <span className="ml-1 animate-pulse">▌</span>}
                            </p>
                          )
                        }
                        if (relatedItems.length > 0) {
                          return <p className="whitespace-pre-line">{relatedItems[0].content}</p>
                        }
                        return <p>선택한 키워드에 대한 상세 요약을 준비 중입니다.</p>
                      })()}
                    </div>
                    {/* 관련 종목 및 연관 키워드 섹션 제거 */}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4 xl:max-h-[calc(100vh-200px)] xl:overflow-hidden">
              <Card className="bg-card xl:h-full xl:flex xl:flex-col xl:overflow-hidden">
                <CardHeader className="space-y-4 bg-card xl:flex-none">
                  <div>
                    <CardTitle className="text-xl">관련 뉴스/SNS</CardTitle>
                    <CardDescription>
                      {selectedWord ? `${selectedWord} 관련 최신 콘텐츠` : "키워드를 선택하면 관련 콘텐츠가 표시됩니다."}
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={relatedContentTab === "news" ? "default" : "outline"}
                      className={`rounded-full px-4 ${relatedContentTab === "news" ? "bg-[#1a4dd6] text-white hover:bg-[#153ad4]" : "border-[#d4d8e3] text-[#4f5665]"}`}
                      onClick={() => setRelatedContentTab("news")}
                    >
                      뉴스
                    </Button>
                    <Button
                      size="sm"
                      variant={relatedContentTab === "sns" ? "default" : "outline"}
                      className={`rounded-full px-4 ${relatedContentTab === "sns" ? "bg-[#1a4dd6] text-white hover:bg-[#153ad4]" : "border-[#d4d8e3] text-[#4f5665]"}`}
                      onClick={() => setRelatedContentTab("sns")}
                    >
                      SNS
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 xl:flex-1 xl:overflow-hidden">
                  {(() => {
                    if (!selectedWord) {
                      return (
                        <div className="space-y-4">

                          <div className="rounded-lg border border-border bg-card">
                            <div className="flex items-start justify-between px-4 py-3">
                              <p className="text-sm font-semibold text-foreground">인기 검색어 TOP 5</p>
                              <p className="text-xs text-muted-foreground">언급량 기준 상위 키워드</p>
                            </div>
                            <div className="divide-y divide-border/60">
                              {topPopularKeywords.map(([word, volume], index) => (
                                <div key={word} className="flex items-center justify-between px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                      {index + 1}
                                    </span>
                                    <span className="text-sm font-semibold text-foreground">{word}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    언급량 <span className="ml-1 font-semibold text-primary">{volume.toLocaleString('ko-KR')}</span>
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    }

                    const relatedItems = getRelatedItems(selectedWord)
                    const aiSummary = relatedItems.find(item => item.type === "AI 뉴스 요약")
                    const newsItems = relatedItems.filter(item => item.type === "뉴스")
                    const snsItems = relatedItems.filter(item => item.type === "SNS")
                    const listToRender = relatedContentTab === "news" ? newsItems : snsItems

                    return (
                      <div className="space-y-4 xl:flex xl:h-full xl:flex-col">
                        {/* AI 요약을 해당 섹션에서 제거하고, 선택 키워드 패널로 이동 */}

                        {listToRender.length === 0 ? (
                          <div className="rounded-lg border border-dashed border-[#d9def0] bg-[#f6f8ff] p-6 text-center text-sm text-muted-foreground">
                            표시할 {relatedContentTab === "news" ? "뉴스" : "SNS"} 콘텐츠가 없습니다.
                          </div>
                        ) : (
                          <div className="space-y-3 xl:flex-1 xl:overflow-y-auto xl:pr-2">
                            {listToRender.map(item => (
                              <div
                                key={item.id}
                                className="group cursor-pointer rounded-lg border border-[#e2e7f3] p-4 transition hover:border-[#1a4dd6] hover:shadow-sm"
                                onClick={() => handleItemClick(item.url)}
                              >
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{item.type}</span>
                                  <span>{item.date}</span>
                                </div>
                                <h4 className="mt-2 text-sm font-semibold text-[#1a274f] group-hover:text-[#1a4dd6]">
                                  {item.title}
                                </h4>
                                <p className="mt-1 text-sm text-[#4f5665] line-clamp-2">{item.content}</p>
                                <div className="mt-3 flex items-center gap-1 text-xs text-[#1a4dd6]">
                                  자세히 보기
                                  <ExternalLink className="h-3 w-3" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardHeader className="bg-card pb-4">
                  <CardTitle className="text-lg">관련 종목</CardTitle>
                  <CardDescription>워드클라우드와 연관된 글로벌 종목을 빠르게 확인하세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { symbol: "TSLA", name: "Tesla Inc" },
                    { symbol: "NVDA", name: "NVIDIA Corp." },
                    { symbol: "AAPL", name: "Apple Inc." }
                  ].map(stock => (
                    <div key={stock.symbol} className="flex items-center justify-between rounded-lg border border-border p-3 bg-card">
                      <div>
                        <p className="text-sm font-semibold text-[#1a274f]">{stock.symbol}</p>
                        <p className="text-xs text-muted-foreground">{stock.name}</p>
                      </div>
                      <Button size="sm" variant="outline" className="border-[#d4d8e3] text-[#1a4dd6] hover:border-[#1a4dd6]" onClick={() => handleCorrelationAnalysis(stock.name, stock.symbol)}>
                        상관관계 분석
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 대시보드 탭 */}
        <TabsContent value="dashboard" className="space-y-6 block">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>운영 데이터 질의</CardTitle>
              <CardDescription>매출 질의를 입력하면 관련 그래프와 분석 요약을 함께 확인할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-col gap-3 lg:flex-row">
                <Input
                  value={dashboardQuestion}
                  onChange={(event) => setDashboardQuestion(event.target.value)}
                  placeholder="예: 3월 리조트 매출 추이와 객실 점유율 변화를 함께 분석해줘."
                  className="h-11"
                />
                <Button className="h-11 bg-[#1a4dd6] hover:bg-[#1540b8] text-white" onClick={runDashboardQuestion}>
                  분석 실행
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {dashboardQueryScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => applyDashboardScenario(scenario.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      selectedDashboardScenarioId === scenario.id
                        ? "border-[#1a4dd6] bg-[#1a4dd6]/5"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    {scenario.summaryTitle}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <Card className="bg-muted/20 py-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">지표 선택</CardTitle>
                    <CardDescription>질의와 관련된 운영 지표를 직접 선택해 대시보드와 분석 요약에 반영할 수 있습니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {recommendedMetricKeys.map((metricKey) => {
                      const metric = getMetricMeta(metricKey)
                      if (!metric) return null

                      const active = Boolean(selectedSectors[metricKey])

                      return (
                        <button
                          key={metricKey}
                          type="button"
                          onClick={() => toggleRecommendedMetric(metricKey)}
                          className={`rounded-xl border px-4 py-4 text-left transition-all ${
                            active
                              ? "border-[#1a4dd6] bg-[#1a4dd6]/8 shadow-sm"
                              : "border-border bg-background hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Checkbox checked={active} className="pointer-events-none" />
                              <div className="text-xs text-muted-foreground">{metric.source}</div>
                            </div>
                            <div className={`rounded-full px-2 py-1 text-[11px] font-medium ${active ? "bg-[#1a4dd6] text-white" : "bg-muted text-muted-foreground"}`}>
                              {active ? "선택됨" : "선택 안 함"}
                            </div>
                          </div>
                          <div className="mt-3 text-sm font-semibold text-foreground">{metric.label}</div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            클릭하여 분석에 포함하거나 제외할 수 있습니다.
                          </div>
                        </button>
                      )
                    })}
                  </CardContent>
                </Card>

                <Card className="bg-muted/20 py-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">분석 결과</CardTitle>
                    <CardDescription>질의와 선택 지표를 바탕으로 생성된 분석 세션입니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {analysisMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`rounded-2xl border px-4 py-4 ${
                            message.role === "user"
                              ? "ml-8 bg-[#1a4dd6] text-white border-[#1a4dd6]"
                              : "mr-8 bg-background border-border"
                          }`}
                        >
                          <div className={`text-xs font-medium ${message.role === "user" ? "text-white/80" : "text-[#1a4dd6]"}`}>
                            {message.role === "user" ? "질문" : "분석 답변"}
                          </div>
                          {message.role === "user" ? (
                            <div className="mt-2 text-sm leading-6">{message.content}</div>
                          ) : (
                            <div className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                              {(message.content as string[]).map((point) => (
                                <div key={point} className="rounded-lg border bg-muted/20 px-4 py-3">
                                  • {point}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label htmlFor="follow-up-question">추가 질문</Label>
                      <div className="flex flex-col gap-3 lg:flex-row">
                        <Input
                          id="follow-up-question"
                          value={followUpQuestion}
                          onChange={(event) => setFollowUpQuestion(event.target.value)}
                          placeholder="예: 대응 방안은 어떻게 잡는 게 좋을까?"
                          className="h-10"
                        />
                        <Button variant="outline" className="h-10" onClick={submitFollowUpQuestion}>
                          질문하기
                        </Button>
                      </div>

                      {followUpResponses.length > 0 ? (
                        <div className="space-y-3">
                          {followUpResponses.map((item) => (
                            <div key={item.id} className="rounded-lg border bg-background p-4">
                              <div className="text-xs font-medium text-[#1a4dd6]">추가 질문</div>
                              <div className="mt-1 text-sm text-foreground">{item.question}</div>
                              <div className="mt-3 text-xs font-medium text-muted-foreground">분석 답변</div>
                              <div className="mt-1 text-sm leading-6 text-muted-foreground">{item.answer}</div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="bg-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>강원랜드 운영 데이터 대시보드</CardTitle>
                  <CardDescription>
                    선택한 지표를 기준으로 관련 그래프가 자동으로 구성됩니다.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  설정
                </Button>
              </div>
            </CardHeader>
            <CardContent className="bg-card">
              <DashboardCharts selectedSectors={selectedSectors} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI 인사이트 탭 */}
        <TabsContent value="ai-insights" className="space-y-6 block">
          <div className="h-[calc(100vh-150px)] overflow-y-auto">
            {viewMode === "list" ? (
              <InsightList onSelectInsight={handleSelectInsight} />
            ) : (
              <InsightView insight={selectedInsight} onBack={handleBackToList} />
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 슬라이딩 알림 */}
      {slidingAlert && (
        <div
          className={`fixed top-20 right-4 bg-card border border-border rounded-lg shadow-lg px-4 pt-4 pb-2 w-80 z-50 transform transition-all duration-300 cursor-pointer ${showSlidingAlert ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
          onClick={() => handleAlertClick(slidingAlert)}
        >
          <div className="flex items-start gap-3">
            <div className={`rounded-full p-2 ${slidingAlert.type === 'stock' ? 'bg-green-100' :
              slidingAlert.type === 'volume' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
              <slidingAlert.icon className={`h-4 w-4 ${slidingAlert.type === 'stock' ? 'text-green-600' :
                slidingAlert.type === 'volume' ? 'text-blue-600' : 'text-purple-600'
                }`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {slidingAlert.title}
                </Badge>
                <button
                  onClick={(e) => {
                    e.stopPropagation() // 이벤트 전파 방지
                    setShowSlidingAlert(false)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="font-medium text-sm mb-1">{slidingAlert.company}</p>
              <p className="text-sm text-muted-foreground">{slidingAlert.message}</p>
              <Badge variant="default" className="text-xs mt-2">실시간</Badge>
            </div>
          </div>
        </div>
      )}

      {/* 리포트 상세 모달 */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="!max-w-[82vw] max-h-[90vh] overflow-y-auto sm:!max-w-[45vw]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedReport?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedReport && selectedReport.id === 1 && (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{selectedReport.category}</Badge>
                  {selectedReport.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedReport.generatedAt} • {selectedReport.readTime} 읽기
                </div>
              </div>

              {/* 리포트 내용 */}
              <div className="prose prose-sm max-w-none">
                <h2 className="text-lg font-semibold mb-4">1. 이벤트 개요</h2>
                <p className="mb-4">
                  이번 운영 리포트는 객실 예약, 카지노 운영, 고객 문의, 지역 연계 데이터를 통합해
                  최근 강원랜드 주요 운영 지표의 변화를 요약한 결과입니다. 성수기 수요, 고객 체류,
                  보호 프로그램 안내, 현장 혼잡도까지 함께 살펴보는 데 목적이 있습니다.
                </p>

                <h3 className="text-md font-semibold mb-2">주요 발표 포인트</h3>
                <ul className="mb-6 ml-4 list-disc">
                  <li>객실 점유율과 평균 객실 단가가 함께 상승하며 성수기 수요가 확인됨</li>
                  <li>카지노 객장 이용 지표는 안정적이지만 시간대별 혼잡 편차가 큼</li>
                  <li>고객 문의는 예약 확인, 셔틀, 체크인 동선 문의에 집중됨</li>
                  <li>책임도박 안내 노출 이후 상담 연계 문의가 점진적으로 증가함</li>
                </ul>

                <p className="mb-6">
                  분석 결과 핵심은 단순 매출 증감보다 운영 병목과 고객 경험 저하 구간을 조기에 파악해
                  현장 대응과 메시지 자동화를 함께 연결하는 데 있습니다.
                </p>

                <h2 className="text-lg font-semibold mb-4">2. AI 기반 분석 인사이트</h2>

                <h3 className="text-md font-semibold mb-2">(1) 성수기 매출 기회 포착</h3>
                <ul className="mb-4 ml-4 list-disc">
                  <li>객실 점유율과 패키지 판매량이 함께 오를 때 부가매출 확대 효과가 가장 크게 나타남.</li>
                  <li>예약 수요가 높은 구간에 부대시설·셔틀 안내를 자동화하면 현장 문의를 줄일 수 있음.</li>
                  <li>리조트 운영 데이터와 멤버십 전환 데이터를 같이 보면 재방문 유도 포인트가 더 명확해짐.</li>
                </ul>

                <h3 className="text-md font-semibold mb-2">(2) 운영 병목 구간 식별</h3>
                <ul className="mb-4 ml-4 list-disc">
                  <li>고객 문의는 예약 자체보다 체크인 대기, 셔틀 위치, 시설 이용 방법에서 더 많이 발생함.</li>
                  <li>카지노 운영은 총량보다 시간대별 혼잡 편차가 더 큰 문제로 나타남.</li>
                  <li>운영 지표 이상 징후를 실시간 알림으로 연결하면 선제적 인력 배치가 가능함.</li>
                </ul>

                <h3 className="text-md font-semibold mb-2">(3) AI 해석 문구</h3>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="italic">"강원랜드 운영 데이터의 핵심은 수요 증가 자체보다, 고객 경험이 저하되는 병목을 얼마나 빠르게 발견하고 대응하느냐에 있다."</p>
                </div>

                <h2 className="text-lg font-semibold mb-4">3. 향후 체크 포인트</h2>

                <div className="grid gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">성수기 운영 점검</h4>
                    <ul className="ml-4 list-disc text-sm">
                      <li>객실 점유율과 평균 객실 단가 동반 상승 여부</li>
                      <li>패키지 판매가 부대시설 이용으로 이어지는지 여부</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">고객 응대 품질</h4>
                    <ul className="ml-4 list-disc text-sm">
                      <li>체크인 동선과 셔틀 안내 관련 VOC 감소 여부</li>
                      <li>예약 안내 메시지 자동화 이후 문의량 변화</li>
                      <li>책임도박 안내 메시지 노출 이후 상담 연계율 변화</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">지역 연계 확장성</h4>
                    <ul className="ml-4 list-disc text-sm">
                      <li>셔틀 이용객과 주변 상권 소비액의 상관관계</li>
                      <li>지역 행사 연계 프로모션이 주말 방문객 유입에 미치는 영향</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-lg font-semibold mb-4">4. 종합 평가</h2>
                <p className="mb-4">
                  이번 화면은 강원랜드 운영 데이터를 한 화면에서 질문하고, 주요 KPI 차트와 AI 요약을 함께 보는
                  데이터 분석 에이전트의 예시입니다.
                </p>
                <p className="mb-4">
                  현장 운영팀은 혼잡 구간과 고객 문의 원인을 빠르게 파악할 수 있고, 경영진은 월별 추세와
                  서비스 개선 우선순위를 함께 확인할 수 있습니다.
                </p>
                <p className="mb-6">
                  실제 서비스 단계에서는 ERP, 예약 시스템, 고객센터, 카지노 운영 DB를 연결해 더 정교한 분석으로 확장할 수 있습니다.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2">📌 결론</h3>
                  <p>
                    데이터 분석 에이전트의 가치는 단순 차트 조회가 아니라, 운영 데이터를 바탕으로
                    <strong>매출 기회, 고객 불편, 보호 이슈를 함께 해석해 실행 포인트까지 제시하는 것</strong>에 있습니다.
                  </p>
                </div>

                <h2 className="text-lg font-semibold mb-4">관련 이벤트 시뮬레이터</h2>
                <div className="mb-6">
                  <Card
                    className="hover:shadow-md transition-shadow bg-card cursor-pointer hover:border-primary/40 hover:bg-muted/40"
                    style={{
                      boxShadow: "0 0 10px rgba(21, 58, 212, 0.04)"
                    }}
                    onClick={() => {
                      router.push('/event-analysis')
                    }}
                  >
                    <CardContent className="px-6 py-4 bg-card">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-base">성수기 예약 급증 시 운영 영향 분석</h3>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                              긍정
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            주말 예약 수요 급증 시 체크인 대기, 셔틀 운영, 고객 문의 증가가 전체 운영에 미치는 영향 시뮬레이션
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">
                              <Globe className="h-3 w-3 mr-1" />
                              한국
                            </Badge>
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              1일
                            </Badge>
                            <Badge className="text-xs" style={{ backgroundColor: '#F0F4FA', color: '#153AD4' }}>
                              예약
                            </Badge>
                            <Badge className="text-xs" style={{ backgroundColor: '#F0F4FA', color: '#153AD4' }}>
                              운영
                            </Badge>
                            <Badge className="text-xs" style={{ backgroundColor: '#F0F4FA', color: '#153AD4' }}>
                              고객경험
                            </Badge>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <Button
                            className="flex items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/event-analysis')
                            }}
                          >
                            <Play className="h-4 w-4" />
                            시뮬레이션 실행
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 표 */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">구분</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">주요 내용</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">운영 관점 핵심 질문</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">리조트 운영</td>
                        <td className="border border-gray-300 px-4 py-2">객실 점유율, 객단가, 패키지 전환율</td>
                        <td className="border border-gray-300 px-4 py-2">"성수기 수요를 실제 매출 기회로 얼마나 전환하고 있는가?"</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">고객 서비스</td>
                        <td className="border border-gray-300 px-4 py-2">VOC 해결률, 체크인 문의, 셔틀 안내 문의</td>
                        <td className="border border-gray-300 px-4 py-2">"고객 불편이 가장 많이 발생하는 지점은 어디인가?"</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">카지노 운영</td>
                        <td className="border border-gray-300 px-4 py-2">테이블 드롭액, 슬롯 이용률, VIP 방문객</td>
                        <td className="border border-gray-300 px-4 py-2">"시간대별 혼잡과 고객 체류를 어떻게 최적화할 것인가?"</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">보호/연계</td>
                        <td className="border border-gray-300 px-4 py-2">책임도박 상담 연계율, 지역 연계 소비, 셔틀 이용률</td>
                        <td className="border border-gray-300 px-4 py-2">"보호 프로그램과 지역 연계 효과를 어떻게 확장할 것인가?"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 설정 모달 */}
      <MarketSensingSettingsModal
        open={isSettingsModalOpen}
        onOpenChange={setIsSettingsModalOpen}
      />
    </div>
    </div>
  )
}
