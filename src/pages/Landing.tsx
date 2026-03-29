import { MARKET_DATA } from '@/lib/mock-market'
import PortfolioSummary from '@/components/PortfolioSummary'
import TeamCard from '@/components/TeamCard'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const topMovers = [...MARKET_DATA].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)).slice(0, 4)
  const upcomingMatches = MARKET_DATA.filter(t => t.upcomingMatch).slice(0, 4)

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <PortfolioSummary />

      {/* Upcoming Matches */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Upcoming Match Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {upcomingMatches.map(team => (
            <Link
              key={team.id}
              to={`/team/${team.id}`}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 hover:bg-surface-elevated transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team.color }} />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {team.ticker} vs {team.upcomingMatch!.opponent}
                  </p>
                  <p className="text-xs text-muted-foreground">{team.upcomingMatch!.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Win odds</p>
                <p className="text-sm font-mono text-foreground">{team.upcomingMatch!.odds.win.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Movers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Top Movers</h2>
          <Link to="/markets" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topMovers.map(team => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>

      {/* Market Overview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Market Overview</h2>
          <Link to="/markets" className="text-xs text-primary hover:underline">Full market</Link>
        </div>
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-[2rem_1fr_5rem_5rem_5rem_5rem] gap-x-2 px-4 py-2 border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider">
            <span>#</span>
            <span>Token</span>
            <span className="text-right">Price</span>
            <span className="text-right">24h</span>
            <span className="text-right">Mkt Cap</span>
            <span className="text-right">ELO</span>
          </div>
          {MARKET_DATA.slice(0, 10).map((team, i) => (
            <Link
              key={team.id}
              to={`/team/${team.id}`}
              className="grid grid-cols-[2rem_1fr_5rem_5rem_5rem_5rem] gap-x-2 px-4 py-2.5 border-b border-border/50 items-center hover:bg-secondary/30 transition-colors"
            >
              <span className="text-xs font-mono text-muted-foreground">{i + 1}</span>
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: team.color }} />
                <span className="text-sm font-medium text-foreground truncate">{team.name}</span>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">{team.ticker}</span>
              </div>
              <span className="text-right text-sm font-mono text-foreground">${team.price.toFixed(2)}</span>
              <span className={`text-right text-sm font-mono ${team.change24h >= 0 ? 'text-gain' : 'text-loss'}`}>
                {team.change24h >= 0 ? '+' : ''}{team.change24h.toFixed(2)}%
              </span>
              <span className="text-right text-xs font-mono text-muted-foreground">
                ${(team.marketCap / 1e6).toFixed(1)}M
              </span>
              <span className="text-right text-xs font-mono text-foreground">{team.eloRating.toFixed(0)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
