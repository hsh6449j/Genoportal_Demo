"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PromptCard, type Prompt } from "@/components/PromptCard"
import { PromptDetailModal } from "@/components/PromptDetailModal"

export default function PromptHubPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSector, setSelectedSector] = useState("all")
  const [likedPrompts, setLikedPrompts] = useState<Set<string>>(new Set())
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Load liked prompts from localStorage on component mount
  useEffect(() => {
    const savedLikes = localStorage.getItem("likedPrompts")
    if (savedLikes) {
      setLikedPrompts(new Set(JSON.parse(savedLikes)))
    }
  }, [])

  // Save liked prompts to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("likedPrompts", JSON.stringify([...likedPrompts]))
  }, [likedPrompts])

  // Mock data - will be replaced with real data
  const mockPrompts: Prompt[] = [
    {
      id: "1",
      title: "엔비디아 실적 분석해줘",
      content: "엔비디아 최근 3개 분기 실적을 분석해주고, AI 시장 성장과 함께 향후 1년간 주가 전망도 함께 설명해줘. 특히 데이터센터 부문 매출 증가율이 지속가능한지 궁금해.",
      author: "테크분석가",
      sector: "semiconductor",
      tags: ["실적분석", "AI", "주가전망"],
      views: 1247,
      likes: 89,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isTrending: true
    },
    {
      id: "2",
      title: "게임업계 투자 어디가 좋을까?",
      content: "모바일게임, PC게임, 콘솔게임 중에서 올해 투자하기 좋은 분야가 어디야? 각 분야별 대표 기업들 수익성도 비교해서 설명해줘. 특히 국내 게임사들 중에서 추천할만한 곳 있나?",
      author: "게임투자전문가",
      sector: "game",
      tags: ["투자", "수익성", "게임사"],
      views: 892,
      likes: 67,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isLiked: true
    },
    {
      id: "3",
      title: "테슬라 vs 현대차 전기차 경쟁력 비교",
      content: "테슬라와 현대차의 전기차 기술력, 생산능력, 배터리 공급망을 비교분석해줘. 향후 5년간 글로벌 전기차 시장에서 어느 쪽이 더 유리할 것 같아? 주가 관점에서도 의견 줘봐.",
      author: "자동차애널리스트",
      sector: "automotive",
      tags: ["전기차", "비교분석", "배터리"],
      views: 1105,
      likes: 78,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: "4",
      title: "한국 금리 언제까지 올라갈까?",
      content: "한국은행 기준금리가 현재 3.5%인데, 미국 연준 정책과 국내 인플레이션 상황 보면 언제까지 올라갈 것 같아? 부동산 시장이랑 주식시장에 미칠 영향도 함께 분석해줘.",
      author: "매크로전문가",
      sector: "macro",
      tags: ["금리", "인플레이션", "부동산"],
      views: 756,
      likes: 54,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: "5",
      title: "유가 하락이 정유사에 미치는 영향",
      content: "최근 유가가 배럴당 80달러에서 70달러로 떨어졌는데, SK이노베이션이나 S-Oil 같은 정유사들한테는 좋은 거야 나쁜 거야? 크래킹 마진이랑 제품 가격 변동을 고려해서 설명해줘.",
      author: "화학분석가",
      sector: "petrochemical",
      tags: ["유가", "정유사", "마진분석"],
      views: 623,
      likes: 41,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: "6",
      title: "넷플릭스 한국 콘텐츠 수익성 어때?",
      content: "오징어게임, 킹덤, 지옥 같은 한국 오리지널 콘텐츠들이 넷플릭스 전체 매출에 얼마나 기여하고 있어? K-드라마 제작비 대비 글로벌 조회수 ROI도 궁금하고, 다른 OTT들과 비교는 어떤지 알려줘.",
      author: "문화산업전문가",
      sector: "culture",
      tags: ["넷플릭스", "K-드라마", "ROI"],
      views: 934,
      likes: 112,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      id: "7",
      title: "삼성전자 vs TSMC 파운드리 경쟁력",
      content: "삼성전자 파운드리 사업부와 TSMC 비교해줘. 3나노 공정 기술력이랑 주요 고객사들, 그리고 향후 시장점유율 전망은 어때? 애플이 삼성으로 다시 돌아올 가능성도 있나?",
      author: "반도체전문가",
      sector: "semiconductor",
      tags: ["파운드리", "삼성전자", "TSMC"],
      views: 1456,
      likes: 98,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      isTrending: true
    },
    {
      id: "8",
      title: "현대중공업 조선 수주 분석",
      content: "현대중공업이 최근 LNG선 수주를 많이 따냈던데, 전체 수주잔량이랑 매출 전망은 어떻게 돼? 중국 조선사들과 경쟁에서 우위를 유지할 수 있을까? 주가 관점에서도 의견 줘봐.",
      author: "조선업분석가",
      sector: "shipbuilding",
      tags: ["수주", "LNG선", "경쟁력"],
      views: 687,
      likes: 45,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    },
    {
      id: "9",
      title: "대한항공 아시아나 합병 효과",
      content: "대한항공이 아시아나항공 인수한 후 실제 시너지 효과가 나타나고 있어? 노선 통합이랑 비용 절감 효과, 그리고 글로벌 항공업계에서 경쟁력 향상 정도를 알고 싶어.",
      author: "항공업전문가",
      sector: "aviation",
      tags: ["M&A", "시너지", "노선통합"],
      views: 823,
      likes: 67,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: "10",
      title: "포스코 vs 중국 철강사 경쟁",
      content: "포스코가 중국 철강업체들과 비교해서 기술력이나 수익성은 어떤 수준이야? 특히 전기차용 전기강판 시장에서는 경쟁력이 있나? 향후 글로벌 철강 시장 전망도 궁금해.",
      author: "철강업애널리스트",
      sector: "steel",
      tags: ["경쟁력", "전기강판", "글로벌"],
      views: 542,
      likes: 38,
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
    },
    {
      id: "11",
      title: "신세계 vs 롯데 유통업계 순위",
      content: "신세계그룹이랑 롯데그룹 중에서 유통사업 부문만 놓고 보면 어디가 더 잘하고 있어? 온라인 쇼핑몰 성장률이랑 오프라인 매장 수익성도 비교해서 설명해줘. 이마트 vs 롯데마트는?",
      author: "유통업전문가",
      sector: "retail",
      tags: ["유통업체", "온라인", "수익성"],
      views: 976,
      likes: 71,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ]

  // Tag filtering removed per request

  const handleLike = (id: string) => {
    setLikedPrompts(prev => {
      const newLikes = new Set(prev)
      if (newLikes.has(id)) {
        newLikes.delete(id)
      } else {
        newLikes.add(id)
      }
      return newLikes
    })
  }

  const handlePromptClick = (id: string) => {
    const prompt = promptsWithLikeStatus.find(p => p.id === id)
    if (prompt) {
      setSelectedPrompt(prompt)
      setModalOpen(true)
    }
  }

  // Trending algorithm - based on recent activity and growth rate
  const calculateTrendingScore = (prompt: Prompt) => {
    const hoursAgo = (Date.now() - prompt.createdAt.getTime()) / (1000 * 60 * 60)
    const baseScore = prompt.views * 0.7 + prompt.likes * 0.3

    // Boost recent prompts
    const recencyBoost = Math.max(0, 1 - hoursAgo / 168) // 168 hours = 1 week

    // Simulate growth rate (in real app, this would be calculated from historical data)
    const growthRate = (prompt.views > 1000 || prompt.likes > 50) ? 1.5 : 1.0

    return baseScore * (1 + recencyBoost) * growthRate
  }

  // Apply liked status, update likes count, and calculate trending
  const departmentList = ["리서치전략팀", "퀀트리서치팀", "이머징리서치팀", "산업분석팀", "투자전략팀"]

  const promptsWithLikeStatus = mockPrompts.map(prompt => {
    const updatedPrompt = {
      ...prompt,
      isLiked: likedPrompts.has(prompt.id),
      likes: prompt.likes + (likedPrompts.has(prompt.id) ? 1 : 0) - (prompt.isLiked ? 1 : 0)
    }

    // Calculate trending score for sorting
    const trendingScore = calculateTrendingScore(updatedPrompt)

    return {
      ...updatedPrompt,
      aiTitle: updatedPrompt.title, // Demo: use title as AI 요약 타이틀
      department: departmentList[(parseInt(updatedPrompt.id, 10) || 0) % departmentList.length],
      isTrending: updatedPrompt.isTrending, // Only use original isTrending value
      trendingScore
    }
  })

  // Filter logic (no sort here; main list is always chronological)
  const filteredPrompts = promptsWithLikeStatus
    .filter((prompt) => {
      // Search filter
      const searchMatch = searchTerm === "" ||
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      // Sector filter
      const sectorMatch = selectedSector === "all" || prompt.sector === selectedSector

      return searchMatch && sectorMatch
    })

  // Chronological (time-order) list for the main section
  const chronologicalPrompts = [...filteredPrompts].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  )

  // Weekly window helpers
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000
  const withinWeek = (d: Date) => (Date.now() - d.getTime()) <= oneWeekMs

  // Popular prompts by weekly views (Top-N)
  const popularLimit = 8 // was 5; increased by request (+3)
  const popularPrompts = promptsWithLikeStatus
    .filter(p => withinWeek(p.createdAt))
    .map(p => ({ ...p, viewsWeek: p.views }))
    .sort((a, b) => (b.viewsWeek || 0) - (a.viewsWeek || 0))
    .slice(0, popularLimit)

  // Popular tags by weekly generation count (Top-N)
  // Removed weekly tag and sector stats for simplified layout

  return (
    <div className="container mx-auto p-6 space-y-6 h-screen flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">프롬프트 허브</h2>
          </div>
        </div>

        {/* (검색/필터는 우측 리스트 상단으로 이동) */}
      </div>
      {/* Two-column layout: left popular cards, right chronological list */}
      <div className="flex-1 min-h-0 md:flex md:gap-6">
        {/* Left: 인기 프롬프트 (주간) */}
        <div className="md:w-3/5 md:pr-3 h-full min-h-0 flex flex-col">
          <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">인기 프롬프트 (주간)</h2>
            </div>
            {popularPrompts.length === 0 ? (
              <div className="text-sm text-muted-foreground">최근 1주 내 인기 프롬프트가 없습니다.</div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {popularPrompts.map((p) => (
                    <PromptCard
                      key={p.id}
                      prompt={p}
                      onLike={handleLike}
                      onClick={handlePromptClick}
                      showDepartmentOnly
                      likeIcon="thumbsUp"
                      truncateTitle
                    />
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Right: 검색/필터 + 시간 순 전체 목록 (폭 맞춰 밀착) */}
        <div className="md:w-2/5 md:pl-3 mt-6 md:mt-0 h-full min-h-0 flex flex-col">
          {/* Section Title */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">전체 프롬프트</h2>
          </div>
          {/* Search and Sector Filter aligned to list width */}
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="프롬프트 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="섹터 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className={`hover:bg-[#F0F4FA] hover:text-[#153AD4] data-[highlighted]:bg-[#F0F4FA] data-[highlighted]:text-[#153AD4] ${selectedSector === "all" ? "bg-[#F0F4FA] text-[#153AD4]" : ""}`}>전체 섹터</SelectItem>
                <SelectItem value="macro" className={`hover:bg-[#F0F4FA] hover:text-[#153AD4] data-[highlighted]:bg-[#F0F4FA] data-[highlighted]:text-[#153AD4] ${selectedSector === "macro" ? "bg-[#F0F4FA] text-[#153AD4]" : ""}`}>매크로</SelectItem>
                <SelectItem value="semiconductor" className={`hover:bg-[#F0F4FA] hover:text-[#153AD4] data-[highlighted]:bg-[#F0F4FA] data-[highlighted]:text-[#153AD4] ${selectedSector === "semiconductor" ? "bg-[#F0F4FA] text-[#153AD4]" : ""}`}>반도체</SelectItem>
                <SelectItem value="game" className={`hover:bg-[#F0F4FA] hover:text-[#153AD4] data-[highlighted]:bg-[#F0F4FA] data-[highlighted]:text-[#153AD4] ${selectedSector === "game" ? "bg-[#F0F4FA] text-[#153AD4]" : ""}`}>게임</SelectItem>
                <SelectItem value="automotive" className={`hover:bg-[#F0F4FA] hover:text-[#153AD4] data-[highlighted]:bg-[#F0F4FA] data-[highlighted]:text-[#153AD4] ${selectedSector === "automotive" ? "bg-[#F0F4FA] text-[#153AD4]" : ""}`}>자동차</SelectItem>
                <SelectItem value="petrochemical" className={`hover:bg-[#F0F4FA] hover:text-[#153AD4] data-[highlighted]:bg-[#F0F4FA] data-[highlighted]:text-[#153AD4] ${selectedSector === "petrochemical" ? "bg-[#F0F4FA] text-[#153AD4]" : ""}`}>정유/화학</SelectItem>
                <SelectItem value="shipbuilding" className={`hover:bg-[#F0F4FA] hover:text-[#153AD4] data-[highlighted]:bg-[#F0F4FA] data-[highlighted]:text-[#153AD4] ${selectedSector === "shipbuilding" ? "bg-[#F0F4FA] text-[#153AD4]" : ""}`}>조선/해운</SelectItem>
                <SelectItem value="aviation" className={`hover:bg-[#F0F4FA] hover:text-[#153AD4] data-[highlighted]:bg-[#F0F4FA] data-[highlighted]:text-[#153AD4] ${selectedSector === "aviation" ? "bg-[#F0F4FA] text-[#153AD4]" : ""}`}>항공</SelectItem>
                <SelectItem value="steel" className={`hover:bg-[#F0F4FA] hover:text-[#153AD4] data-[highlighted]:bg-[#F0F4FA] data-[highlighted]:text-[#153AD4] ${selectedSector === "steel" ? "bg-[#F0F4FA] text-[#153AD4]" : ""}`}>철강</SelectItem>
                <SelectItem value="retail" className={`hover:bg-[#F0F4FA] hover:text-[#153AD4] data-[highlighted]:bg-[#F0F4FA] data-[highlighted]:text-[#153AD4] ${selectedSector === "retail" ? "bg-[#F0F4FA] text-[#153AD4]" : ""}`}>유통</SelectItem>
                <SelectItem value="culture" className={`hover:bg-[#F0F4FA] hover:text-[#153AD4] data-[highlighted]:bg-[#F0F4FA] data-[highlighted]:text-[#153AD4] ${selectedSector === "culture" ? "bg-[#F0F4FA] text-[#153AD4]" : ""}`}>문화</SelectItem>
                <SelectItem value="finance" className={`hover:bg-[#F0F4FA] hover:text-[#153AD4] data-[highlighted]:bg-[#F0F4FA] data-[highlighted]:text-[#153AD4] ${selectedSector === "finance" ? "bg-[#F0F4FA] text-[#153AD4]" : ""}`}>금융</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {chronologicalPrompts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">검색 조건에 맞는 프롬프트가 없습니다.</p>
              <p className="text-muted-foreground text-sm mt-2">다른 검색어나 필터를 시도해보세요.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">
                  {chronologicalPrompts.length}개의 프롬프트를 찾았습니다 (시간 순)
                </p>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto divide-y border rounded-md">
                {chronologicalPrompts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 hover:bg-muted cursor-pointer"
                    onClick={() => handlePromptClick(p.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{p.aiTitle || p.title}</div>
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{p.content}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline">{p.sector}</Badge>
                          {p.tags.slice(0, 3).map((t) => (
                            <Badge key={t} variant="outline" className="text-xs">#{t}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end text-xs text-muted-foreground whitespace-nowrap">
                        <span>{new Date(p.createdAt).toLocaleString()}</span>
                        {p.department && <span className="mt-1">{p.department}</span>}
                        <span className="mt-1">조회 {p.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Prompt Detail Modal */}
      <PromptDetailModal
        prompt={selectedPrompt}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onLike={handleLike}
      />
    </div>
  )
}
