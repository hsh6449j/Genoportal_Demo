import { Message } from "@/lib/event-system"

type AssistantHistoryPreset = {
  id: string
  title: string
  description: string
  messages: Message[]
}

function buildMessages(sessionId: string, baseTimeIso: string, userContent: string, assistantContent: string): Message[] {
  const baseTime = new Date(baseTimeIso)

  return [
    {
      id: `${sessionId}-user`,
      role: "user",
      content: userContent,
      timestamp: baseTime,
      sessionId,
    },
    {
      id: `${sessionId}-assistant`,
      role: "assistant",
      content: assistantContent,
      timestamp: new Date(baseTime.getTime() + 60_000),
      sessionId,
    },
  ]
}

export const assistantPromptSuggestions = [
  "사내 공지 메일 제목 3개를 정중한 톤으로 추천해줘.",
  "고객 문의 답변 문장을 더 친절하고 간결하게 바꿔줘.",
  "일정 변경 안내 문구를 짧고 부드럽게 다듬어줘.",
]

export const assistantHistoryPresets: AssistantHistoryPreset[] = [
  {
    id: "notice-title",
    title: "공지 메일 제목 정리",
    description: "사내 안내 메일 제목 후보 추천",
    messages: buildMessages(
      "assistant-history-notice-title",
      "2026-03-23T09:10:00+09:00",
      "사내 안내 메일 제목을 조금 더 정중하고 깔끔하게 3개 추천해줘. 주제는 주말 셔틀 운영시간 변경 안내야.",
      [
        "아래처럼 정리할 수 있습니다.",
        "",
        "1. [운영 안내] 주말 셔틀 운영시간 변경 사항 안내",
        "2. 주말 셔틀 운영시간 조정 안내드립니다",
        "3. 주말 셔틀 이용 관련 변경 사항 안내",
        "",
        "조금 더 부드러운 톤이 필요하면 사내 공지형, 고객 안내형, 현장 운영형으로 나눠 다시 제안드릴 수 있습니다.",
      ].join("\n")
    ),
  },
  {
    id: "customer-reply",
    title: "고객 답변 문구 다듬기",
    description: "문의 답변을 더 친절하게 정리",
    messages: buildMessages(
      "assistant-history-customer-reply",
      "2026-03-23T10:00:00+09:00",
      "고객 문의 답변 문장을 조금 더 친절하고 자연스럽게 다듬어줘. 문장은 '현재 예약 변경은 고객센터로 문의 부탁드립니다.' 이야.",
      [
        "다듬은 문장은 아래처럼 쓸 수 있습니다.",
        "",
        "안녕하세요. 예약 변경이 필요하신 경우 고객센터로 문의해 주시면 신속하게 안내드리겠습니다.",
        "",
        "조금 더 짧게 쓰면:",
        "예약 변경 관련 문의는 고객센터로 연락 주시면 안내해 드리겠습니다.",
      ].join("\n")
    ),
  },
  {
    id: "schedule-notice",
    title: "일정 변경 안내 문구",
    description: "일정 변경 공지를 짧고 부드럽게 정리",
    messages: buildMessages(
      "assistant-history-schedule-notice",
      "2026-03-23T10:10:00+09:00",
      "일정 변경 안내 문구를 부드럽고 간결하게 다듬어줘. 고객에게 보내는 문자라고 생각하면 돼.",
      [
        "문자 안내용으로는 아래처럼 정리할 수 있습니다.",
        "",
        "안녕하세요. 운영 일정이 일부 조정되어 안내드립니다.",
        "변경된 일정은 안내 페이지에서 확인하실 수 있으며, 문의 사항은 고객센터로 연락 부탁드립니다.",
        "이용에 불편을 드려 죄송합니다.",
      ].join("\n")
    ),
  },
]

export function getAssistantPresetMessages(presetId: string | null) {
  if (!presetId) return null
  return assistantHistoryPresets.find((item) => item.id === presetId)?.messages ?? null
}
