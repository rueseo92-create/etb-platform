import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  className?: string
  valueClass?: string
}

export default function StatCard({ label, value, sub, className, valueClass }: StatCardProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-5', className)}>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={cn('text-2xl font-mono font-bold text-foreground mt-1', valueClass)}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  )
}
