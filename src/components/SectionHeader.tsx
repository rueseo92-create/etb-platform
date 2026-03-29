interface SectionHeaderProps {
  badge?: string
  title: string
  subtitle?: string
}

export default function SectionHeader({ badge, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      {badge && (
        <span className="inline-block text-xs font-mono text-primary border border-primary/30 rounded-full px-3 py-1 mb-3">
          {badge}
        </span>
      )}
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  )
}
