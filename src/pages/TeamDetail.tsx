import { useParams, Link } from 'react-router-dom'
import { getTeamById, MARKET_DATA } from '@/lib/mock-market'
import PriceChart from '@/components/PriceChart'
import TradingPanel from '@/components/TradingPanel'
import OrderBook from '@/components/OrderBook'

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>()
  const team = getTeamById(id || '')

  if (!team) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Team not found</p>
        <Link to="/markets" className="text-primary text-sm hover:underline mt-2 inline-block">Back to Markets</Link>
      </div>
    )
  }

  const isPositive = team.change24h >= 0
  const spread = ((team.price - team.navPerToken) / team.navPerToken * 100)

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: team.color }} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">{team.name}</h1>
              <span className="text-sm font-mono text-muted-foreground">{team.ticker}</span>
              {team.isBig6 && (
                <span className="text-[10px] font-mono text-primary bg-primary/10 rounded px-1.5 py-0.5">BIG6</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Rank #{team.eloRank} by ELO Rating</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold text-foreground">${team.price.toFixed(2)}</p>
          <p className={`text-sm font-mono ${isPositive ? 'text-gain' : 'text-loss'}`}>
            {isPositive ? '+' : ''}{team.change24h.toFixed(2)}% (24h)
            <span className="text-muted-foreground mx-1">|</span>
            <span className={team.change7d >= 0 ? 'text-gain' : 'text-loss'}>
              {team.change7d >= 0 ? '+' : ''}{team.change7d.toFixed(2)}% (7d)
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left: Chart + Info */}
        <div className="space-y-6">
          {/* Price Chart */}
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h3 className="text-sm font-semibold text-foreground">Price Chart</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-0.5 rounded bg-gain" />
                    <span className="text-muted-foreground">Price</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-0.5 rounded bg-accent border-dashed" />
                    <span className="text-muted-foreground">NAV</span>
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                {['1D', '1W', '1M', '3M'].map(period => (
                  <button
                    key={period}
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      period === '3M' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <PriceChart data={team.priceHistory} height={350} positive={isPositive} />
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Market Cap', value: `$${(team.marketCap / 1e6).toFixed(1)}M` },
              { label: 'Volume (24h)', value: `$${(team.volume24h / 1e3).toFixed(0)}K` },
              { label: 'NAV/Token', value: `$${team.navPerToken.toFixed(2)}` },
              { label: 'Price/NAV', value: `${spread >= 0 ? '+' : ''}${spread.toFixed(2)}%`, cls: spread >= 0 ? 'text-gain' : 'text-loss' },
              { label: 'ELO Rating', value: team.eloRating.toFixed(0) },
              { label: 'Reserve Share', value: `${team.reserveShare.toFixed(2)}%` },
              { label: 'Supply', value: `${(team.supply / 1e6).toFixed(0)}M` },
              { label: 'Season', value: `${team.seasonStats.wins}W ${team.seasonStats.draws}D ${team.seasonStats.losses}L` },
            ].map(stat => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className={`text-sm font-mono font-semibold mt-0.5 ${'cls' in stat ? stat.cls : 'text-foreground'}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Order Book */}
          <OrderBook team={team} />

          {/* Recent Matches */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Recent Match Results</h3>
            <div className="space-y-2">
              {team.recentMatches.map((match, i) => {
                const isWin = match.result.startsWith('W')
                const isDraw = match.result.startsWith('D')
                return (
                  <div key={i} className="flex items-center justify-between rounded-md bg-secondary/50 px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                        isWin ? 'bg-gain/20 text-gain' : isDraw ? 'bg-warning/20 text-warning' : 'bg-loss/20 text-loss'
                      }`}>
                        {match.result[0]}
                      </span>
                      <div>
                        <p className="text-sm text-foreground">vs {match.opponent}</p>
                        <p className="text-xs text-muted-foreground">{match.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-muted-foreground">{match.result.slice(2)}</p>
                      <p className={`text-xs font-mono ${match.priceImpact >= 0 ? 'text-gain' : 'text-loss'}`}>
                        {match.priceImpact >= 0 ? '+' : ''}{match.priceImpact.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming Match */}
          {team.upcomingMatch && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Next Match</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">
                    {team.ticker} vs {team.upcomingMatch.opponent}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{team.upcomingMatch.date}</p>
                </div>
                <div className="flex gap-4 text-center">
                  {[
                    { label: 'Win', value: team.upcomingMatch.odds.win, cls: 'text-gain' },
                    { label: 'Draw', value: team.upcomingMatch.odds.draw, cls: 'text-warning' },
                    { label: 'Lose', value: team.upcomingMatch.odds.lose, cls: 'text-loss' },
                  ].map(o => (
                    <div key={o.label}>
                      <p className="text-[10px] text-muted-foreground">{o.label}</p>
                      <p className={`text-sm font-mono font-semibold ${o.cls}`}>{o.value.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Trading Panel */}
        <div className="space-y-4">
          <TradingPanel team={team} />

          {/* Similar Tokens */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-xs font-semibold text-foreground mb-3">Similar Tokens</h3>
            <div className="space-y-2">
              {MARKET_DATA
                .filter(t => t.id !== team.id)
                .sort((a, b) => Math.abs(a.eloRating - team.eloRating) - Math.abs(b.eloRating - team.eloRating))
                .slice(0, 4)
                .map(t => (
                  <Link
                    key={t.id}
                    to={`/team/${t.id}`}
                    className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                      <span className="text-xs font-mono text-foreground">{t.ticker}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-foreground">${t.price.toFixed(2)}</span>
                      <span className={`text-xs font-mono ${t.change24h >= 0 ? 'text-gain' : 'text-loss'}`}>
                        {t.change24h >= 0 ? '+' : ''}{t.change24h.toFixed(1)}%
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
