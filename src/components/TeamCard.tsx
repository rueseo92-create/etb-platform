import { Link } from 'react-router-dom'
import type { TeamToken } from '@/lib/mock-market'
import PriceChart from './PriceChart'

export default function TeamCard({ team }: { team: TeamToken }) {
  const isPositive = team.change24h >= 0

  return (
    <Link
      to={`/team/${team.id}`}
      className="group block rounded-lg border border-border bg-card p-4 transition-all hover:border-muted-foreground/30 hover:bg-surface-elevated"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team.color }} />
          <div>
            <div className="text-sm font-semibold text-foreground">{team.name}</div>
            <div className="text-xs font-mono text-muted-foreground">{team.ticker}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-mono font-semibold text-foreground">${team.price.toFixed(2)}</div>
          <div className={`text-xs font-mono ${isPositive ? 'text-gain' : 'text-loss'}`}>
            {isPositive ? '+' : ''}{team.change24h.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="h-[70px] -mx-1">
        <PriceChart
          data={team.priceHistory.slice(-30)}
          height={70}
          showNav={false}
          positive={isPositive}
          showAxes={false}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>NAV ${team.navPerToken.toFixed(2)}</span>
        <span>Vol ${(team.volume24h / 1000).toFixed(0)}K</span>
      </div>
    </Link>
  )
}
