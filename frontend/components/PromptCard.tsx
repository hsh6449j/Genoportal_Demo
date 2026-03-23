"use client"

import { Eye, Heart, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export interface Prompt {
  id: string
  title: string
  content: string
  author: string
  department?: string
  sector: string
  tags: string[]
  views: number
  viewsWeek?: number
  likes: number
  createdAt: Date
  aiTitle?: string
  isTrending?: boolean
  isLiked?: boolean
}

interface PromptCardProps {
  prompt: Prompt
  onLike?: (id: string) => void
  onClick?: (id: string) => void
  showDepartmentOnly?: boolean
  likeIcon?: "heart" | "thumbsUp"
  truncateTitle?: boolean
}

export function PromptCard({ prompt, onLike, onClick, showDepartmentOnly = false, likeIcon = "heart", truncateTitle = false }: PromptCardProps) {
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

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onLike?.(prompt.id)
  }

  const handleCardClick = () => {
    onClick?.(prompt.id)
  }

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer group relative bg-card"
      onClick={handleCardClick}
    >

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className={`font-semibold text-base leading-tight pr-2 ${truncateTitle ? "truncate" : "line-clamp-2"}`}>
            {prompt.aiTitle ?? prompt.title}
          </h3>
          {likeIcon === "thumbsUp" ? (
            <ThumbsUp
              className={`h-4 w-4 flex-shrink-0 transition-colors ${
                prompt.isLiked
                  ? "text-blue-600 fill-blue-600"
                  : "text-muted-foreground hover:text-blue-600"
              }`}
              onClick={handleLikeClick}
            />
          ) : (
            <Heart
              className={`h-4 w-4 flex-shrink-0 transition-colors ${
                prompt.isLiked
                  ? "text-red-500 fill-red-500"
                  : "text-muted-foreground hover:text-red-500"
              }`}
              onClick={handleLikeClick}
            />
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={getSectorColor(prompt.sector)}>
              {prompt.sector === 'macro' && '매크로'}
              {prompt.sector === 'semiconductor' && '반도체'}
              {prompt.sector === 'game' && '게임'}
              {prompt.sector === 'automotive' && '자동차'}
              {prompt.sector === 'petrochemical' && '정유/화학'}
              {prompt.sector === 'shipbuilding' && '조선/해운'}
              {prompt.sector === 'aviation' && '항공'}
              {prompt.sector === 'steel' && '철강'}
              {prompt.sector === 'retail' && '유통'}
              {prompt.sector === 'culture' && '문화'}
              {prompt.sector === 'finance' && '금융'}
            </Badge>

            {prompt.tags.slice(0, 2).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-muted text-foreground border-border"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          {/* trending badge removed as requested */}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
          {prompt.content}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{prompt.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              {likeIcon === "thumbsUp" ? (
                <ThumbsUp className="h-3 w-3" />
              ) : (
                <Heart className="h-3 w-3" />
              )}
              <span>{prompt.likes.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>{formatTimeAgo(prompt.createdAt)}</span>
            {showDepartmentOnly ? (
              prompt.department ? (
                <span className="text-xs opacity-70">• {prompt.department}</span>
              ) : null
            ) : (
              <span className="text-xs opacity-70">• {prompt.author}{prompt.department ? ` · ${prompt.department}` : ""}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
