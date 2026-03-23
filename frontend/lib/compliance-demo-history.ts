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
  "수의계약이 가능한 기본 기준을 실무자 관점에서 간단히 설명해줘.",
  "수의계약 검토 시 확인해야 할 체크리스트를 정리해줘.",
  "비교 견적이 필요한 경우와 생략 가능한 경우를 구분해서 알려줘.",
]

export const complianceHistoryPresets: ComplianceHistoryPreset[] = [
  {
    id: "sole-source-checklist",
    title: "수의계약 체크리스트",
    description: "검토 포인트와 증빙 항목 정리",
    messages: buildMessages(
      "compliance-history-checklist",
      "2026-03-23T11:00:00+09:00",
      "수의계약 검토 시 실무자가 바로 쓸 수 있는 체크리스트를 정리해줘.",
      [
        "수의계약 검토 체크리스트입니다.",
        "",
        "1. 계약 가능 사유 확인",
        "- 내부 규정상 수의계약 허용 사유에 해당하는지",
        "- 긴급성, 독점성, 금액 기준 등 근거가 명확한지",
        "",
        "2. 증빙 자료 확인",
        "- 비교 견적 또는 시장 조사 자료가 있는지",
        "- 특정 업체 선정 사유가 문서화되어 있는지",
        "",
        "3. 내부 승인 절차 확인",
        "- 결재 권한자와 검토 부서가 맞는지",
        "- 예산 편성 및 집행 가능 여부가 확인되었는지",
        "",
        "4. 사후 감사 대응",
        "- 계약 사유서, 검토 의견, 승인 이력 보관 여부",
        "- 관련 규정 조항과 내부 기준이 함께 정리되어 있는지",
      ].join("\n")
    ),
  },
  {
    id: "sole-source-reason",
    title: "수의계약 사유 정리",
    description: "선정 사유를 문서화하는 예시",
    messages: buildMessages(
      "compliance-history-reason",
      "2026-03-23T11:20:00+09:00",
      "특정 업체로 수의계약을 추진할 때 선정 사유를 어떻게 정리하면 좋을지 예시를 보여줘.",
      [
        "문서화 예시는 아래처럼 정리할 수 있습니다.",
        "",
        "- 본 계약은 기존 시스템과의 연계가 필수적이며, 동일 환경에서 즉시 적용 가능한 업체가 제한적입니다.",
        "- 사업 일정상 단기간 내 구축이 필요하여 일반 경쟁 절차 진행 시 운영 공백이 우려됩니다.",
        "- 관련 기능과 유지보수 이력을 고려할 때 기존 수행 경험이 있는 업체가 가장 적합합니다.",
        "",
        "실무적으로는 위 사유에 더해",
        "- 기존 수행 실적",
        "- 기술적 연속성",
        "- 일정상 제약",
        "- 내부 검토 의견",
        "을 함께 붙이면 감사 대응력이 높아집니다.",
      ].join("\n")
    ),
  },
  {
    id: "sole-source-quote",
    title: "비교 견적 필요 여부",
    description: "견적 확보 기준과 예외 정리",
    messages: buildMessages(
      "compliance-history-quote",
      "2026-03-23T11:40:00+09:00",
      "수의계약인데도 비교 견적이 필요한지 판단 기준을 간단히 정리해줘.",
      [
        "일반적으로는 수의계약이라도 가격 적정성 확인을 위해 비교 견적이나 시장 조사 자료를 확보하는 편이 안전합니다.",
        "",
        "다만 예외적으로는",
        "- 기술적 독점성이 명확한 경우",
        "- 단일 공급자 외 대안이 현실적으로 없는 경우",
        "- 긴급 상황으로 즉시 계약이 필요한 경우",
        "에는 비교 견적 확보가 어렵거나 제한될 수 있습니다.",
        "",
        "이 경우에도 최소한",
        "- 왜 대체 업체가 없는지",
        "- 왜 긴급한지",
        "- 가격 적정성은 어떤 방식으로 확인했는지",
        "를 문서로 남기는 것이 좋습니다.",
      ].join("\n")
    ),
  },
]

export function getCompliancePresetMessages(presetId: string | null) {
  if (!presetId) return null
  return complianceHistoryPresets.find((item) => item.id === presetId)?.messages ?? null
}
