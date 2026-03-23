"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Headset, Copy, History, Loader2, Check, RotateCcw, PanelRightOpen, PanelRightClose } from "lucide-react"

type TemplateKey = "booking-confirmation" | "check-in-guide" | "facility-guide"

type FormattingTemplate = {
  id: string
  key: TemplateKey
  title: string
  description: string
}

type ReservationForm = {
  guestName: string
  reservationId: string
  roomType: string
  roomTypeDetail: string
  checkInDate: string
  checkOutDate: string
  contactChannel: string
  requestNote: string
}

type HistoryItem = {
  id: string
  timestamp: number
  template: TemplateKey
  templateTitle: string
  form: ReservationForm
  output: string
}

const HISTORY_KEY = "formatting_history_v2"
const FORMAT_TEMPLATES_KEY = "formatting_templates_v2"

const DEFAULT_FORMAT_TEMPLATES: FormattingTemplate[] = [
  {
    id: "booking-confirmation",
    key: "booking-confirmation",
    title: "예약 확인 안내",
    description: "예약 완료 직후 발송하는 확인 메시지",
  },
  {
    id: "check-in-guide",
    key: "check-in-guide",
    title: "체크인 안내",
    description: "체크인 시간, 준비사항, 문의처 안내",
  },
  {
    id: "facility-guide",
    key: "facility-guide",
    title: "부대시설 안내",
    description: "셔틀, 조식, 부대시설 이용 정보를 함께 정리",
  },
]

const ROOM_TYPE_OPTIONS = [
  "하이원 그랜드 호텔 디럭스",
  "하이원 그랜드 호텔 스위트",
  "콘도 패밀리룸",
  "콘도 스위트룸",
  "하이원 팰리스 스탠다드",
  "기타",
]

const INITIAL_FORM: ReservationForm = {
  guestName: "",
  reservationId: "",
  roomType: "",
  roomTypeDetail: "",
  checkInDate: "",
  checkOutDate: "",
  contactChannel: "문자",
  requestNote: "",
}

const DEMO_HISTORY: Array<{ template: TemplateKey; form: ReservationForm }> = [
  {
    template: "booking-confirmation",
    form: {
      guestName: "김민수",
      reservationId: "RSV-20260325-014",
      roomType: "하이원 그랜드 호텔 디럭스",
      roomTypeDetail: "",
      checkInDate: "2026-03-28",
      checkOutDate: "2026-03-29",
      contactChannel: "카카오 알림톡",
      requestNote: "주차 안내와 체크인 시간을 함께 포함",
    },
  },
  {
    template: "check-in-guide",
    form: {
      guestName: "이서연",
      reservationId: "RSV-20260401-021",
      roomType: "콘도 패밀리룸",
      roomTypeDetail: "",
      checkInDate: "2026-04-03",
      checkOutDate: "2026-04-05",
      contactChannel: "문자",
      requestNote: "늦은 체크인 예정 고객이라 프런트 문의처를 강조",
    },
  },
]

function formatDateLabel(value: string) {
  if (!value) return ""
  return value.replaceAll("-", ".")
}

function getRoomTypeLabel(form: Pick<ReservationForm, "roomType" | "roomTypeDetail">) {
  if (form.roomType === "기타") {
    return form.roomTypeDetail.trim() || "기타 객실"
  }

  return form.roomType || "예약 객실"
}

function buildReservationMessage(template: TemplateKey, form: ReservationForm) {
  const checkIn = formatDateLabel(form.checkInDate)
  const checkOut = formatDateLabel(form.checkOutDate)
  const roomTypeLabel = getRoomTypeLabel(form)

  if (template === "booking-confirmation") {
    return [
      `[예약 확인 안내] ${form.guestName || "고객"}님`,
      "",
      `안녕하세요. 강원랜드입니다.`,
      `${checkIn} ~ ${checkOut} 예약이 정상적으로 접수되었습니다.`,
      `예약번호는 ${form.reservationId || "RSV-XXXX"}이며, 객실은 ${roomTypeLabel} 기준으로 준비될 예정입니다.`,
      "",
      `체크인은 오후 3시부터 가능하며, 이용 전 안내가 필요하신 경우 고객센터로 문의 부탁드립니다.`,
      form.requestNote ? `추가 안내: ${form.requestNote}` : "",
      "",
      `${form.contactChannel} 발송용 기준으로 정리한 메시지입니다.`,
      "감사합니다.",
    ]
      .filter(Boolean)
      .join("\n")
  }

  if (template === "check-in-guide") {
    return [
      `[체크인 안내] ${form.guestName || "고객"}님`,
      "",
      `안녕하세요. 강원랜드입니다.`,
      `${checkIn} 체크인 예정 고객님께 이용 안내드립니다.`,
      `객실 유형: ${roomTypeLabel}`,
      `예약번호: ${form.reservationId || "RSV-XXXX"}`,
      "",
      "1. 체크인 안내",
      "- 체크인 시작 시간: 오후 3시",
      "- 체크아웃 시간: 오전 11시",
      "",
      "2. 문의 및 유의사항",
      "- 프런트 데스크 또는 고객센터에서 예약 확인 가능",
      "- 성수기에는 체크인 대기 시간이 발생할 수 있어 여유 있게 방문 권장",
      form.requestNote ? `- 추가 메모: ${form.requestNote}` : "",
      "",
      `${form.contactChannel} 발송용 기준으로 정리한 메시지입니다.`,
    ]
      .filter(Boolean)
      .join("\n")
  }

  return [
    `[부대시설 안내] ${form.guestName || "고객"}님`,
    "",
    `안녕하세요. 강원랜드입니다.`,
    `${checkIn} ~ ${checkOut} 투숙 기간 중 이용 가능한 주요 부대시설을 안내드립니다.`,
    "",
    "- 조식, 셔틀, 부대시설 운영시간은 현장 상황에 따라 일부 조정될 수 있습니다.",
    `- 예약 객실: ${roomTypeLabel}`,
    `- 예약번호: ${form.reservationId || "RSV-XXXX"}`,
    form.requestNote ? `- 참고사항: ${form.requestNote}` : "",
    "",
    "자세한 내용은 고객센터 또는 체크인 데스크에서 확인 부탁드립니다.",
    `${form.contactChannel} 발송용 기준으로 정리한 메시지입니다.`,
  ]
    .filter(Boolean)
    .join("\n")
}

export function FormattingTool() {
  const { toast } = useToast()
  const [template, setTemplate] = useState<TemplateKey>("booking-confirmation")
  const [templates, setTemplates] = useState<FormattingTemplate[]>([])
  const [form, setForm] = useState<ReservationForm>(INITIAL_FORM)
  const [isGenerating, setIsGenerating] = useState(false)
  const [output, setOutput] = useState("")
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(true)

  useEffect(() => {
    try {
      const rawTemplates = localStorage.getItem(FORMAT_TEMPLATES_KEY)
      if (rawTemplates) {
        const parsed = JSON.parse(rawTemplates) as FormattingTemplate[]
        setTemplates(parsed.length ? parsed : DEFAULT_FORMAT_TEMPLATES)
      } else {
        setTemplates(DEFAULT_FORMAT_TEMPLATES)
      }

      const rawHistory = localStorage.getItem(HISTORY_KEY)
      if (rawHistory) {
        const parsed = JSON.parse(rawHistory) as HistoryItem[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed)
          return
        }
      }

      const seededHistory = DEMO_HISTORY.map((item, index) => {
        const templateMeta =
          DEFAULT_FORMAT_TEMPLATES.find((templateItem) => templateItem.key === item.template) || DEFAULT_FORMAT_TEMPLATES[0]

        return {
          id: `demo-resort-${item.template}-${index}`,
          timestamp: Date.now() - index * 60 * 60 * 1000,
          template: item.template,
          templateTitle: templateMeta.title,
          form: item.form,
          output: buildReservationMessage(item.template, item.form),
        }
      })
      setHistory(seededHistory)
    } catch {
      setTemplates(DEFAULT_FORMAT_TEMPLATES)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(FORMAT_TEMPLATES_KEY, JSON.stringify(templates))
    } catch {}
  }, [templates])

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    } catch {}
  }, [history])

  const hasInput = Object.values(form).some((value) => value.trim().length > 0)
  const selectedTemplateMeta = useMemo(
    () => templates.find((item) => item.key === template) || DEFAULT_FORMAT_TEMPLATES[0],
    [template, templates],
  )

  const updateField = (field: keyof ReservationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const applyHistory = (item: HistoryItem) => {
    setTemplate(item.template)
    setForm({ ...INITIAL_FORM, ...item.form })
    setOutput(item.output)
  }

  const generateOutput = async () => {
    if (!form.guestName.trim()) {
      toast({ description: "고객명을 입력해주세요." })
      return
    }

    if (!form.checkInDate.trim()) {
      toast({ description: "체크인 일자를 입력해주세요." })
      return
    }

    setIsGenerating(true)
    try {
      const message = buildReservationMessage(template, form)
      setOutput(message)
      setHistory((prev) => [
        {
          id: `${Date.now()}`,
          timestamp: Date.now(),
          template,
          templateTitle: selectedTemplateMeta.title,
          form: { ...form },
          output: message,
        },
        ...prev,
      ].slice(0, 30))
      toast({ description: "예약 안내 메시지를 생성했습니다." })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyOutput = async () => {
    if (!output.trim()) return
    try {
      await navigator.clipboard.writeText(output)
      toast({ description: "클립보드에 복사되었습니다." })
    } catch {
      toast({ description: "복사에 실패했습니다." })
    }
  }

  const resetRequest = () => {
    setForm(INITIAL_FORM)
    setOutput("")
    setIsGenerating(false)
    toast({ description: "초기화했습니다." })
  }

  return (
    <div className="h-full w-full bg-background overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headset className="h-5 w-5" />
            <h1 className="text-xl font-bold">리조트 예약 안내 작성</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHistory((value) => !value)}
            title={showHistory ? "히스토리 숨기기" : "히스토리 보이기"}
          >
            {showHistory ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>안내 유형</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {templates.map((item) => {
                  const active = item.key === template
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setTemplate(item.key)
                        setOutput("")
                      }}
                      className={`w-full rounded-md border p-3 text-left transition-colors ${
                        active
                          ? "border-primary bg-primary/10 text-primary dark:bg-primary/20"
                          : "border-border bg-card hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {active ? <Check className="mt-0.5 h-4 w-4 text-blue-600" /> : <span className="mt-1 inline-block h-4 w-4 rounded border" />}
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          <div className={showHistory ? "lg:col-span-6" : "lg:col-span-9"}>
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>예약 정보 입력</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="guest-name">고객명</Label>
                    <Input
                      id="guest-name"
                      value={form.guestName}
                      onChange={(event) => updateField("guestName", event.target.value)}
                      placeholder="예: 김민수"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reservation-id">예약번호</Label>
                    <Input
                      id="reservation-id"
                      value={form.reservationId}
                      onChange={(event) => updateField("reservationId", event.target.value)}
                      placeholder="예: RSV-20260325-014"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-type">객실 유형</Label>
                    <Select
                      value={form.roomType}
                      onValueChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          roomType: value,
                          roomTypeDetail: value === "기타" ? prev.roomTypeDetail : "",
                        }))
                      }
                    >
                      <SelectTrigger id="room-type">
                        <SelectValue placeholder="객실 유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROOM_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-channel">발송 채널</Label>
                    <Select value={form.contactChannel} onValueChange={(value) => updateField("contactChannel", value)}>
                      <SelectTrigger id="contact-channel">
                        <SelectValue placeholder="발송 채널 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="문자">문자</SelectItem>
                        <SelectItem value="카카오 알림톡">카카오 알림톡</SelectItem>
                        <SelectItem value="이메일">이메일</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="check-in-date">체크인 일자</Label>
                    <Input
                      id="check-in-date"
                      value={form.checkInDate}
                      onChange={(event) => updateField("checkInDate", event.target.value)}
                      placeholder="예: 2026-03-28"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="check-out-date">체크아웃 일자</Label>
                    <Input
                      id="check-out-date"
                      value={form.checkOutDate}
                      onChange={(event) => updateField("checkOutDate", event.target.value)}
                      placeholder="예: 2026-03-29"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    {form.roomType === "기타" ? (
                      <div className="space-y-2">
                        <Label htmlFor="room-type-detail">객실 유형 직접 입력</Label>
                        <Input
                          id="room-type-detail"
                          value={form.roomTypeDetail}
                          onChange={(event) => updateField("roomTypeDetail", event.target.value)}
                          placeholder="예: 펫 프렌들리 스위트"
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="request-note">추가 요청사항</Label>
                    <Textarea
                      id="request-note"
                      value={form.requestNote}
                      onChange={(event) => updateField("requestNote", event.target.value)}
                      placeholder="예: 늦은 체크인 예정이라 문의처를 강조하고, 주차 안내를 함께 포함"
                      className="min-h-[120px]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={generateOutput} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 생성 중...
                      </>
                    ) : (
                      "안내 메시지 생성"
                    )}
                  </Button>
                  <Button variant="secondary" onClick={copyOutput} disabled={!output.trim()}>
                    <Copy className="mr-2 h-4 w-4" /> 답변 복사
                  </Button>
                  <Button variant="outline" onClick={resetRequest} disabled={!hasInput && !output.trim()}>
                    <RotateCcw className="mr-2 h-4 w-4" /> 새 요청
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>생성된 예약 안내 메시지</Label>
                  <Textarea
                    value={output}
                    onChange={(event) => setOutput(event.target.value)}
                    className="min-h-[280px]"
                    placeholder="여기에 생성된 예약 안내 메시지가 표시됩니다."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {showHistory ? (
            <div className="lg:col-span-3">
              <Card className="h-full bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <CardTitle>예약 안내 히스토리</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {history.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">내역이 없습니다.</div>
                  ) : (
                    <div className="max-h-[640px] space-y-3 overflow-auto pr-1">
                      {history.map((item) => (
                        <div key={item.id} className="rounded border border-border p-3 hover:bg-muted/60">
                          <div className="text-[11px] text-muted-foreground">
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                          <div className="mt-1 inline-flex rounded-full border border-border bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                            {item.templateTitle}
                          </div>
                          <div className="mt-2 text-sm font-medium">{item.form.guestName || "고객"}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {item.form.checkInDate || "-"} / {getRoomTypeLabel(item.form)}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => applyHistory(item)}>
                              열기
                            </Button>
                            <Button
                              size="sm"
                              onClick={async () => {
                                await navigator.clipboard.writeText(item.output)
                                toast({ description: "복사되었습니다." })
                              }}
                            >
                              복사
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
