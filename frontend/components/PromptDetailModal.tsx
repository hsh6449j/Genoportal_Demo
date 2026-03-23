"use client"

import { Eye, Heart, Clock, User, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { type Prompt } from "./PromptCard"

interface PromptDetailModalProps {
  prompt: Prompt | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onLike?: (id: string) => void
}

export function PromptDetailModal({ prompt, open, onOpenChange, onLike }: PromptDetailModalProps) {
  const [copied, setCopied] = useState(false)

  if (!prompt) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy prompt:", error)
    }
  }

  const handleLike = () => {
    onLike?.(prompt.id)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "방금 전"
    if (diffInHours < 24) return `${diffInHours}시간 전`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}일 전`
    if (diffInHours < 720) return `${Math.floor(diffInHours / 168)}주 전`
    return `${Math.floor(diffInHours / 720)}개월 전`
  }

  const getSectorColor = (sector: string) => {
    const colors = {
      macro: "bg-blue-100 text-blue-800 border-blue-100",
      semiconductor: "bg-purple-100 text-purple-800 border-purple-100",
      game: "bg-green-100 text-green-800 border-green-100",
      automotive: "bg-red-100 text-red-800 border-red-100",
      petrochemical: "bg-orange-100 text-orange-800 border-orange-100",
      shipbuilding: "bg-cyan-100 text-cyan-800 border-cyan-100",
      aviation: "bg-indigo-100 text-indigo-800 border-indigo-100",
      steel: "bg-gray-100 text-gray-800 border-gray-100",
      retail: "bg-pink-100 text-pink-800 border-pink-100",
      culture: "bg-yellow-100 text-yellow-800 border-yellow-100",
      finance: "bg-emerald-100 text-emerald-800 border-emerald-100"
    }
    return colors[sector as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-100"
  }

  const getSectorDisplayName = (sector: string) => {
    const names = {
      macro: "매크로",
      semiconductor: "반도체",
      game: "게임",
      automotive: "자동차",
      petrochemical: "정유/화학",
      shipbuilding: "조선/해운",
      aviation: "항공",
      steel: "철강",
      retail: "유통",
      culture: "문화",
      finance: "금융"
    }
    return names[sector as keyof typeof names] || sector
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold pr-8">
            {prompt.aiTitle ?? prompt.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{prompt.author}{prompt.department ? ` · ${prompt.department}` : ""}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatTimeAgo(prompt.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{prompt.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{prompt.likes.toLocaleString()}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={prompt.isLiked ? "text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 mr-1 ${prompt.isLiked ? "fill-current" : ""}`} />
                좋아요
              </Button>
            </div>
          </div>

          {/* Tags and Sector */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={getSectorColor(prompt.sector)}>
              {getSectorDisplayName(prompt.sector)}
            </Badge>

            {prompt.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs" style={{ backgroundColor: 'white', color: 'rgb(20, 40, 168)', borderColor: 'rgb(20, 40, 168)' }}>
                #{tag}
              </Badge>
            ))}

            {/* trending badge removed as requested */}
          </div>

          <Separator />

          {/* Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">프롬프트 내용</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    복사
                  </>
                )}
              </Button>
            </div>

            <div className="relative">
              <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                  {prompt.content}
                </pre>
              </div>
            </div>
          </div>

          {/* Usage Tips */}
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              💡 사용 팁
            </h4>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• 프롬프트를 복사하여 AI 모델에 직접 사용하세요</li>
              <li>• 필요에 따라 내용을 수정하여 더 구체적으로 만들어보세요</li>
              <li>• 관련 데이터나 컨텍스트를 추가하면 더 나은 결과를 얻을 수 있습니다</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
