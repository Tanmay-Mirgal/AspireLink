import React from "react"



export function ChartContainer({ className, ...props }) {
  return <div className={`relative ${className}`} {...props} />
}

export function ChartTooltipContent({ className, ...props }) {
  return (
    <div className={`rounded-md border bg-popover p-4 text-popover-foreground shadow-sm ${className}`} {...props} />
  )
}

export function ChartTooltipItem({ label, value, color }) {
  return (
    <div className="flex items-center space-x-2">
      {color && <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
      <span className="text-xs font-semibold">{label}</span>
      <span className="text-xs text-muted-foreground">{value}</span>
    </div>
  )
}

export function ChartTooltip({ className, ...props }) {
  return <div className={className} {...props} />
}

