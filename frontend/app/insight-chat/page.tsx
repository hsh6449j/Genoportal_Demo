"use client"

import { Suspense, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Braces, Code2, Home, Sparkles } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import PDFViewer from "@/components/pdf-viewer"
import { useChat } from "@/hooks/use-chat"
import { ChatList } from "@/components/chat/chat-list"
import { ChatInput } from "@/components/chat/chat-input"
import { Message } from "@/lib/event-system"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { assistantPromptSuggestions, getAssistantPresetMessages } from "@/lib/assistant-demo-history"
import { compliancePromptSuggestions, getCompliancePresetMessages } from "@/lib/compliance-demo-history"
import { developmentPromptSuggestions, getDevelopmentPresetMessages } from "@/lib/development-demo-history"
import { staffSearchPromptSuggestions, getStaffSearchPresetMessages } from "@/lib/staff-search-demo-history"

function extractLatestCodePreview(messages: Message[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const current = messages[index]
    if (current.role !== "assistant") continue

    const matches = [...current.content.matchAll(/```([\w-]+)?\n([\s\S]*?)```/g)]
    if (matches.length === 0) continue

    const lastMatch = matches[matches.length - 1]
    const language = lastMatch[1] || "text"
    const code = lastMatch[2].trim()
    const summary = current.content
      .replace(/```[\w-]*\n[\s\S]*?```/g, "")
      .trim()
      .split("\n")
      .filter(Boolean)
      .slice(0, 3)
      .join(" ")

    return { language, code, summary }
  }

  return null
}

function createSeedMessages(agent: string | null, feature: string | null): Message[] {
  const sessionId = `seed-${agent || "assistant"}`
  const baseTime = new Date("2026-03-23T09:00:00+09:00")

  if (agent === "compliance" && feature === "policy-search") {
    return [
      {
        id: "policy-search-user-1",
        role: "user",
        content: "복무규정에서 연차 사용 기준을 규정명과 조항까지 포함해 설명해줘.",
        timestamp: baseTime,
        sessionId,
      },
      {
        id: "policy-search-assistant-1",
        role: "assistant",
        content: [
          "연차는 발생 일수와 잔여 일수를 확인한 뒤, 사전 승인 절차에 따라 사용할 수 있습니다.",
          "",
          "답변은 아래 기준으로 확인하시면 됩니다.",
          "",
          "- 당해 연도 발생 연차와 잔여 일수를 먼저 확인합니다.",
          "- 부서장 승인 여부와 업무 인수인계 필요성을 함께 검토합니다.",
          "- 반차·반반차 사용 가능 여부는 운영 지침을 추가 확인합니다.",
          "",
          "---",
          "",
          "#### 관련 레퍼런스",
          "",
          "- 규정명: 복무규정",
          "- 근거 조항: 제14조(연차휴가) 제1항, 제3항",
          "- 시행일: 2025-01-01",
          "",
          "#### 참고 원문",
          "",
          "> 직원은 연차휴가 발생 범위 내에서 소속 부서장의 승인을 받아 휴가를 사용할 수 있다.",
          "",
          "※ 본 답변은 AI가 생성한 참고 문안이며, 반드시 담당자의 검토, 승인을 거쳐야 합니다.",
        ].join("\n"),
        timestamp: new Date(baseTime.getTime() + 60_000),
        sessionId,
        isMarkdown: true,
      },
    ]
  }

  if (agent === "assistant" && feature === "staff-search") {
    return [
      {
        id: "staff-search-user-1",
        role: "user",
        content: "개인회생 신청 후 보완 서류 문의가 들어왔어. 우선 연결할 담당자를 찾아줘.",
        timestamp: baseTime,
        sessionId,
      },
      {
        id: "staff-search-assistant-1",
        role: "assistant",
        content: [
          "개인회생 보완 서류 문의는 아래 순서로 배정하는 것이 적절합니다.",
          "",
          "### 1차 추천 담당자",
          "- 성명: 김하늘",
          "- 부서: 채무조정지원부",
          "- 역할: 개인회생 접수 및 보완 서류 검토",
          "- 연락처: 내선 2184 / 02-0000-2184",
          "",
          "### 2차 협업 담당자",
          "- 성명: 박정우",
          "- 부서: 민원지원센터",
          "- 역할: 접수 상태 확인 및 민원 응대",
          "- 연락처: 내선 1107",
          "",
          "### 배정 기준",
          "- 보완 서류의 적정성 검토가 필요한 경우 채무조정지원부를 우선 배정합니다.",
          "- 진행 상태 확인만 필요한 경우 민원지원센터에서 1차 응대 후 이관할 수 있습니다.",
        ].join("\n"),
        timestamp: new Date(baseTime.getTime() + 60_000),
        sessionId,
        isMarkdown: true,
      },
    ]
  }

  if (agent === "development") {
    return [
      {
        id: "development-user-1",
        role: "user",
        content: "상담 안내 메시지 생성 API를 만든다고 가정하면 요청/응답 구조를 예시로 작성해줘.",
        timestamp: baseTime,
        sessionId,
      },
      {
        id: "development-assistant-1",
        role: "assistant",
        content: [
          "아래처럼 단순한 JSON 구조로 시작하면 데모와 실제 확장 모두 대응하기 좋습니다.",
          "",
          "POST /api/customer-support/reservation-message",
          "",
          "요청 예시",
          "```json",
          "{",
          '  "reservationId": "RSV-20260323-001",',
          '  "customerName": "홍길동",',
          '  "checkInDate": "2026-03-28",',
          '  "checkOutDate": "2026-03-29",',
          '  "scenario": "민원 접수 후 초기 안내"',
          "}",
          "```",
          "",
          "응답 예시",
          "```json",
          "{",
          '  "messageTitle": "민원 안내",',
          '  "messageBody": "안녕하세요. 신용회복위원회입니다. 상담 일정과 준비 서류를 안내드립니다.",',
          '  "channels": ["sms", "kakao"],',
          '  "generatedAt": "2026-03-23T09:01:00+09:00"',
          "}",
          "```",
        ].join("\n"),
        timestamp: new Date(baseTime.getTime() + 60_000),
        sessionId,
        isMarkdown: true,
      },
    ]
  }

  return []
}

function InsightChatPageContent() {
  const searchParams = useSearchParams()
  const initialMessage = searchParams.get('message') || undefined
  const agent = searchParams.get("agent")
  const preset = searchParams.get("preset")
  const feature = searchParams.get("feature")
  const title =
    agent === "compliance"
      ? feature === "policy-search"
        ? "사내규정 검색"
        : "상담지식 에이전트"
      : agent === "development"
        ? "개발 지원"
        : feature === "staff-search"
          ? "업무담당자 검색"
          : feature === "partner-search"
            ? "협약기관 검색"
            : "민원상담 어시스턴트"
  const historyKey =
    agent === "compliance"
      ? preset
        ? `genportal.chat.compliance.preset.${preset}.v1`
        : "genportal.chat.compliance.current.v1"
      : agent === "development"
        ? preset
          ? `genportal.chat.development.preset.${preset}.v1`
          : "genportal.chat.development.current.v1"
        : feature === "staff-search"
          ? "genportal.chat.assistant.staff-search.current.v1"
          : feature === "partner-search"
            ? "genportal.chat.assistant.partner-search.current.v1"
        : preset
          ? `genportal.chat.assistant.preset.${preset}.v3`
          : "genportal.chat.assistant.current.v3"
  const seedMessages = useMemo(() => createSeedMessages(agent, feature), [agent, feature])
  const presetMessages = useMemo(
    () =>
      agent === "development"
        ? getDevelopmentPresetMessages(preset)
        : agent === "compliance"
          ? getCompliancePresetMessages(preset)
          : feature === "staff-search"
            ? getStaffSearchPresetMessages(preset)
          : feature === "counseling" || !feature
            ? getAssistantPresetMessages(preset)
            : null,
    [agent, feature, preset],
  )
  const promptSuggestions =
    agent === "development"
      ? developmentPromptSuggestions
        : agent === "compliance"
          ? compliancePromptSuggestions
        : feature === "staff-search"
          ? staffSearchPromptSuggestions
          : feature === "partner-search"
            ? [
                "신용회복 지원 협약기관 검색 예시를 보여줘.",
                "기관명이 정확하지 않을 때 후보 목록을 제시하는 예시를 보여줘.",
                "협약기관 담당자 정보를 찾는 질의 예시를 보여줘.",
              ]
            : assistantPromptSuggestions

  const {
    message,
    setMessage,
    setMessages,
    messages,
    isLoading,
    activeSteps,
    sourceDocuments,
    toolState,
    pdfViewer,
    messagesEndRef,
    messagesAreaRef,
    handleSendMessage,
    showPDFViewer,
    closePDFViewer,
    processContentWithPDFCitations
  } = useChat({ initialMessage, disableAutoScroll: true, historyKey, seedMessages })
  const latestCodePreview = useMemo(() => extractLatestCodePreview(messages), [messages])

  useEffect(() => {
    if (agent === "assistant" || !agent || agent === "compliance" || agent === "development") {
      if (presetMessages) {
        setMessages(presetMessages)
      }
    }
  }, [agent, presetMessages, setMessages])

  const handleSend = () => {
    if (message.trim()) {
      handleSendMessage(message)
    }
  }

  return (
    <div className="h-full bg-background flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-[#153AD4] hover:text-white hover:border-[#153AD4] transition-colors">
              <Home className="h-4 w-4" />
              홈으로
            </Button>
          </Link>
        </div>
      </div>

      {agent === "development" ? (
        <div className="mx-auto flex h-full w-full max-w-7xl flex-1 gap-6 overflow-hidden px-6 py-6">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-background">
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>개발 지원 대화</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto" ref={messagesAreaRef}>
              {messages.length === 0 ? (
                <div className="mx-auto flex h-full w-full max-w-4xl items-center px-8 py-14">
                  <div className="w-full">
                    <Card className="min-h-[430px] py-0">
                      <CardHeader className="px-8 pb-4 pt-8">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Sparkles className="h-4 w-4" />
                          <span className="text-sm">추천 요청</span>
                        </div>
                        <CardTitle>바로 시작할 개발 요청</CardTitle>
                        <CardDescription>
                          채팅으로 요청하면 오른쪽에서 생성 코드 예시를 함께 확인할 수 있습니다.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5 px-8 pb-8">
                        <div className="grid gap-4 md:grid-cols-1">
                          {promptSuggestions.map((prompt) => (
                            <button
                              key={prompt}
                              onClick={() => setMessage(prompt)}
                              className="w-full rounded-2xl border border-border bg-card px-7 py-7 text-left text-sm leading-7 transition-colors hover:bg-muted"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <ChatList
                  messages={messages}
                  activeSteps={activeSteps}
                  sourceDocuments={sourceDocuments}
                  toolState={toolState}
                  pdfViewer={pdfViewer}
                  isLoading={isLoading}
                  messagesEndRef={messagesEndRef}
                  onPDFClick={showPDFViewer}
                  processContentWithPDFCitations={processContentWithPDFCitations}
                />
              )}
            </div>
            <ChatInput
              message={message}
              setMessage={setMessage}
              handleSend={handleSend}
              isLoading={isLoading}
            />
          </div>

          <div className="hidden w-[420px] shrink-0 lg:block">
            <Card className="flex h-full flex-col overflow-hidden py-0">
              <CardHeader className="border-b border-border bg-muted/30">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Code2 className="h-4 w-4" />
                  <span className="text-sm">코드 미리보기</span>
                </div>
                <CardTitle>생성 코드 결과</CardTitle>
                <CardDescription>
                  채팅 응답에 포함된 최신 코드 블록을 이 영역에 표시합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-6">
                {latestCodePreview ? (
                  <>
                    <div className="flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Braces className="h-4 w-4 text-[#153AD4]" />
                        {latestCodePreview.language.toUpperCase()}
                      </div>
                      <div className="text-xs text-muted-foreground">최신 생성 결과</div>
                    </div>
                    {latestCodePreview.summary ? (
                      <div className="rounded-xl border bg-background px-4 py-3 text-sm leading-6 text-muted-foreground">
                        {latestCodePreview.summary}
                      </div>
                    ) : null}
                    <div className="min-h-0 flex-1 overflow-auto rounded-2xl border bg-slate-950 p-4">
                      <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-slate-100">
                        {latestCodePreview.code}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-8 text-center text-sm leading-6 text-muted-foreground">
                    코드가 생성되면 이 영역에서 API, SQL, 스크립트 예시를 바로 확인할 수 있습니다.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto" ref={messagesAreaRef}>
            {messages.length === 0 ? (
              <div className="mx-auto flex h-full w-full max-w-6xl items-center px-8 py-14">
                <div className="w-full">
                  <Card className="min-h-[430px] py-0">
                    <CardHeader className="px-8 pb-4 pt-8">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm">추천 질문</span>
                      </div>
                      <CardTitle>바로 시작할 질문</CardTitle>
                      <CardDescription>
                        아래 질문을 눌러 입력창에 바로 불러올 수 있습니다.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5 px-8 pb-8">
                      <div className="grid gap-4 md:grid-cols-1">
                        {promptSuggestions.map((prompt) => (
                          <button
                            key={prompt}
                            onClick={() => setMessage(prompt)}
                            className="w-full rounded-2xl border border-border bg-card px-7 py-7 text-left text-sm leading-7 transition-colors hover:bg-muted"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <ChatList
                messages={messages}
                activeSteps={activeSteps}
                sourceDocuments={sourceDocuments}
                toolState={toolState}
                pdfViewer={pdfViewer}
                isLoading={isLoading}
                messagesEndRef={messagesEndRef}
                onPDFClick={showPDFViewer}
                processContentWithPDFCitations={processContentWithPDFCitations}
              />
            )}
          </div>

          {/* Input Area */}
          <ChatInput
            message={message}
            setMessage={setMessage}
            handleSend={handleSend}
            isLoading={isLoading}
          />
        </>
      )}

      {/* PDF Viewer */}
      <PDFViewer
        isVisible={pdfViewer.isVisible}
        filename={pdfViewer.filename}
        filePath={pdfViewer.currentPDF}
        onClose={closePDFViewer}
      />
    </div>
  )
}

export default function InsightChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InsightChatPageContent />
    </Suspense>
  )
}
