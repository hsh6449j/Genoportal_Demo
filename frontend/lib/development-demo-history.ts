import { Message } from "@/lib/event-system"

type DevelopmentHistoryPreset = {
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
      isMarkdown: true,
    },
  ]
}

export const developmentPromptSuggestions = [
  "예약 안내 메시지 발송 API 예시를 만들어줘.",
  "일별 매출 집계 SQL 예시를 작성해줘.",
  "고객보호 알림 배치 스크립트 구조를 제안해줘.",
]

export const developmentHistoryPresets: DevelopmentHistoryPreset[] = [
  {
    id: "reservation-api",
    title: "예약 안내 API 생성",
    description: "예약 안내 메시지 발송용 API 예시",
    messages: buildMessages(
      "development-history-reservation-api",
      "2026-03-23T13:10:00+09:00",
      "리조트 예약 안내 메시지를 생성하는 API 예시를 FastAPI 기준으로 만들어줘.",
      [
        "아래처럼 시작하면 데모와 실제 확장 모두 대응하기 좋습니다.",
        "",
        "```python",
        "from fastapi import APIRouter",
        "from pydantic import BaseModel",
        "",
        'router = APIRouter(prefix=\"/api/customer-support\", tags=[\"customer-support\"])',
        "",
        "class ReservationMessageRequest(BaseModel):",
        "    reservation_id: str",
        "    customer_name: str",
        "    check_in_date: str",
        "    check_out_date: str",
        "    scenario: str",
        "",
        "class ReservationMessageResponse(BaseModel):",
        "    message_title: str",
        "    message_body: str",
        "    channel: str",
        "",
        "@router.post(\"/reservation-message\", response_model=ReservationMessageResponse)",
        "def generate_reservation_message(payload: ReservationMessageRequest):",
        "    return ReservationMessageResponse(",
        '        message_title=\"체크인 안내\",',
        '        message_body=f\"안녕하세요. 강원랜드입니다. {payload.check_in_date} 체크인 안내를 보내드립니다.\",',
        '        channel=\"kakao\",',
        "    )",
        "```",
        "",
        "필요하면 같은 구조로 SMS, 카카오 알림톡, 이메일 채널 분기까지 확장할 수 있습니다.",
      ].join("\n"),
    ),
  },
  {
    id: "sales-sql",
    title: "일별 매출 집계 SQL",
    description: "운영 리포트용 매출 집계 쿼리",
    messages: buildMessages(
      "development-history-sales-sql",
      "2026-03-23T13:30:00+09:00",
      "일별 매출 추이를 보는 SQL 예시를 만들어줘. 객실, 카지노, 식음 매출을 합산하는 형태면 돼.",
      [
        "운영 대시보드용으로는 아래 예시처럼 작성할 수 있습니다.",
        "",
        "```sql",
        "SELECT",
        "  sales_date,",
        "  SUM(room_revenue) AS room_revenue,",
        "  SUM(casino_revenue) AS casino_revenue,",
        "  SUM(fnb_revenue) AS fnb_revenue,",
        "  SUM(room_revenue + casino_revenue + fnb_revenue) AS total_revenue",
        "FROM daily_sales_summary",
        "WHERE sales_date BETWEEN DATE '2026-03-01' AND DATE '2026-03-31'",
        "GROUP BY sales_date",
        "ORDER BY sales_date ASC;",
        "```",
        "",
        "여기에 객실 점유율이나 고객 수를 조인하면 운영 분석 화면과도 자연스럽게 연결됩니다.",
      ].join("\n"),
    ),
  },
  {
    id: "protection-batch",
    title: "고객보호 알림 배치",
    description: "보호 대상 고객 알림 작업 예시",
    messages: buildMessages(
      "development-history-protection-batch",
      "2026-03-23T13:50:00+09:00",
      "고객보호 대상자에게 안내 메시지를 보내는 배치 스크립트 구조를 간단히 보여줘.",
      [
        "배치 작업은 아래처럼 구성할 수 있습니다.",
        "",
        "```python",
        "def run_protection_notification_batch(target_date: str):",
        "    targets = load_protection_targets(target_date)",
        "",
        "    for customer in targets:",
        "        message = build_protection_message(",
        "            customer_name=customer[\"name\"],",
        "            risk_level=customer[\"risk_level\"],",
        "            support_contact=\"1588-7789\",",
        "        )",
        "        send_kakao_notification(customer[\"phone\"], message)",
        "",
        "    return {",
        '        \"target_count\": len(targets),',
        '        \"status\": \"completed\",',
        "    }",
        "```",
        "",
        "실서비스에서는 대상 추출, 발송 로그 적재, 실패 재시도까지 함께 두는 편이 좋습니다.",
      ].join("\n"),
    ),
  },
]

export function getDevelopmentPresetMessages(presetId: string | null) {
  if (!presetId) return null
  return developmentHistoryPresets.find((item) => item.id === presetId)?.messages ?? null
}
