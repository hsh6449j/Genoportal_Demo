"use client"

import { FormattingTool } from "@/components/FormattingTool"

export default function FormattingPage() {
  return (
    <div className="h-full overflow-auto bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8 space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Civil Service Support</p>
          <h1 className="text-3xl font-bold text-foreground">민원처리 지원</h1>
          <p className="text-sm text-muted-foreground">
            민원 응대 메시지와 회신 초안을 빠르게 정리하는 화면입니다.
          </p>
        </div>
        <FormattingTool />
      </div>
    </div>
  )
}
