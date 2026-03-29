import { USER_PORTFOLIO, MARKET_DATA } from '@/lib/mock-market'
import { Link } from 'react-router-dom'

export default function PortfolioSummary() {
  const holdings = USER_PORTFOLIO.holdings.map(h => {
    const team = MARKET_DATA.find(t => t.id === h.teamId)!
    const value = h.quantity * team.price
    const pnl = (team.price - h.avgBuyPrice) * h.quantity
    const pnlPercent = ((team.price - h.avgBuyPrice) / h.avgBuyPrice) * 100
    return { ...h, team, value, pnl, pnlPercent }
  }).filter(h => h.team)

  const totalValue = holdings.reduce((s, h) => s + h.value, 0) + USER_PORTFOLIO.balance
  const totalPnL = holdings.reduce((s, h) => s + h.pnl, 0)

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Portfolio Value</p>
          <p className="text-3xl font-mono font-bold text-foreground">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`text-sm font-mono mt-1 ${totalPnL >= 0 ? 'text-gain' : 'text-loss'}`}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            {' '}({USER_PORTFOLIO.totalPnLPercent >= 0 ? '+' : ''}{USER_PORTFOLIO.totalPnLPercent.toFixed(2)}%)
          </p>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="text-sm font-mono font-semibold text-foreground">${USER_PORTFOLIO.balance.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Positions</p>
            <p className="text-sm font-mono font-semibold text-foreground">{holdings.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-6 text-xs text-muted-foreground px-3 pb-2 border-b border-border">
          <span className="col-span-2">Asset</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Price</span>
          <span className="text-right">Value</span>
          <span className="text-right">P&L</span>
        </div>
        {holdings.map(h => (
          <Link
            key={h.teamId}
            to={`/team/${h.teamId}`}
            className="grid grid-cols-6 items-center text-sm px-3 py-2.5 rounded-md hover:bg-secondary/50 transition-colors"
          >
            <div className="col-span-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: h.team.color }} />
              <span className="font-mono text-xs text-foreground">{h.team.ticker}</span>
            </div>
            <span className="text-right font-mono text-foreground">{h.quantity}</span>
            <span className="text-right font-mono text-foreground">${h.team.price.toFixed(2)}</span>
            <span className="text-right font-mono text-foreground">${h.value.toFixed(0)}</span>
            <span className={`text-right font-mono ${h.pnl >= 0 ? 'text-gain' : 'text-loss'}`}>
              {h.pnl >= 0 ? '+' : ''}{h.pnlPercent.toFixed(1)}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
