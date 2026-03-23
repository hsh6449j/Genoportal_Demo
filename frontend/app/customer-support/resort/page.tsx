"use client"

import { FormattingTool } from "@/components/FormattingTool"

export default function ResortCustomerSupportPage() {
  return (
    <div className="h-full overflow-auto bg-background">
      <div className="mx-auto max-w-5xl space-y-4 px-6 py-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Customer Support</p>
          <h1 className="text-3xl font-bold text-foreground">리조트 예약 안내 메시지 생성</h1>
          <p className="text-sm text-muted-foreground">
            예약 확인, 체크인, 부대시설 이용 안내 문구를 빠르게 생성하는 화면입니다.
          </p>
        </div>
        <FormattingTool />
      </div>
    </div>
  )
}
