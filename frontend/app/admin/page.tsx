"use client"

import { useMemo, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { Login } from "@/components/login"
import { RefreshCw, Users, Activity, GitBranch, Loader2 } from "lucide-react"

type ApiStatus = "Operational" | "Degraded" | "Down"
type JobStatus = "Success" | "Running" | "Failed" | "Queued"

function StatusDot({ color }: { color: string }) {
  return <span style={{ backgroundColor: color }} className="inline-block h-2.5 w-2.5 rounded-full mr-2 align-middle" />
}

function apiColor(status: ApiStatus) {
  switch (status) {
    case "Operational":
      return "#16a34a" // green
    case "Degraded":
      return "#f59e0b" // amber
    case "Down":
      return "#dc2626" // red
  }
}

function jobColor(status: JobStatus) {
  switch (status) {
    case "Success":
      return "#16a34a"
    case "Running":
      return "#3b82f6"
    case "Queued":
      return "#6b7280"
    case "Failed":
      return "#dc2626"
  }
}

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [seed, setSeed] = useState(1)

  const data = useMemo(() => {
    // Deterministic pseudo-random based on seed for demo purposes
    const rand = (n: number) => {
      const x = Math.sin(seed * (n + 1)) * 10000
      return x - Math.floor(x)
    }

    const api: ApiStatus = rand(1) > 0.8 ? "Down" : rand(2) > 0.5 ? "Operational" : "Degraded"
    const batch: JobStatus = rand(3) > 0.75 ? "Failed" : rand(4) > 0.5 ? "Success" : rand(5) > 0.5 ? "Running" : "Queued"
    const workflows: { name: string; status: JobStatus; updatedAt: string }[] = [
      { name: "Daily Ingestion", status: rand(6) > 0.2 ? "Success" : "Failed", updatedAt: "오늘 09:15" },
      { name: "Vector Sync", status: rand(7) > 0.5 ? "Running" : "Queued", updatedAt: "오늘 09:12" },
      { name: "Report Builder", status: rand(8) > 0.7 ? "Failed" : "Success", updatedAt: "어제 18:42" },
    ]

    const users = [
      { id: 1, name: "김투자", email: "kim@example.com", role: "Admin", active: true },
      { id: 2, name: "박리서", email: "park@example.com", role: "Analyst", active: true },
      { id: 3, name: "이데브", email: "lee@example.com", role: "Viewer", active: rand(9) > 0.3 },
    ]

    const lastBatchTime = rand(10) > 0.5 ? "오늘 02:00" : "어제 23:00"

    return { api, batch, workflows, users, lastBatchTime }
  }, [seed])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">관리자</h1>
        <Button variant="outline" size="sm" onClick={() => setSeed((s) => s + 1)}>
          <RefreshCw className="h-4 w-4 mr-2" /> 새로고침
        </Button>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList>
          <TabsTrigger value="status">상태 모니터링</TabsTrigger>
          <TabsTrigger value="users">사용자 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">실시간 API Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <StatusDot color={apiColor(data.api)} />
                  <Badge variant="secondary" className="font-medium">{data.api}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">헬스체크: /api/health</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">배치 데이터 적재 Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <StatusDot color={jobColor(data.batch)} />
                  <Badge variant="secondary" className="font-medium">{data.batch}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">최근 실행: {data.lastBatchTime}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">워크플로우 Status</CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.workflows.map((w) => (
                    <div key={w.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <StatusDot color={jobColor(w.status)} />
                        <span className="text-sm truncate">{w.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-normal text-xs">{w.status}</Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{w.updatedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">최근 이벤트</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">타입</TableHead>
                    <TableHead>메시지</TableHead>
                    <TableHead className="w-[180px]">시간</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>API</TableCell>
                    <TableCell>헬스체크 지연 시간 증가</TableCell>
                    <TableCell>오늘 09:10</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Batch</TableCell>
                    <TableCell>어제 적재 성공 (1,248건)</TableCell>
                    <TableCell>오늘 02:05</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Workflow</TableCell>
                    <TableCell>Vector Sync 대기열에 추가됨</TableCell>
                    <TableCell>오늘 09:12</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm">사용자 관리</CardTitle>
              </div>
              <div className="space-x-2">
                <Button size="sm" variant="outline">새로고침</Button>
                <Button size="sm">사용자 추가</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead className="w-[140px]">권한</TableHead>
                    <TableHead className="w-[120px]">상태</TableHead>
                    <TableHead className="w-[200px]">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{u.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <StatusDot color={u.active ? "#16a34a" : "#6b7280"} />
                          <span className="text-sm">{u.active ? "Active" : "Disabled"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">권한 수정</Button>
                          <Button variant="outline" size="sm">비활성화</Button>
                          <Button variant="destructive" size="sm">삭제</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
