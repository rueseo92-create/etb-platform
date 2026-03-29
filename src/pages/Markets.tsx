import { useState, useMemo } from 'react'
import { MARKET_DATA } from '@/lib/mock-market'
import TeamCard from '@/components/TeamCard'

type ViewMode = 'grid' | 'list'
type SortKey = 'rank' | 'price' | 'change' | 'volume' | 'cap'

export default function Markets() {
  const [view, setView] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortKey>('rank')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let arr = [...MARKET_DATA]
    if (search) {
      const q = search.toLowerCase()
      arr = arr.filter(t => t.name.toLowerCase().includes(q) || t.ticker.toLowerCase().includes(q))
    }
    switch (sortBy) {
      case 'rank': return arr.sort((a, b) => a.eloRank - b.eloRank)
      case 'price': return arr.sort((a, b) => b.price - a.price)
      case 'change': return arr.sort((a, b) => b.change24h - a.change24h)
      case 'volume': return arr.sort((a, b) => b.volume24h - a.volume24h)
      case 'cap': return arr.sort((a, b) => b.marketCap - a.marketCap)
    }
  }, [sortBy, search])

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Markets</h1>
          <p className="text-xs text-muted-foreground">{MARKET_DATA.length} team tokens available</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="rounded-md bg-secondary border border-border px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-48"
          />
          <div className="flex rounded-md bg-secondary overflow-hidden">
            {(['grid', 'list'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === v ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`}
              >
                {v === 'grid' ? '▦' : '☰'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex gap-2">
        {([
          ['rank', 'Rank'], ['price', 'Price'], ['change', '24h Change'],
          ['volume', 'Volume'], ['cap', 'Market Cap'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSortBy(key as SortKey)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              sortBy === key
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid view */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filtered.map(team => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        /* List view */
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-[2.5rem_1fr_6rem_6rem_6rem_6rem_5rem] gap-x-2 px-4 py-2.5 border-b border-border text-[10px] text-muted-foreground uppercase tracking-wider">
            <span>#</span>
            <span>Token</span>
            <span className="text-right">Price</span>
            <span className="text-right">24h</span>
            <span className="text-right">7d</span>
            <span className="text-right">Volume</span>
            <span className="text-right">ELO</span>
          </div>
          {filtered.map((team, i) => (
            <a
              key={team.id}
              href={`/team/${team.id}`}
              className="grid grid-cols-[2.5rem_1fr_6rem_6rem_6rem_6rem_5rem] gap-x-2 px-4 py-3 border-b border-border/50 items-center hover:bg-secondary/30 transition-colors"
            >
              <span className="text-xs font-mono text-muted-foreground">{i + 1}</span>
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: team.color }} />
                <span className="text-sm font-medium text-foreground truncate">{team.name}</span>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">{team.ticker}</span>
                {team.isBig6 && (
                  <span className="text-[9px] font-mono text-primary bg-primary/10 rounded px-1 shrink-0">BIG6</span>
                )}
              </div>
              <span className="text-right text-sm font-mono text-foreground">${team.price.toFixed(2)}</span>
              <span className={`text-right text-sm font-mono ${team.change24h >= 0 ? 'text-gain' : 'text-loss'}`}>
                {team.change24h >= 0 ? '+' : ''}{team.change24h.toFixed(2)}%
              </span>
              <span className={`text-right text-sm font-mono ${team.change7d >= 0 ? 'text-gain' : 'text-loss'}`}>
                {team.change7d >= 0 ? '+' : ''}{team.change7d.toFixed(2)}%
              </span>
              <span className="text-right text-xs font-mono text-muted-foreground">
                ${(team.volume24h / 1e3).toFixed(0)}K
              </span>
              <span className="text-right text-xs font-mono text-foreground">{team.eloRating.toFixed(0)}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
