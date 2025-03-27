"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function StatsCard({ title, value, icon: Icon, change, changeType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${changeType === "positive" ? "text-green-500" : "text-red-500"}`}>
          {change} from last month
        </p>
      </CardContent>
    </Card>
  )
}