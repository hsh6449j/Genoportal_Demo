import { Message } from "@/lib/event-system"

type ComplianceHistoryPreset = {
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

export const compliancePromptSuggestions = [
  "복무규정에서 연차 사용 기준을 간단히 설명해줘.",
  "사내규정 답변 시 근거 조항을 함께 보여주는 예시를 정리해줘.",
  "시행일이 다른 규정을 확인할 때 어떤 정보를 같이 보여주면 좋은지 알려줘.",
]

export const complianceHistoryPresets: ComplianceHistoryPreset[] = [
  {
    id: "leave-policy",
    title: "연차 사용 기준 확인",
    description: "복무규정 기준을 간단히 정리",
    messages: buildMessages(
      "compliance-history-leave-policy",
      "2026-03-23T11:00:00+09:00",
      "복무규정 기준으로 연차 사용 시 확인해야 할 기본 기준을 간단히 정리해줘.",
      [
        "연차 사용 기준은 아래처럼 정리할 수 있습니다.",
        "",
        "1. 사용 가능 일수 확인",
        "- 당해 연도 발생 연차 일수와 잔여 일수를 먼저 확인합니다.",
        "- 반차·반반차 사용 가능 여부는 내부 규정 또는 운영 지침을 함께 봅니다.",
        "",
        "2. 신청 절차 확인",
        "- 사전 승인 필요 여부와 결재 라인을 확인합니다.",
        "- 시스템 신청 시 입력해야 하는 항목과 제출 시점을 함께 안내합니다.",
        "",
        "3. 제한 사항 확인",
        "- 특정 기간 사용 제한, 대체 인력 여부, 업무 인수인계 기준을 점검합니다.",
        "- 시행일이 다른 규정이 있는 경우 최신 개정 기준을 우선 안내합니다.",
        "",
        "4. 답변 형식",
        "- 관련 조항명, 시행일, 참고 원문을 함께 보여주면 실무 활용도가 높아집니다.",
      ].join("\n")
    ),
  },
  {
    id: "rule-grounding",
    title: "근거 조항 표시 예시",
    description: "사내규정 답변 시 표시 형식",
    messages: buildMessages(
      "compliance-history-rule-grounding",
      "2026-03-23T11:20:00+09:00",
      "사내규정 검색 답변에서 근거 조항을 어떻게 보여주면 좋을지 예시를 보여줘.",
      [
        "답변 표시는 아래 형식이 가장 이해하기 쉽습니다.",
        "",
        "- 답변 요약: 연차는 사전 승인 후 사용할 수 있습니다.",
        "- 근거 규정: 복무규정 제12조 제3항",
        "- 시행일: 2025-01-01",
        "- 참고 원문: '직원은 소속 부서장의 승인을 받아 연차휴가를 사용할 수 있다.'",
        "",
        "추가로",
        "- 개정 이력 여부",
        "- 유사 질문 링크",
        "- 담당 부서 연락처",
        "를 같이 보여주면 활용성이 높습니다.",
      ].join("\n")
    ),
  },
  {
    id: "effective-date",
    title: "시행일 확인 가이드",
    description: "개정 규정 조회 시 확인 포인트",
    messages: buildMessages(
      "compliance-history-effective-date",
      "2026-03-23T11:40:00+09:00",
      "개정 이력이 있는 규정을 검색할 때 시행일을 어떻게 안내하면 좋을지 정리해줘.",
      [
        "시행일이 다른 규정은 아래 기준으로 안내하는 것이 좋습니다.",
        "",
        "- 현재 적용 중인 최신 개정본의 시행일을 먼저 제시합니다.",
        "- 과거 규정을 참조하는 경우에는 적용 기간을 함께 표시합니다.",
        "- 답변 본문에는 '현재 기준'인지 '과거 기준'인지 명확히 적습니다.",
        "",
        "예:",
        "- 현재 기준 시행일: 2025-01-01",
        "- 이전 기준 시행일: 2023-07-01 ~ 2024-12-31",
        "- 참고 조항: 인사규정 제8조",
      ].join("\n")
    ),
  },
]

export function getCompliancePresetMessages(presetId: string | null) {
  if (!presetId) return null
  return complianceHistoryPresets.find((item) => item.id === presetId)?.messages ?? null
}
