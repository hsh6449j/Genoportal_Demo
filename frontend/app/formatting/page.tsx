"use client"

import { FormattingTool } from "@/components/FormattingTool"

export default function FormattingPage() {
  return (
    <div className="h-full overflow-auto bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8 space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Customer Support</p>
          <h1 className="text-3xl font-bold text-foreground">고객 지원 에이전트</h1>
          <p className="text-sm text-muted-foreground">
            예약 안내, 고객 응대, 주의 안내 메시지를 빠르게 생성하는 화면입니다.
          </p>
        </div>
        <FormattingTool />
      </div>
    </div>
  )
}
